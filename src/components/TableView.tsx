import React, { useState } from 'react';
import { ColumnsBySem, Student, ViewMode } from '../types';
import { calculateAverage, getGradeBadge } from '../utils/gradeCalculations';
import { Plus, X, Pencil, Check, Trash2, Settings, Users, UserPlus, Lock } from 'lucide-react';

interface TableViewProps {
  students: Student[];
  columns: ColumnsBySem;
  viewMode: ViewMode;
  semester: '1' | '2';
  onUpdateScore: (studentId: number, colId: string, value: any) => void;
  onUpdateStudentName: (studentId: number, newName: string) => void;
  onDeleteStudent: (student: Student) => void;
  onAddColumn: (category: keyof ColumnsBySem) => void;
  onRemoveColumn: (category: keyof ColumnsBySem, colId: string) => void;
  onRenameColumn: (category: keyof ColumnsBySem, colId: string, currentLabel: string) => void;
  onOpenAddStudent: () => void;
  isAdmin?: boolean;
}

export const TableView: React.FC<TableViewProps> = ({
  students,
  columns,
  viewMode,
  semester,
  onUpdateScore,
  onUpdateStudentName,
  onDeleteStudent,
  onAddColumn,
  onRemoveColumn,
  onRenameColumn,
  onOpenAddStudent,
  isAdmin = false
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  const handleStartEdit = (student: Student) => {
    setEditingId(student.id);
    setEditNameValue(student.name);
  };

  const handleSaveEdit = (studentId: number) => {
    if (editNameValue.trim()) {
      onUpdateStudentName(studentId, editNameValue.trim());
    }
    setEditingId(null);
  };

  const isAbsensi = viewMode === 'absensi';

  return (
    <div className="px-2 sm:px-6 pb-20 sm:pb-10 flex-grow flex flex-col">
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden flex flex-col">
        <div
          className="overflow-x-auto relative w-full touch-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <table className="w-full text-sm text-left border-collapse whitespace-nowrap">
            {/* Table Header */}
            <thead className="text-xs uppercase bg-slate-50 border-b border-slate-200 select-none">
              {/* Row 1: Category Groups */}
              <tr>
                <th
                  rowSpan={2}
                  className="px-2 py-3 font-bold w-12 min-w-[48px] border-b border-r border-slate-200 bg-white sticky left-0 z-30 text-center shadow-[2px_0_5px_rgba(0,0,0,0.03)]"
                >
                  No
                </th>
                <th
                  rowSpan={2}
                  className="px-4 py-3 font-bold min-w-[220px] max-w-[280px] border-b border-r border-slate-200 bg-white sticky left-[48px] z-30 shadow-[2px_0_5px_rgba(0,0,0,0.03)]"
                >
                  Nama Lengkap Siswa
                </th>

                {isAbsensi ? (
                  <>
                    <th
                      colSpan={columns.absensi.length}
                      className="px-2 py-2 text-center border-b border-r border-cyan-100 bg-cyan-50/80 text-cyan-900"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-[11px] tracking-wider">
                          PERTEMUAN / TANGGAL ABSENSI
                        </span>
                        <button
                          onClick={() => onAddColumn('absensi')}
                          className="p-1 hover:bg-cyan-100 text-cyan-800 rounded transition-colors"
                          title="Tambah Tanggal Pertemuan"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>

                    <th
                      colSpan={8}
                      className="px-2 py-2 text-center border-b border-r border-slate-200 bg-slate-100 text-slate-700"
                    >
                      <div className="text-[11px] font-bold tracking-wider">REKAP KEHADIRAN</div>
                    </th>
                  </>
                ) : (
                  <>
                    {/* Nilai Categories */}
                    <th
                      colSpan={columns.tugas.length}
                      className="px-2 py-2 text-center border-b border-r border-indigo-100 bg-indigo-50/70 text-indigo-900"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="font-bold text-[11px] tracking-wider">UH (ULANGAN HARIAN)</span>
                        <button
                          onClick={() => onAddColumn('tugas')}
                          className="p-1 hover:bg-indigo-100 text-indigo-700 rounded transition-colors"
                          title="Tambah Kolom UH"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>

                    <th
                      colSpan={columns.vocab.length}
                      className="px-2 py-2 text-center border-b border-r border-emerald-100 bg-emerald-50/70 text-emerald-900"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="font-bold text-[11px] tracking-wider">PORTOFOLIO</span>
                        <button
                          onClick={() => onAddColumn('vocab')}
                          className="p-1 hover:bg-emerald-100 text-emerald-700 rounded transition-colors"
                          title="Tambah Kolom Portofolio"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>

                    <th
                      colSpan={columns.percakapan.length}
                      className="px-2 py-2 text-center border-b border-r border-amber-100 bg-amber-50/70 text-amber-900"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="font-bold text-[11px] tracking-wider">PRAKTIK</span>
                        <button
                          onClick={() => onAddColumn('percakapan')}
                          className="p-1 hover:bg-amber-100 text-amber-700 rounded transition-colors"
                          title="Tambah Kolom Praktik"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>

                    <th
                      colSpan={columns.uh.length}
                      className="px-2 py-2 text-center border-b border-r border-rose-100 bg-rose-50/70 text-rose-900"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="font-bold text-[11px] tracking-wider">PROYEK</span>
                        <button
                          onClick={() => onAddColumn('uh')}
                          className="p-1 hover:bg-rose-100 text-rose-700 rounded transition-colors"
                          title="Tambah Kolom Proyek"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </th>

                    <th
                      rowSpan={2}
                      className="px-2 py-3 font-semibold text-center w-16 border-b border-r border-purple-200 bg-purple-50 text-purple-900"
                    >
                      <div className="text-[11px] font-bold tracking-wider">UTS</div>
                    </th>
                    <th
                      rowSpan={2}
                      className="px-2 py-3 font-semibold text-center w-16 border-b border-r border-slate-200 bg-slate-100 text-slate-700"
                    >
                      <div className="text-[11px] font-bold tracking-wider">UAS</div>
                    </th>
                    <th
                      rowSpan={2}
                      className="px-3 py-3 font-semibold text-center w-24 border-b border-r border-slate-700 bg-slate-800 text-white"
                    >
                      <div className="text-[11px] font-bold tracking-wider">
                        NILAI
                        <br />
                        AKHIR
                      </div>
                    </th>
                  </>
                )}

                {/* Right Action column */}
                {isAdmin && (
                  <th
                    rowSpan={2}
                    className="px-2 py-3 font-semibold text-center w-14 border-b border-slate-200 sticky right-0 z-30 bg-white shadow-[-2px_0_5px_rgba(0,0,0,0.03)]"
                  >
                    <Settings className="w-4 h-4 mx-auto text-slate-400" />
                  </th>
                )}
              </tr>

              {/* Row 2: Sub-headers for columns */}
              <tr>
                {isAbsensi ? (
                  <>
                    {columns.absensi.map((col) => (
                      <th
                        key={col.id}
                        className="px-1 py-1.5 font-medium text-center w-14 border-b border-r border-slate-200 bg-white min-w-[58px]"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onRenameColumn('absensi', col.id, col.label)}
                            className="text-xs text-slate-700 font-bold hover:text-indigo-600 border-b border-dashed border-slate-400 px-0.5"
                            title="Klik untuk Ubah Tanggal"
                          >
                            {col.label}
                          </button>
                          {columns.absensi.length > 1 && (
                            <button
                              onClick={() => onRemoveColumn('absensi', col.id)}
                              className="text-rose-400 hover:text-rose-600 p-0.5 rounded"
                              title="Hapus Kolom Ini"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}

                    {/* Rekap Header Tags */}
                    {['H', 'S', 'I', 'A', 'B', 'T', 'JML', '%'].map((item) => (
                      <th
                        key={item}
                        className="px-1 py-1.5 font-bold text-center w-9 border-b border-r border-slate-200 bg-white min-w-[34px] text-[11px] text-slate-600"
                      >
                        {item}
                      </th>
                    ))}
                  </>
                ) : (
                  <>
                    {/* Columns for UH */}
                    {columns.tugas.map((col) => (
                      <th
                        key={col.id}
                        className="px-1 py-1.5 font-medium text-center w-16 border-b border-r border-slate-200 bg-white min-w-[64px]"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onRenameColumn('tugas', col.id, col.label)}
                            className="text-xs text-slate-700 font-bold hover:text-indigo-600 border-b border-dashed border-slate-400 px-0.5"
                            title="Klik untuk Ubah Nama"
                          >
                            {col.label}
                          </button>
                          {columns.tugas.length > 1 && (
                            <button
                              onClick={() => onRemoveColumn('tugas', col.id)}
                              className="text-rose-400 hover:text-rose-600 p-0.5 rounded"
                              title="Hapus Kolom"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}

                    {/* Columns for Portofolio */}
                    {columns.vocab.map((col) => (
                      <th
                        key={col.id}
                        className="px-1 py-1.5 font-medium text-center w-16 border-b border-r border-slate-200 bg-white min-w-[64px]"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onRenameColumn('vocab', col.id, col.label)}
                            className="text-xs text-slate-700 font-bold hover:text-emerald-600 border-b border-dashed border-slate-400 px-0.5"
                            title="Klik untuk Ubah Nama"
                          >
                            {col.label}
                          </button>
                          {columns.vocab.length > 1 && (
                            <button
                              onClick={() => onRemoveColumn('vocab', col.id)}
                              className="text-rose-400 hover:text-rose-600 p-0.5 rounded"
                              title="Hapus Kolom"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}

                    {/* Columns for Praktik */}
                    {columns.percakapan.map((col) => (
                      <th
                        key={col.id}
                        className="px-1 py-1.5 font-medium text-center w-16 border-b border-r border-slate-200 bg-white min-w-[64px]"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onRenameColumn('percakapan', col.id, col.label)}
                            className="text-xs text-slate-700 font-bold hover:text-amber-600 border-b border-dashed border-slate-400 px-0.5"
                            title="Klik untuk Ubah Nama"
                          >
                            {col.label}
                          </button>
                          {columns.percakapan.length > 1 && (
                            <button
                              onClick={() => onRemoveColumn('percakapan', col.id)}
                              className="text-rose-400 hover:text-rose-600 p-0.5 rounded"
                              title="Hapus Kolom"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}

                    {/* Columns for Proyek */}
                    {columns.uh.map((col) => (
                      <th
                        key={col.id}
                        className="px-1 py-1.5 font-medium text-center w-16 border-b border-r border-slate-200 bg-white min-w-[64px]"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onRenameColumn('uh', col.id, col.label)}
                            className="text-xs text-slate-700 font-bold hover:text-rose-600 border-b border-dashed border-slate-400 px-0.5"
                            title="Klik untuk Ubah Nama"
                          >
                            {col.label}
                          </button>
                          {columns.uh.length > 1 && (
                            <button
                              onClick={() => onRemoveColumn('uh', col.id)}
                              className="text-rose-400 hover:text-rose-600 p-0.5 rounded"
                              title="Hapus Kolom"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </th>
                    ))}
                  </>
                )}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={50} className="px-6 py-16 text-center text-slate-500 bg-white">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="bg-slate-50 p-4 rounded-full mb-3 border border-slate-200 text-slate-400">
                        <Users className="w-8 h-8" />
                      </div>
                      <p className="text-slate-800 font-bold text-base mb-1">Belum Ada Data Siswa</p>
                      <p className="text-xs text-slate-500 mb-4 text-center">
                        {isAdmin
                          ? 'Tambahkan siswa baru secara manual atau import banyak siswa sekaligus dari file CSV.'
                          : 'Roster data siswa terpusat dikelola oleh Administrator Madrasah. Silakan hubungi Admin untuk menambahkan siswa di kelas ini.'}
                      </p>
                      {isAdmin ? (
                        <button
                          onClick={onOpenAddStudent}
                          className="inline-flex items-center gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          Tambah Siswa Baru
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-medium">
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Roster siswa hanya dapat diubah oleh Administrator</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student, index) => {
                  const scores = student.scores[semester] || {};

                  // Calculate stats for absensi
                  let countH = 0,
                    countS = 0,
                    countI = 0,
                    countA = 0,
                    countB = 0,
                    countT = 0,
                    totalFilled = 0;
                  columns.absensi.forEach((c) => {
                    const v = scores[c.id];
                    if (v) {
                      totalFilled++;
                      if (v === 'H') countH++;
                      else if (v === 'S') countS++;
                      else if (v === 'I') countI++;
                      else if (v === 'A') countA++;
                      else if (v === 'B') countB++;
                      else if (v === 'T') countT++;
                    }
                  });
                  const presentCount = countH + countT;
                  const percentH = totalFilled > 0 ? Math.round((presentCount / totalFilled) * 100) : 0;

                  // Calculate grade for nilai
                  const finalAvg = calculateAverage(scores, columns);
                  const gradeBadge = getGradeBadge(finalAvg);

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      {/* Sticky Column 1: Number */}
                      <td className="px-2 py-2.5 text-center text-xs font-semibold text-slate-500 border-r border-slate-100 bg-white group-hover:bg-slate-50/90 sticky left-0 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                        {index + 1}
                      </td>

                      {/* Sticky Column 2: Name with Inline Edit */}
                      <td className="px-4 py-2.5 border-r border-slate-100 bg-white group-hover:bg-slate-50/90 sticky left-[48px] z-20 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                        {isAdmin && editingId === student.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={editNameValue}
                              onChange={(e) => setEditNameValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(student.id);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              autoFocus
                              className="px-2 py-1 text-sm border border-indigo-500 rounded outline-none ring-2 ring-indigo-100 w-full"
                            />
                            <button
                              onClick={() => handleSaveEdit(student.id)}
                              className="p-1 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              if (isAdmin) handleStartEdit(student);
                            }}
                            className={`flex items-center justify-between py-0.5 ${
                              isAdmin ? 'cursor-pointer group/name' : 'cursor-default'
                            }`}
                            title={
                              isAdmin
                                ? 'Klik untuk mengubah nama siswa'
                                : 'Data nama siswa terpusat dan dikelola oleh Administrator'
                            }
                          >
                            <span className="font-semibold text-slate-800 text-sm truncate max-w-[200px]">
                              {student.name}
                            </span>
                            {isAdmin && (
                              <Pencil className="w-3.5 h-3.5 text-slate-300 group-hover/name:text-indigo-600 opacity-0 group-hover/name:opacity-100 transition-opacity ml-1.5 shrink-0" />
                            )}
                          </div>
                        )}
                      </td>

                      {/* Content Columns depending on View Mode */}
                      {isAbsensi ? (
                        <>
                          {/* Attendance input select per date */}
                          {columns.absensi.map((col) => {
                            const val = scores[col.id] || '';
                            let colorClass = 'text-slate-400 bg-slate-50 border-slate-200';
                            if (val === 'H') colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-300 font-bold';
                            else if (val === 'S') colorClass = 'text-blue-700 bg-blue-50 border-blue-300 font-bold';
                            else if (val === 'I') colorClass = 'text-amber-700 bg-amber-50 border-amber-300 font-bold';
                            else if (val === 'A') colorClass = 'text-rose-700 bg-rose-50 border-rose-300 font-bold';
                            else if (val === 'B') colorClass = 'text-purple-700 bg-purple-50 border-purple-300 font-bold';
                            else if (val === 'T') colorClass = 'text-orange-700 bg-orange-50 border-orange-300 font-bold';

                            return (
                              <td key={col.id} className="px-1 py-2 text-center border-r border-slate-100">
                                <select
                                  value={val}
                                  onChange={(e) => onUpdateScore(student.id, col.id, e.target.value)}
                                  className={`w-13 text-center py-1.5 px-1 rounded-md border text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer ${colorClass}`}
                                >
                                  <option value="">-</option>
                                  <option value="H">H (Hadir)</option>
                                  <option value="S">S (Sakit)</option>
                                  <option value="I">I (Izin)</option>
                                  <option value="A">A (Alpa)</option>
                                  <option value="B">B (Bolos)</option>
                                  <option value="T">T (Telat)</option>
                                </select>
                              </td>
                            );
                          })}

                          {/* Rekap Counts */}
                          <td className="px-1 py-2 text-center border-l border-slate-100 bg-emerald-50/40 text-xs font-semibold text-emerald-700">
                            {countH}
                          </td>
                          <td className="px-1 py-2 text-center border-slate-100 bg-blue-50/40 text-xs font-semibold text-blue-700">
                            {countS}
                          </td>
                          <td className="px-1 py-2 text-center border-slate-100 bg-amber-50/40 text-xs font-semibold text-amber-700">
                            {countI}
                          </td>
                          <td className="px-1 py-2 text-center border-slate-100 bg-rose-50/40 text-xs font-semibold text-rose-700">
                            {countA}
                          </td>
                          <td className="px-1 py-2 text-center border-slate-100 bg-purple-50/40 text-xs font-semibold text-purple-700">
                            {countB}
                          </td>
                          <td className="px-1 py-2 text-center border-r border-slate-100 bg-orange-50/40 text-xs font-semibold text-orange-700">
                            {countT}
                          </td>
                          <td className="px-1 py-2 text-center border-r border-slate-100 bg-indigo-50/50 text-xs font-bold text-indigo-700">
                            {presentCount}
                          </td>
                          <td className="px-2 py-2 text-center border-r border-slate-100 bg-slate-50 text-xs font-bold text-slate-700">
                            {percentH}%
                          </td>
                        </>
                      ) : (
                        <>
                          {/* UH Inputs */}
                          {columns.tugas.map((col) => {
                            const val = scores[col.id] !== undefined ? scores[col.id] : '';
                            return (
                              <td key={col.id} className="px-1 py-2 text-center border-r border-slate-100">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="-"
                                  value={val}
                                  onChange={(e) => onUpdateScore(student.id, col.id, e.target.value)}
                                  className="w-14 text-center py-1.5 rounded-md border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                              </td>
                            );
                          })}

                          {/* Portofolio Inputs */}
                          {columns.vocab.map((col) => {
                            const val = scores[col.id] !== undefined ? scores[col.id] : '';
                            return (
                              <td key={col.id} className="px-1 py-2 text-center border-r border-slate-100">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="-"
                                  value={val}
                                  onChange={(e) => onUpdateScore(student.id, col.id, e.target.value)}
                                  className="w-14 text-center py-1.5 rounded-md border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                              </td>
                            );
                          })}

                          {/* Praktik Inputs */}
                          {columns.percakapan.map((col) => {
                            const val = scores[col.id] !== undefined ? scores[col.id] : '';
                            return (
                              <td key={col.id} className="px-1 py-2 text-center border-r border-slate-100">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="-"
                                  value={val}
                                  onChange={(e) => onUpdateScore(student.id, col.id, e.target.value)}
                                  className="w-14 text-center py-1.5 rounded-md border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                />
                              </td>
                            );
                          })}

                          {/* Proyek Inputs */}
                          {columns.uh.map((col) => {
                            const val = scores[col.id] !== undefined ? scores[col.id] : '';
                            return (
                              <td key={col.id} className="px-1 py-2 text-center border-r border-slate-100">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="-"
                                  value={val}
                                  onChange={(e) => onUpdateScore(student.id, col.id, e.target.value)}
                                  className="w-14 text-center py-1.5 rounded-md border border-slate-200 bg-slate-50/60 hover:bg-white focus:bg-white text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                                />
                              </td>
                            );
                          })}

                          {/* UTS Input */}
                          <td className="px-1 py-2 text-center border-l border-r border-slate-200 bg-purple-50/30">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="-"
                              value={scores.uts !== undefined ? scores.uts : ''}
                              onChange={(e) => onUpdateScore(student.id, 'uts', e.target.value)}
                              className="w-14 text-center py-1.5 rounded-md border border-purple-200 bg-white text-purple-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-purple-400/30 focus:border-purple-500 transition-all shadow-xs"
                            />
                          </td>

                          {/* UAS Input */}
                          <td className="px-1 py-2 text-center border-r border-slate-200 bg-slate-50/50">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="-"
                              value={scores.uas !== undefined ? scores.uas : ''}
                              onChange={(e) => onUpdateScore(student.id, 'uas', e.target.value)}
                              className="w-14 text-center py-1.5 rounded-md border border-slate-200 bg-white text-slate-800 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-slate-400/30 focus:border-slate-500 transition-all shadow-xs"
                            />
                          </td>

                          {/* Nilai Akhir & Predikat Badge */}
                          <td className="px-3 py-2 text-center font-bold">
                            <div className="flex items-center justify-center gap-1.5">
                              <span
                                className={`inline-flex items-center justify-center w-11 h-8 rounded-lg text-xs ${gradeBadge.badgeClass}`}
                              >
                                {finalAvg}
                              </span>
                              <span className="text-[10px] font-bold text-slate-600 hidden lg:inline">
                                {gradeBadge.predicate.split(' ')[0]}
                              </span>
                            </div>
                          </td>
                        </>
                      )}

                      {/* Sticky Right Action: Delete */}
                      {isAdmin && (
                        <td className="px-2 py-2 text-center sticky right-0 z-20 bg-white group-hover:bg-slate-50/90 shadow-[-2px_0_5px_rgba(0,0,0,0.03)] border-l border-slate-100">
                          <button
                            onClick={() => onDeleteStudent(student)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}

              {/* Bottom Summary Row for Attendance */}
              {isAbsensi && students.length > 0 && (
                <tr className="bg-slate-100/90 text-[10px] font-bold text-slate-700 border-t-2 border-slate-300">
                  <td className="px-2 py-3 border-r border-slate-200 sticky left-0 z-20 bg-slate-100 text-center">
                    &bull;
                  </td>
                  <td className="px-4 py-3 border-r border-slate-200 sticky left-[48px] z-20 bg-slate-100 uppercase tracking-wider text-slate-800">
                    Rekap Harian Kelas:
                  </td>

                  {columns.absensi.map((col) => {
                    let h = 0,
                      s = 0,
                      i = 0,
                      a = 0;
                    students.forEach((student) => {
                      const val = (student.scores[semester] || {})[col.id];
                      if (val === 'H' || val === 'T') h++;
                      else if (val === 'S') s++;
                      else if (val === 'I') i++;
                      else if (val === 'A' || val === 'B') a++;
                    });

                    return (
                      <td
                        key={col.id}
                        className="px-1 py-1.5 text-center border-r border-slate-200 leading-tight bg-cyan-50/40"
                      >
                        <div className="flex flex-col items-center text-[9px] gap-0.5">
                          <span className="text-emerald-700 font-bold" title="Hadir + Telat">
                            H:{h}
                          </span>
                          <span className="text-blue-700 font-semibold" title="Sakit">
                            S:{s}
                          </span>
                          <span className="text-amber-700 font-semibold" title="Izin">
                            I:{i}
                          </span>
                          <span className="text-rose-700 font-semibold" title="Alpa / Bolos">
                            A:{a}
                          </span>
                        </div>
                      </td>
                    );
                  })}

                  <td colSpan={isAdmin ? 9 : 8} className="border-l border-slate-200 bg-slate-50 text-slate-500 px-3">
                    Total Siswa: {students.length}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
