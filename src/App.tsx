import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Teacher, Student, ColumnsBySem, ViewMode, Semester } from './types';
import {
  DEFAULT_TEACHERS,
  INITIAL_STUDENTS,
  INITIAL_COLUMNS,
  ALL_CLASSES,
  getDefaultColumnsForTeacher,
  getDefaultTeacherColumns
} from './data/initialData';
import {
  calculateAverage,
  generateExportPDF,
  getStudentScoresForTeacher,
  generateInitialTeacherScoresForStudent
} from './utils/gradeCalculations';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { TableView } from './components/TableView';
import { TeacherAuthModal } from './components/TeacherAuthModal';
import { TeacherProfileModal } from './components/TeacherProfileModal';
import { AdminTeacherManagementModal } from './components/AdminTeacherManagementModal';
import { AddStudentModal } from './components/AddStudentModal';
import { ImportCsvModal } from './components/ImportCsvModal';
import { ConfirmModal } from './components/ConfirmModal';
import { PromptModal } from './components/PromptModal';
import { LoginPortal } from './components/LoginPortal';
import {
  fetchCloudData,
  saveCloudDataDebounced,
  subscribeToCloudUpdates
} from './utils/cloudSync';

// Storage keys
const STORAGE_KEYS = {
  TEACHERS: 'mts_teachers_v1',
  CURRENT_TEACHER: 'mts_current_teacher_id_v1',
  STUDENTS: 'mts_students_v1',
  COLUMNS: 'mts_columns_v1',
  TEACHER_COLUMNS: 'mts_teacher_columns_v2',
  SELECTED_CLASS: 'mts_selected_class_v1',
  SEMESTER: 'mts_selected_sem_v1',
  VIEW_MODE: 'mts_view_mode_v1'
};

export default function App() {
  // --- STATE INITIALIZATION ---
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHERS);
      if (saved) {
        const parsed: Teacher[] = JSON.parse(saved);
        return parsed.map((t) => {
          if (t.role === 'admin' || t.username === 'admin.mts') {
            return {
              ...t,
              fullName: 'Administrator Madrasah',
              degree: 'Admin Sistem',
              avatarInitials: 'A'
            };
          }
          return t;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_TEACHERS;
  });

  const [currentTeacherId, setCurrentTeacherId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_TEACHER) || DEFAULT_TEACHERS[0].id;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed: Student[] = JSON.parse(saved);
        return parsed.map((s) => {
          if (!s.teacherScores) {
            return {
              ...s,
              teacherScores: generateInitialTeacherScoresForStudent(s.id, s.scores || { '1': {}, '2': {} })
            };
          }
          return s;
        });
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_STUDENTS.map((s) => ({
      ...s,
      teacherScores: generateInitialTeacherScoresForStudent(s.id, s.scores || { '1': {}, '2': {} })
    }));
  });

  const [teacherColumns, setTeacherColumns] = useState<
    Record<string, Record<string, { '1': ColumnsBySem; '2': ColumnsBySem }>>
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEACHER_COLUMNS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return getDefaultTeacherColumns();
  });

  const [selectedClass, setSelectedClass] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_CLASS);
    return saved && ALL_CLASSES.includes(saved) ? saved : ALL_CLASSES[0];
  });

  const [semester, setSemester] = useState<Semester>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SEMESTER);
    return saved === '2' ? '2' : '1';
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return saved === 'absensi' ? 'absensi' : 'nilai';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Baru saja');
  const [isRealtimeSyncing, setIsRealtimeSyncing] = useState(false);
  const [isCloudConnected, setIsCloudConnected] = useState(true);

  // Portal Gate state: whether user has entered/logged in to portal
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('mts_session_active') === 'true';
  });

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);

  // Confirm modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Prompt rename modal state
  const [promptConfig, setPromptConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    initialValue: string;
    onSave: (val: string) => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    initialValue: '',
    onSave: () => {}
  });

  // Current Teacher lookup
  const currentTeacher = useMemo(() => {
    return teachers.find((t) => t.id === currentTeacherId) || teachers[0] || DEFAULT_TEACHERS[0];
  }, [teachers, currentTeacherId]);

  // Ensure columns exist for current teacher, selected class and semester
  const currentColumns = useMemo(() => {
    const tCols = teacherColumns[currentTeacherId];
    if (tCols && tCols[selectedClass] && tCols[selectedClass][semester]) {
      return tCols[selectedClass][semester];
    }
    return getDefaultColumnsForTeacher(currentTeacherId, currentTeacher?.subject);
  }, [teacherColumns, currentTeacherId, selectedClass, semester, currentTeacher?.subject]);

  // Broadcast channel for real-time multi-tab / multi-window sync
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('mts_edugrade_realtime_channel');
      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'SYNC_ALL') {
          if (payload.students) setStudents(payload.students);
          if (payload.teacherColumns) setTeacherColumns(payload.teacherColumns);
          if (payload.teachers) setTeachers(payload.teachers);
          setLastSavedTime(
            new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          );
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in this environment', e);
    }

    return () => {
      channel?.close();
    };
  }, []);

  // Multi-Device Cloud Sync Listener & Initial Fetch
  useEffect(() => {
    let isMounted = true;

    async function initCloudSync() {
      try {
        const res = await fetchCloudData();
        if (res.success && res.data && isMounted) {
          if (res.data.students && res.data.students.length > 0) {
            setStudents(res.data.students);
            localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(res.data.students));
          }
          if (res.data.teacherColumns && Object.keys(res.data.teacherColumns).length > 0) {
            setTeacherColumns(res.data.teacherColumns);
            localStorage.setItem(STORAGE_KEYS.TEACHER_COLUMNS, JSON.stringify(res.data.teacherColumns));
          }
          if (res.data.teachers && res.data.teachers.length > 0) {
            setTeachers(res.data.teachers);
            localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(res.data.teachers));
          }
          setIsCloudConnected(true);
          setLastSavedTime(
            new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          );
        } else if (!res.data) {
          // Cloud database empty: seed with initial state
          saveCloudDataDebounced({
            students,
            teacherColumns,
            teachers
          });
        }
      } catch (err) {
        console.warn('Gagal sinkron awal ke cloud:', err);
      }
    }

    initCloudSync();

    // Real-time multi-device subscription (SSE + Polling fallback)
    const unsubscribe = subscribeToCloudUpdates(async () => {
      try {
        const res = await fetchCloudData();
        if (res.success && res.data && isMounted) {
          if (res.data.students) setStudents(res.data.students);
          if (res.data.teacherColumns) setTeacherColumns(res.data.teacherColumns);
          if (res.data.teachers) setTeachers(res.data.teachers);
          setIsCloudConnected(true);
          setLastSavedTime(
            new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          );
        }
      } catch (e) {
        // silent catch
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Broadcast changes helper
  const broadcastSync = useCallback((st: Student[], cols: any, tch: Teacher[]) => {
    try {
      const channel = new BroadcastChannel('mts_edugrade_realtime_channel');
      channel.postMessage({
        type: 'SYNC_ALL',
        payload: { students: st, teacherColumns: cols, teachers: tch }
      });
      channel.close();
    } catch (e) {
      // ignore
    }
  }, []);

  // Trigger Save & Multi-Device Sync
  const persistData = useCallback(
    (newStudents: Student[], newColumns: any, newTeachers: Teacher[]) => {
      setIsRealtimeSyncing(true);
      try {
        // 1. Local device storage (instant offline cache)
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(newStudents));
        localStorage.setItem(STORAGE_KEYS.TEACHER_COLUMNS, JSON.stringify(newColumns));
        localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(newTeachers));

        // 2. Same-device multi-tab broadcast
        broadcastSync(newStudents, newColumns, newTeachers);

        // 3. Multi-device cloud sync (saves to server and notifies other phones/laptops)
        saveCloudDataDebounced(
          {
            students: newStudents,
            teacherColumns: newColumns,
            teachers: newTeachers
          },
          (timestamp) => {
            setIsCloudConnected(true);
            setLastSavedTime(
              new Date(timestamp).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })
            );
          }
        );

        setLastSavedTime(
          new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        );
      } catch (e) {
        console.error('Error persisting data', e);
      } finally {
        setTimeout(() => setIsRealtimeSyncing(false), 250);
      }
    },
    [broadcastSync]
  );

  // Sync state preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CLASS, selectedClass);
  }, [selectedClass]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEMESTER, semester);
  }, [semester]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_TEACHER, currentTeacherId);
  }, [currentTeacherId]);

  // --- ACTIONS ---

  // Update a student score or attendance (teacher-specific)
  const handleUpdateScore = useCallback(
    (studentId: number, colId: string, value: any) => {
      setStudents((prev) => {
        const next = prev.map((s) => {
          if (s.id !== studentId) return s;

          let finalVal = value;
          if (['H', 'S', 'I', 'A', 'B', 'T', ''].includes(value)) {
            finalVal = value;
          } else {
            const num = parseFloat(value);
            if (isNaN(num)) finalVal = '';
            else if (num > 100) finalVal = 100;
            else if (num < 0) finalVal = 0;
            else finalVal = num;
          }

          const currentTeacherScores = getStudentScoresForTeacher(s, currentTeacherId);
          const currentSemScores = { ...(currentTeacherScores[semester] || {}) };
          currentSemScores[colId] = finalVal;

          const updatedTeacherScores = {
            ...(s.teacherScores || {}),
            [currentTeacherId]: {
              ...currentTeacherScores,
              [semester]: currentSemScores
            }
          };

          return {
            ...s,
            scores:
              currentTeacherId === DEFAULT_TEACHERS[0].id
                ? {
                    ...s.scores,
                    [semester]: currentSemScores
                  }
                : s.scores,
            teacherScores: updatedTeacherScores
          };
        });

        persistData(next, teacherColumns, teachers);
        return next;
      });
    },
    [currentTeacherId, semester, teacherColumns, teachers, persistData]
  );

  // Update student name (Admin-only)
  const handleUpdateStudentName = useCallback(
    (studentId: number, newName: string) => {
      if (currentTeacher.role !== 'admin') return;
      setStudents((prev) => {
        const next = prev.map((s) => (s.id === studentId ? { ...s, name: newName } : s));
        persistData(next, teacherColumns, teachers);
        return next;
      });
    },
    [currentTeacher.role, teacherColumns, teachers, persistData]
  );

  // Delete student (Admin-only)
  const handleDeleteStudent = useCallback(
    (student: Student) => {
      if (currentTeacher.role !== 'admin') return;
      setConfirmConfig({
        isOpen: true,
        title: 'Hapus Data Siswa (Khusus Admin)',
        message: `Apakah Anda yakin ingin menghapus data siswa "${student.name}" dari Kelas ${student.class}? Siswa ini akan terhapus dari seluruh database madrasah dan semua mata pelajaran guru.`,
        onConfirm: () => {
          setStudents((prev) => {
            const next = prev.filter((s) => s.id !== student.id);
            persistData(next, teacherColumns, teachers);
            return next;
          });
          setConfirmConfig((c) => ({ ...c, isOpen: false }));
        }
      });
    },
    [currentTeacher.role, teacherColumns, teachers, persistData]
  );

  // Add new student (Admin-only)
  const handleAddStudent = useCallback(
    (data: { name: string; class: string; nisn?: string; gender?: 'L' | 'P' }) => {
      if (currentTeacher.role !== 'admin') return;
      const newStudent: Student = {
        id: Date.now(),
        name: data.name,
        class: data.class,
        gender: data.gender,
        nisn: data.nisn,
        scores: { '1': {}, '2': {} },
        teacherScores: {}
      };

      setStudents((prev) => {
        const next = [...prev, newStudent];
        persistData(next, teacherColumns, teachers);
        return next;
      });
    },
    [currentTeacher.role, teacherColumns, teachers, persistData]
  );

  // Batch import CSV students (Admin-only)
  const handleImportStudents = useCallback(
    (importedList: Array<{ name: string; class: string; gender?: 'L' | 'P'; nisn?: string }>) => {
      if (currentTeacher.role !== 'admin') return;
      const baseTime = Date.now();
      const newStudents: Student[] = importedList.map((item, idx) => ({
        id: baseTime + idx,
        name: item.name,
        class: item.class,
        gender: item.gender,
        nisn: item.nisn,
        scores: { '1': {}, '2': {} },
        teacherScores: {}
      }));

      setStudents((prev) => {
        const next = [...prev, ...newStudents];
        persistData(next, teacherColumns, teachers);
        return next;
      });
    },
    [currentTeacher.role, teacherColumns, teachers, persistData]
  );

  // Add dynamic column (Teacher-specific)
  const handleAddColumn = useCallback(
    (category: keyof ColumnsBySem) => {
      setTeacherColumns((prev) => {
        const updated = JSON.parse(JSON.stringify(prev));
        if (!updated[currentTeacherId]) {
          updated[currentTeacherId] = {};
        }
        if (!updated[currentTeacherId][selectedClass]) {
          const defaultCols = getDefaultColumnsForTeacher(currentTeacherId, currentTeacher.subject);
          updated[currentTeacherId][selectedClass] = {
            '1': JSON.parse(JSON.stringify(defaultCols)),
            '2': JSON.parse(JSON.stringify(defaultCols))
          };
        }
        if (!updated[currentTeacherId][selectedClass][semester]) {
          const defaultCols = getDefaultColumnsForTeacher(currentTeacherId, currentTeacher.subject);
          updated[currentTeacherId][selectedClass][semester] = JSON.parse(JSON.stringify(defaultCols));
        }

        const cols = updated[currentTeacherId][selectedClass][semester][category];
        const newIndex = cols.length + 1;
        const newId = `${category}_${Date.now()}`;

        let defaultLabel = `${newIndex}`;
        if (category === 'absensi') {
          const now = new Date();
          const dd = String(now.getDate()).padStart(2, '0');
          const mm = String(now.getMonth() + 1).padStart(2, '0');
          defaultLabel = `${dd}/${mm}`;
        } else if (category === 'tugas') {
          defaultLabel = `UH ${newIndex}`;
        } else if (category === 'vocab') {
          defaultLabel = `Porto ${newIndex}`;
        } else if (category === 'percakapan') {
          defaultLabel = `Prak ${newIndex}`;
        } else if (category === 'uh') {
          defaultLabel = `Proy ${newIndex}`;
        }

        cols.push({ id: newId, label: defaultLabel });
        persistData(students, updated, teachers);
        return updated;
      });
    },
    [currentTeacherId, currentTeacher.subject, selectedClass, semester, students, teachers, persistData]
  );

  // Remove dynamic column (Teacher-specific)
  const handleRemoveColumn = useCallback(
    (category: keyof ColumnsBySem, colId: string) => {
      setConfirmConfig({
        isOpen: true,
        title: 'Hapus Kolom',
        message: 'Hapus kolom ini? Seluruh data nilai / absensi pada kolom ini untuk mata pelajaran Anda akan ikut terhapus.',
        onConfirm: () => {
          setTeacherColumns((prev) => {
            const updated = JSON.parse(JSON.stringify(prev));
            if (
              updated[currentTeacherId] &&
              updated[currentTeacherId][selectedClass] &&
              updated[currentTeacherId][selectedClass][semester]
            ) {
              updated[currentTeacherId][selectedClass][semester][category] = updated[currentTeacherId][
                selectedClass
              ][semester][category].filter((c: any) => c.id !== colId);
            }

            // Clean student teacherScores for this teacher
            const cleanedStudents = students.map((s) => {
              if (s.class !== selectedClass) return s;
              const teacherScoresObj = getStudentScoresForTeacher(s, currentTeacherId);
              const semScores = { ...(teacherScoresObj[semester] || {}) };
              delete semScores[colId];

              const updatedTeacherScores = {
                ...(s.teacherScores || {}),
                [currentTeacherId]: {
                  ...teacherScoresObj,
                  [semester]: semScores
                }
              };

              return {
                ...s,
                scores:
                  currentTeacherId === DEFAULT_TEACHERS[0].id
                    ? {
                        ...s.scores,
                        [semester]: semScores
                      }
                    : s.scores,
                teacherScores: updatedTeacherScores
              };
            });

            setStudents(cleanedStudents);
            persistData(cleanedStudents, updated, teachers);
            return updated;
          });
          setConfirmConfig((c) => ({ ...c, isOpen: false }));
        }
      });
    },
    [currentTeacherId, selectedClass, semester, students, teachers, persistData]
  );

  // Rename dynamic column (Teacher-specific)
  const handleRenameColumn = useCallback(
    (category: keyof ColumnsBySem, colId: string, currentLabel: string) => {
      setPromptConfig({
        isOpen: true,
        title: 'Ubah Nama / Tanggal Kolom',
        description: 'Masukkan label nama atau tanggal baru (contoh: "KD 3.1", "12/09", atau "Tgs 1"):',
        initialValue: currentLabel,
        onSave: (val) => {
          setTeacherColumns((prev) => {
            const updated = JSON.parse(JSON.stringify(prev));
            const col =
              updated[currentTeacherId]?.[selectedClass]?.[semester]?.[category]?.find((c: any) => c.id === colId);
            if (col) {
              col.label = val;
            }
            persistData(students, updated, teachers);
            return updated;
          });
          setPromptConfig((p) => ({ ...p, isOpen: false }));
        }
      });
    },
    [currentTeacherId, selectedClass, semester, students, teachers, persistData]
  );

  // Mark all students present (H) on latest attendance column for this teacher
  const handleMarkAllPresent = useCallback(() => {
    const absCols = currentColumns.absensi;
    if (absCols.length === 0) return;
    const latestCol = absCols[absCols.length - 1];

    setStudents((prev) => {
      const next = prev.map((s) => {
        if (s.class !== selectedClass) return s;
        const currentTeacherScores = getStudentScoresForTeacher(s, currentTeacherId);
        const semScores = { ...(currentTeacherScores[semester] || {}) };
        semScores[latestCol.id] = 'H';

        const updatedTeacherScores = {
          ...(s.teacherScores || {}),
          [currentTeacherId]: {
            ...currentTeacherScores,
            [semester]: semScores
          }
        };

        return {
          ...s,
          scores:
            currentTeacherId === DEFAULT_TEACHERS[0].id
              ? {
                  ...s.scores,
                  [semester]: semScores
                }
              : s.scores,
          teacherScores: updatedTeacherScores
        };
      });
      persistData(next, teacherColumns, teachers);
      return next;
    });
  }, [currentColumns, selectedClass, semester, currentTeacherId, teacherColumns, teachers, persistData]);

  // Export PDF
  const handleDownloadPdf = useCallback(() => {
    const filtered = students
      .filter((s) => s.class === selectedClass)
      .map((s) => ({
        ...s,
        scores: getStudentScoresForTeacher(s, currentTeacherId)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    generateExportPDF({
      students: filtered,
      className: selectedClass,
      semester,
      viewMode,
      columns: currentColumns,
      teacher: currentTeacher
    });
  }, [students, selectedClass, currentTeacherId, semester, viewMode, currentColumns, currentTeacher]);

  // Teacher Profile update
  const handleUpdateTeacher = useCallback(
    (updated: Teacher) => {
      setTeachers((prev) => {
        const next = prev.map((t) => (t.id === updated.id ? updated : t));
        persistData(students, teacherColumns, next);
        return next;
      });
    },
    [students, teacherColumns, persistData]
  );

  // Add new Teacher
  const handleAddTeacher = useCallback(
    (newTeacher: Teacher) => {
      setTeachers((prev) => {
        const next = [...prev, newTeacher];
        persistData(students, teacherColumns, next);
        return next;
      });
    },
    [students, teacherColumns, persistData]
  );

  // Delete Teacher (Admin function)
  const handleDeleteTeacher = useCallback(
    (teacherId: string) => {
      setTeachers((prev) => {
        const next = prev.filter((t) => t.id !== teacherId);
        persistData(students, teacherColumns, next);

        // If active teacher is deleted, fallback to the first available teacher
        if (currentTeacherId === teacherId && next.length > 0) {
          setCurrentTeacherId(next[0].id);
          localStorage.setItem(STORAGE_KEYS.CURRENT_TEACHER, next[0].id);
        }

        return next;
      });
    },
    [students, teacherColumns, currentTeacherId, persistData]
  );

  // Filter students for current class and search query, populated with teacher-specific scores
  const classStudents = useMemo(() => {
    return students
      .filter((s) => s.class === selectedClass)
      .filter((s) => (searchQuery ? s.name.toLowerCase().includes(searchQuery.toLowerCase()) : true))
      .map((s) => ({
        ...s,
        scores: getStudentScoresForTeacher(s, currentTeacherId)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [students, selectedClass, searchQuery, currentTeacherId]);

  // Calculate stats
  const classAverage = useMemo(() => {
    if (classStudents.length === 0) return 0;
    const total = classStudents.reduce((acc, s) => {
      const scores = s.scores[semester] || {};
      return acc + calculateAverage(scores, currentColumns);
    }, 0);
    return Math.round(total / classStudents.length);
  }, [classStudents, semester, currentColumns]);

  const overallAttendanceRate = useMemo(() => {
    if (classStudents.length === 0 || currentColumns.absensi.length === 0) return 100;
    let totalSlots = 0;
    let presentSlots = 0;

    classStudents.forEach((s) => {
      const scores = s.scores[semester] || {};
      currentColumns.absensi.forEach((c) => {
        const v = scores[c.id];
        if (v) {
          totalSlots++;
          if (v === 'H' || v === 'T') {
            presentSlots++;
          }
        }
      });
    });

    if (totalSlots === 0) return 100;
    return Math.round((presentSlots / totalSlots) * 100);
  }, [classStudents, semester, currentColumns]);

  const handleLoginFromPortal = (teacher: Teacher, rememberSession: boolean) => {
    setCurrentTeacherId(teacher.id);
    localStorage.setItem(STORAGE_KEYS.CURRENT_TEACHER, teacher.id);
    sessionStorage.setItem('mts_session_active', 'true');
    if (rememberSession) {
      localStorage.setItem('mts_remember_teacher', teacher.id);
    }
    setIsAuthenticated(true);
  };

  const handleLogoutToPortal = () => {
    sessionStorage.removeItem('mts_session_active');
    setIsAuthenticated(false);
  };

  // If user has not yet entered through the portal, show the Login Portal
  if (!isAuthenticated) {
    return (
      <LoginPortal
        teachers={teachers}
        onLogin={handleLoginFromPortal}
        syncStatusText="Server Cloud Terhubung • Sinkron di Semua Perangkat"
      />
    );
  }

  return (
    <div className="text-slate-800 min-h-screen flex antialiased bg-slate-50">
      {/* Sidebar Navigation & Teacher Portal */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentTeacher={currentTeacher}
        selectedClass={selectedClass}
        onSelectClass={setSelectedClass}
        students={students}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        isRealtimeSyncing={isRealtimeSyncing}
        onLogoutToPortal={handleLogoutToPortal}
        isCloudConnected={isCloudConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative w-full flex flex-col min-w-0">
        {/* Sticky Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          selectedClass={selectedClass}
          viewMode={viewMode}
          onSetViewMode={setViewMode}
          semester={semester}
          onSetSemester={setSemester}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAddStudent={() => setIsAddStudentOpen(true)}
          onOpenImportCsv={() => setIsImportCsvOpen(true)}
          onDownloadPdf={handleDownloadPdf}
          onMarkAllPresent={handleMarkAllPresent}
          teacher={currentTeacher}
          onLogoutToPortal={handleLogoutToPortal}
        />

        {/* Real-time Stats Cards */}
        <StatsBar
          totalStudents={classStudents.length}
          selectedClass={selectedClass}
          classAverage={classAverage}
          overallAttendanceRate={overallAttendanceRate}
          viewMode={viewMode}
          lastSavedText={lastSavedTime}
          teacherSubject={currentTeacher.subject}
        />

        {/* Dynamic Data Table */}
        <TableView
          students={classStudents}
          columns={currentColumns}
          viewMode={viewMode}
          semester={semester}
          onUpdateScore={handleUpdateScore}
          onUpdateStudentName={handleUpdateStudentName}
          onDeleteStudent={handleDeleteStudent}
          onAddColumn={handleAddColumn}
          onRemoveColumn={handleRemoveColumn}
          onRenameColumn={handleRenameColumn}
          onOpenAddStudent={() => setIsAddStudentOpen(true)}
          isAdmin={currentTeacher.role === 'admin'}
        />

        {/* Footer */}
        <footer className="mt-auto bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 shrink-0 border-t border-indigo-700 text-white">
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <p className="text-xs text-indigo-200 font-medium">
              &copy; 2026 <span className="text-white font-semibold">Absensi Digital & Penilaian Siswa</span> &bull; MTs NW Asmaul Husna Aik Bukak
            </p>
            <div className="text-xs text-indigo-300 flex items-center gap-1.5">
              <span>Dinas Kabupaten Lombok Tengah</span>
              <span>&bull;</span>
              <span className="text-emerald-300 font-medium">Real-Time Connected</span>
            </div>
          </div>
        </footer>
      </main>

      {/* --- MODALS --- */}

      {/* Teacher Authentication / Switcher Modal */}
      <TeacherAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        teachers={teachers}
        currentTeacher={currentTeacher}
        onSelectTeacher={(t) => {
          setCurrentTeacherId(t.id);
        }}
        onAddTeacher={handleAddTeacher}
        onDeleteTeacher={handleDeleteTeacher}
      />

      {/* Admin Exclusive Teacher Management Modal */}
      <AdminTeacherManagementModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        teachers={teachers}
        currentTeacher={currentTeacher}
        onAddTeacher={handleAddTeacher}
        onDeleteTeacher={handleDeleteTeacher}
        onUpdateTeacher={handleUpdateTeacher}
        onSwitchToAdmin={() => {
          const admin = teachers.find((t) => t.role === 'admin') || teachers[0];
          if (admin) {
            setCurrentTeacherId(admin.id);
          }
        }}
      />

      {/* Teacher Profile Edit Modal */}
      <TeacherProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        teacher={currentTeacher}
        onUpdateTeacher={handleUpdateTeacher}
      />

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        defaultClass={selectedClass}
        onAddStudent={handleAddStudent}
      />

      {/* Import CSV Modal */}
      <ImportCsvModal
        isOpen={isImportCsvOpen}
        onClose={() => setIsImportCsvOpen(false)}
        onImportStudents={handleImportStudents}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((c) => ({ ...c, isOpen: false }))}
      />

      {/* Prompt Rename Modal */}
      <PromptModal
        isOpen={promptConfig.isOpen}
        title={promptConfig.title}
        description={promptConfig.description}
        initialValue={promptConfig.initialValue}
        onSave={promptConfig.onSave}
        onCancel={() => setPromptConfig((p) => ({ ...p, isOpen: false }))}
      />
    </div>
  );
}
