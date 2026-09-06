import React, { useState } from 'react';
import { Teacher } from '../types';
import {
  ShieldCheck,
  UserPlus,
  Trash2,
  X,
  AlertTriangle,
  Lock,
  Sparkles,
  Key,
  BookOpen,
  CheckCircle2,
  Award,
  Hash,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminTeacherManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  currentTeacher: Teacher;
  onAddTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (teacherId: string) => void;
  onUpdateTeacher?: (teacher: Teacher) => void;
  onSwitchToAdmin: () => void;
}

export const AdminTeacherManagementModal: React.FC<AdminTeacherManagementModalProps> = ({
  isOpen,
  onClose,
  teachers,
  currentTeacher,
  onAddTeacher,
  onDeleteTeacher,
  onUpdateTeacher,
  onSwitchToAdmin
}) => {
  const isAdmin = currentTeacher.role === 'admin';
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');

  // Form states for adding teacher
  const [fullName, setFullName] = useState('');
  const [degree, setDegree] = useState('S.Pd.');
  const [subject, setSubject] = useState('');
  const [nip, setNip] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'guru' | 'admin'>('guru');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password prompt to switch to Admin
  const [showAdminPasswordPrompt, setShowAdminPasswordPrompt] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminAuthError, setAdminAuthError] = useState('');

  // Delete confirmation local state
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  // Edit password by Admin state
  const [editingPasswordTeacher, setEditingPasswordTeacher] = useState<Teacher | null>(null);
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [showNewTeacherPassword, setShowNewTeacherPassword] = useState(false);
  const [editPasswordError, setEditPasswordError] = useState('');

  if (!isOpen) return null;

  const handleSaveTeacherPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPasswordTeacher) return;

    if (!newTeacherPassword.trim() || newTeacherPassword.trim().length < 4) {
      setEditPasswordError('Password baru minimal harus 4 karakter.');
      return;
    }

    if (onUpdateTeacher) {
      onUpdateTeacher({
        ...editingPasswordTeacher,
        password: newTeacherPassword.trim()
      });
      setSuccessMessage(
        `Password untuk akun ${editingPasswordTeacher.fullName} (@${editingPasswordTeacher.username}) berhasil diperbarui!`
      );
      setEditingPasswordTeacher(null);
      setNewTeacherPassword('');
      setEditPasswordError('');
    }
  };

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const adminAccount =
      teachers.find((t) => t.role === 'admin') ||
      teachers.find((t) => t.username === 'admin.mts');

    const expectedAdminPassword = adminAccount?.password || 'admin123';
    const valid = adminPasswordInput === expectedAdminPassword;

    if (valid) {
      onSwitchToAdmin();
      setShowAdminPasswordPrompt(false);
      setAdminPasswordInput('');
      setAdminAuthError('');
      onClose();
    } else {
      setAdminAuthError('Password admin salah. Silakan coba kembali.');
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim() || !subject.trim() || !username.trim()) {
      setErrorMessage('Nama Lengkap, Mata Pelajaran, dan Username wajib diisi.');
      return;
    }

    const cleanUsername = username.trim().toLowerCase();

    if (teachers.some((t) => t.username.toLowerCase() === cleanUsername)) {
      setErrorMessage(`Username "${cleanUsername}" sudah digunakan oleh guru lain. Silakan pilih username lain.`);
      return;
    }

    const newTeacher: Teacher = {
      id: `t-${Date.now()}`,
      username: cleanUsername,
      password: password || 'guru123',
      fullName: fullName.trim(),
      degree: degree.trim(),
      subject: subject.trim(),
      nip: nip.trim() || '-',
      role: role,
      avatarInitials: fullName.trim().charAt(0).toUpperCase()
    };

    onAddTeacher(newTeacher);
    setSuccessMessage(`Akun guru "${newTeacher.fullName}" berhasil ditambahkan!`);
    // Reset form
    setFullName('');
    setDegree('S.Pd.');
    setSubject('');
    setNip('');
    setUsername('');
    setPassword('');
    setRole('guru');
    setActiveTab('list');
  };

  const confirmDelete = (teacher: Teacher) => {
    if (teacher.id === currentTeacher.id) {
      setErrorMessage('Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif login.');
      return;
    }
    setDeletingTeacher(teacher);
  };

  const executeDelete = () => {
    if (deletingTeacher) {
      onDeleteTeacher(deletingTeacher.id);
      setSuccessMessage(`Akun guru "${deletingTeacher.fullName}" berhasil dihapus.`);
      setDeletingTeacher(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Manajemen Akun Guru</h2>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Khusus Admin
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Kelola hak akses, penambahan, dan penghapusan akun guru MTs NW Asmaul Husna
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Access Verification Barrier if not Admin */}
        {!isAdmin ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Akses Dibatasi Khusus Administrator</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                Anda saat ini login sebagai <strong>{currentTeacher.fullName}</strong> (Guru).
                Hanya Administrator yang memiliki wewenang untuk menambah atau menghapus akun guru.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto text-left text-xs space-y-2">
              <p className="font-semibold text-slate-700">Akun Administrator Resmi:</p>
              <div className="font-mono bg-white p-2.5 rounded border border-slate-200 text-indigo-700 text-[11px] leading-relaxed">
                Username: <strong>admin.mts</strong><br />
                Password: <strong>admin123</strong><br />
                Peran: <strong>Administrator Madrasah</strong>
              </div>
            </div>

            {showAdminPasswordPrompt ? (
              <form
                onSubmit={handleAdminPasswordSubmit}
                className="max-w-sm mx-auto p-4 bg-amber-50/80 border border-amber-300 rounded-xl space-y-3 text-left animate-in fade-in"
              >
                <div className="flex items-center gap-1.5 text-amber-950 font-bold text-xs">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                  <span>Masukkan Password Akun Administrator:</span>
                </div>

                {adminAuthError && (
                  <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg">
                    {adminAuthError}
                  </p>
                )}

                <div>
                  <input
                    type="password"
                    autoFocus
                    required
                    value={adminPasswordInput}
                    onChange={(e) => {
                      setAdminPasswordInput(e.target.value);
                      setAdminAuthError('');
                    }}
                    placeholder="Masukkan admin123..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none bg-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Default password: admin123</p>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminPasswordPrompt(false);
                      setAdminPasswordInput('');
                      setAdminAuthError('');
                    }}
                    className="px-3.5 py-1.5 border border-slate-300 text-slate-600 text-xs rounded-lg hover:bg-white transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verifikasi & Masuk Admin
                  </button>
                </div>
              </form>
            ) : (
              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminPasswordPrompt(true);
                    setAdminPasswordInput('');
                    setAdminAuthError('');
                  }}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-md shadow-amber-600/20 flex items-center gap-2 transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Beralih ke Akun Admin Sekarang
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Tabs for Admin */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 shrink-0">
              <button
                onClick={() => {
                  setActiveTab('list');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'list'
                    ? 'bg-white text-indigo-700 border-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 border-transparent'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Daftar & Hapus Akun Guru ({teachers.length})
              </button>
              <button
                onClick={() => {
                  setActiveTab('add');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'add'
                    ? 'bg-white text-indigo-700 border-indigo-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 border-transparent'
                }`}
              >
                <UserPlus className="w-4 h-4 text-emerald-600" />
                + Tambah Akun Guru Baru
              </button>
            </div>

            {/* Notification Messages */}
            <div className="px-6 pt-4 shrink-0">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}
            </div>

            {/* Tab 1: List & Delete Teachers */}
            {activeTab === 'list' && (
              <div className="p-6 overflow-y-auto space-y-3 flex-1">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Klik tombol tempat sampah merah untuk menghapus akun guru.</span>
                  <span className="font-semibold text-indigo-600">Admin Aktif: {currentTeacher.fullName}</span>
                </div>

                <div className="space-y-2">
                  {teachers.map((teacher) => {
                    const isCurrent = teacher.id === currentTeacher.id;
                    const isTeacherAdmin = teacher.role === 'admin';

                    return (
                      <div
                        key={teacher.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-indigo-50/40 border-indigo-200 ring-1 ring-indigo-200'
                            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-xs ${
                              isTeacherAdmin ? 'bg-amber-600' : 'bg-slate-700'
                            }`}
                          >
                            {teacher.avatarInitials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-800 truncate">
                                {teacher.fullName}
                              </p>
                              <span className="text-xs text-slate-500 font-medium">
                                {teacher.degree}
                              </span>
                              {isTeacherAdmin ? (
                                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                  Admin
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                  Guru
                                </span>
                              )}
                              {isCurrent && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                                  Anda
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-1">
                              <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                <BookOpen className="w-3 h-3" />
                                {teacher.subject}
                              </span>
                              <span>
                                Username: <strong className="font-mono text-slate-700">@{teacher.username}</strong>
                              </span>
                              {teacher.nip && teacher.nip !== '-' && (
                                <span className="hidden sm:inline">NIP: {teacher.nip}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action: Change Password & Delete Teacher */}
                        <div className="shrink-0 ml-3 flex items-center gap-1">
                          {onUpdateTeacher && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPasswordTeacher(teacher);
                                setNewTeacherPassword('');
                                setEditPasswordError('');
                                setShowNewTeacherPassword(false);
                              }}
                              className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                              title={`Ganti / Reset Password Akun ${teacher.fullName}`}
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>
                          )}

                          {isCurrent ? (
                            <span
                              className="text-[11px] text-slate-400 font-medium px-2 py-1 bg-slate-100 rounded cursor-not-allowed"
                              title="Akun Anda sedang aktif digunakan"
                            >
                              Aktif
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => confirmDelete(teacher)}
                              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                              title={`Hapus akun ${teacher.fullName}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Add Teacher Form */}
            {activeTab === 'add' && (
              <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Formulir ini hanya dapat diakses oleh Administrator madrasah untuk mendaftarkan akun guru resmi.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Nama Lengkap Guru *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Muhammad Husnan"
                      required
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-indigo-500" />
                      Gelar
                    </label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="S.Pd. / M.Pd."
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      Mata Pelajaran yang Diampu *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Contoh: Fikih / Matematika / IPA"
                      required
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5 text-slate-400" />
                      NIP / NUPTK (Opsional)
                    </label>
                    <input
                      type="text"
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      placeholder="1985... / -"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Username Login *
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Contoh: m.husnan"
                      required
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-slate-400" />
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Default: guru123"
                      className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Tingkat Hak Akses (Role)
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'guru' | 'admin')}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      <option value="guru">Guru Mata Pelajaran</option>
                      <option value="admin">Administrator / Kepala Madrasah</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50"
                  >
                    Kembali ke Daftar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Simpan Akun Guru
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>

      {/* Nested Change Password by Admin Modal */}
      {editingPasswordTeacher && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Ubah Password Akun</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingPasswordTeacher(null);
                  setNewTeacherPassword('');
                  setEditPasswordError('');
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeacherPassword} className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                    editingPasswordTeacher.role === 'admin' ? 'bg-amber-600' : 'bg-slate-700'
                  }`}
                >
                  {editingPasswordTeacher.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {editingPasswordTeacher.fullName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    @{editingPasswordTeacher.username} &bull; {editingPasswordTeacher.subject}
                  </p>
                </div>
              </div>

              {editPasswordError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                  {editPasswordError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password Baru Akun *
                </label>
                <div className="relative">
                  <input
                    type={showNewTeacherPassword ? 'text' : 'password'}
                    autoFocus
                    required
                    value={newTeacherPassword}
                    onChange={(e) => {
                      setNewTeacherPassword(e.target.value);
                      setEditPasswordError('');
                    }}
                    placeholder="Masukkan password baru..."
                    className="w-full px-3.5 py-2 pr-10 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewTeacherPassword(!showNewTeacherPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    tabIndex={-1}
                  >
                    {showNewTeacherPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Sebagai Administrator, Anda dapat langsung menetapkan password baru untuk guru ini.
                </p>
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPasswordTeacher(null);
                    setNewTeacherPassword('');
                    setEditPasswordError('');
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Simpan Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nested Confirm Delete Modal */}
      {deletingTeacher && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 p-6">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4 text-rose-600 mx-auto sm:mx-0">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">
              Hapus Akun Guru?
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus akun guru <strong>{deletingTeacher.fullName}</strong> (@{deletingTeacher.username})? Guru ini tidak akan dapat login lagi ke sistem.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDeletingTeacher(null)}
                className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
