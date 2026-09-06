import React, { useState } from 'react';
import { Teacher } from '../types';
import {
  LogIn,
  UserPlus,
  Key,
  GraduationCap,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Trash2,
  ShieldCheck,
  Lock,
  KeyRound,
  X
} from 'lucide-react';

interface TeacherAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  currentTeacher: Teacher;
  onSelectTeacher: (teacher: Teacher) => void;
  onAddTeacher: (teacher: Teacher) => void;
  onDeleteTeacher?: (teacherId: string) => void;
}

export const TeacherAuthModal: React.FC<TeacherAuthModalProps> = ({
  isOpen,
  onClose,
  teachers,
  currentTeacher,
  onSelectTeacher,
  onAddTeacher,
  onDeleteTeacher
}) => {
  const isAdmin = currentTeacher.role === 'admin';
  const [tab, setTab] = useState<'quick' | 'login' | 'register'>('quick');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  // Account switching password verification
  const [switchingTeacher, setSwitchingTeacher] = useState<Teacher | null>(null);
  const [switchPassword, setSwitchPassword] = useState('');
  const [switchError, setSwitchError] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regDegree, setRegDegree] = useState('S.Pd.');
  const [regSubject, setRegSubject] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regNip, setRegNip] = useState('');
  const [regRole, setRegRole] = useState<'guru' | 'admin'>('guru');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const found = teachers.find((t) => {
      if (t.username.toLowerCase() !== username.trim().toLowerCase()) return false;
      const expectedPassword = t.password || (t.role === 'admin' ? 'admin123' : 'guru123');
      return password === expectedPassword;
    });

    if (found) {
      onSelectTeacher(found);
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setErrorMessage('Username atau password salah. Silakan coba kembali atau gunakan Akun Guru Cepat.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setErrorMessage('Hanya Administrator yang memiliki hak akses untuk menambahkan akun guru.');
      return;
    }

    if (!regFullName.trim() || !regSubject.trim() || !regUsername.trim()) {
      setErrorMessage('Mohon lengkapi Nama, Mata Pelajaran, dan Username.');
      return;
    }

    if (teachers.some((t) => t.username.toLowerCase() === regUsername.trim().toLowerCase())) {
      setErrorMessage('Username sudah digunakan oleh guru lain. Silakan pilih username lain.');
      return;
    }

    const newTeacher: Teacher = {
      id: `t-${Date.now()}`,
      username: regUsername.trim().toLowerCase(),
      password: regPassword || 'guru123',
      fullName: regFullName.trim(),
      degree: regDegree.trim(),
      subject: regSubject.trim(),
      nip: regNip.trim() || '-',
      role: regRole,
      avatarInitials: regFullName.trim().charAt(0).toUpperCase()
    };

    onAddTeacher(newTeacher);
    setTab('quick');
  };

  const handleConfirmDelete = () => {
    if (deletingTeacher && onDeleteTeacher) {
      onDeleteTeacher(deletingTeacher.id);
      setDeletingTeacher(null);
    }
  };

  const handleConfirmSwitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!switchingTeacher) return;

    const expectedPassword =
      switchingTeacher.password ||
      (switchingTeacher.role === 'admin' ? 'admin123' : 'guru123');

    const validPassword = switchPassword === expectedPassword;

    if (validPassword) {
      onSelectTeacher(switchingTeacher);
      setSwitchingTeacher(null);
      setSwitchPassword('');
      setSwitchError('');
      onClose();
    } else {
      setSwitchError('Password salah untuk akun ini. Silakan periksa kembali.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-800 p-6 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/20 backdrop-blur-sm">
              <GraduationCap className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Portal Guru MTs NW</h2>
              <p className="text-xs text-indigo-200 mt-0.5">
                Kelola Absensi & Penilaian Siswa Real-Time
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm transition-colors"
          >
            Tutup
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 shrink-0">
          <button
            onClick={() => {
              setTab('quick');
              setErrorMessage('');
            }}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${
              tab === 'quick'
                ? 'bg-white text-indigo-700 border-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Pilih Cepat Akun Guru
          </button>
          <button
            onClick={() => {
              setTab('login');
              setErrorMessage('');
            }}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${
              tab === 'login'
                ? 'bg-white text-indigo-700 border-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Login Akun
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMessage('');
            }}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-all border-b-2 flex items-center gap-1.5 ${
              tab === 'register'
                ? 'bg-white text-indigo-700 border-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 border-transparent'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Tambah Guru Baru
            <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded ml-1 border border-amber-300">
              Admin
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {tab === 'quick' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-indigo-950">Pilih Guru untuk Masuk Langsung:</p>
                    <p className="text-slate-600 mt-0.5">
                      Klik salah satu guru untuk masuk ke portal pengampu mata pelajaran tersebut.
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <span className="shrink-0 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded border border-amber-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Mode Admin Aktif
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teachers.map((teacher) => {
                  const isCurrent = currentTeacher.id === teacher.id;
                  const isTeacherAdmin = teacher.role === 'admin';

                  return (
                    <div
                      key={teacher.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500'
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 hover:shadow-xs'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (isCurrent) {
                            onClose();
                            return;
                          }
                          setSwitchingTeacher(teacher);
                          setSwitchPassword('');
                          setSwitchError('');
                        }}
                        className="flex items-center gap-2.5 min-w-0 text-left flex-1"
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs ${
                            isTeacherAdmin
                              ? 'bg-amber-600'
                              : isCurrent
                              ? 'bg-indigo-600'
                              : 'bg-slate-700 group-hover:bg-indigo-600 transition-colors'
                          }`}
                        >
                          {teacher.avatarInitials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-bold text-slate-800 truncate">{teacher.fullName}</p>
                            {isTeacherAdmin && (
                              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                Admin
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{teacher.degree}</p>
                          <span className="inline-block mt-0.5 text-[9px] font-semibold text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded truncate max-w-[140px]">
                            {teacher.subject}
                          </span>
                        </div>
                      </button>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {isCurrent ? (
                          <div title="Akun aktif Anda">
                            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                          </div>
                        ) : isAdmin && onDeleteTeacher ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingTeacher(teacher);
                            }}
                            className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title={`Hapus akun ${teacher.fullName} (Khusus Admin)`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
                <span>Total {teachers.length} Guru terdaftar</span>
                <span className="text-indigo-600 font-medium">Auto-Sync Realtime</span>
              </div>
            </div>
          )}

          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Username Guru
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Contoh: badrul.anwar atau admin.mts"
                  required
                  className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password..."
                    required
                    className="w-full px-4 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  *Default password guru: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-700 font-bold">guru123</code> &bull; admin: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-amber-700 font-bold">admin123</code>
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-600/20 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk Sekarang
                </button>
              </div>
            </form>
          )}

          {tab === 'register' && (
            <>
              {!isAdmin ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    Fitur Khusus Administrator
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Penambahan dan penghapusan akun guru dibatasi secara resmi khusus untuk Administrator / Kepala Madrasah.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const adminAccount = teachers.find((t) => t.role === 'admin') || teachers.find((t) => t.username === 'admin.mts');
                        if (adminAccount) {
                          setSwitchingTeacher(adminAccount);
                          setSwitchPassword('');
                          setSwitchError('');
                        }
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm inline-flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Beralih ke Akun Admin (admin.mts)
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Anda terautentikasi sebagai Admin. Silakan daftarkan akun guru baru di bawah ini.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Nama Lengkap Guru *
                      </label>
                      <input
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Contoh: Muhammad Ruslan"
                        required
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Gelar
                      </label>
                      <input
                        type="text"
                        value={regDegree}
                        onChange={(e) => setRegDegree(e.target.value)}
                        placeholder="S.Pd. / M.Pd."
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Mata Pelajaran yang Diampu *
                      </label>
                      <input
                        type="text"
                        value={regSubject}
                        onChange={(e) => setRegSubject(e.target.value)}
                        placeholder="Contoh: Bahasa Inggris / IPS"
                        required
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        NIP / NUPTK (Opsional)
                      </label>
                      <input
                        type="text"
                        value={regNip}
                        onChange={(e) => setRegNip(e.target.value)}
                        placeholder="198... / -"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-200">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Username Login *
                      </label>
                      <input
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="Contoh: m.ruslan"
                        required
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Default: guru123"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Hak Akses (Role)
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as 'guru' | 'admin')}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                      >
                        <option value="guru">Guru</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setTab('quick')}
                      className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-emerald-600/20 flex items-center gap-2"
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
      </div>

      {/* Password Verification Modal when switching accounts */}
      {switchingTeacher && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Verifikasi Password Akun</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSwitchingTeacher(null);
                  setSwitchPassword('');
                  setSwitchError('');
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmSwitchSubmit} className="p-5 space-y-4">
              {/* Account target info */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs ${
                    switchingTeacher.role === 'admin' ? 'bg-amber-600' : 'bg-indigo-600'
                  }`}
                >
                  {switchingTeacher.avatarInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-slate-800 truncate">{switchingTeacher.fullName}</p>
                    {switchingTeacher.role === 'admin' && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{switchingTeacher.subject}</p>
                  <p className="text-[10px] text-indigo-600 font-mono mt-0.5">@{switchingTeacher.username}</p>
                </div>
              </div>

              {switchError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{switchError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    Password Akun
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {switchingTeacher.role === 'admin' ? 'Default: admin123' : 'Default: guru123'}
                  </span>
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={switchPassword}
                  onChange={(e) => {
                    setSwitchPassword(e.target.value);
                    setSwitchError('');
                  }}
                  placeholder="Masukkan password untuk beralih..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSwitchingTeacher(null);
                    setSwitchPassword('');
                    setSwitchError('');
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Masuk Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation in quick tab */}
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
              Apakah Anda yakin ingin menghapus akun guru <strong>{deletingTeacher.fullName}</strong> (@{deletingTeacher.username})?
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
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
