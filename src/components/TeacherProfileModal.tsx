import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';
import {
  UserCheck,
  Save,
  X,
  BookOpen,
  Award,
  Hash,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
  onUpdateTeacher: (updated: Teacher) => void;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onUpdateTeacher
}) => {
  const [fullName, setFullName] = useState(teacher.fullName);
  const [degree, setDegree] = useState(teacher.degree);
  const [subject, setSubject] = useState(teacher.subject);
  const [nip, setNip] = useState(teacher.nip);

  // Change password states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const isAdmin = teacher.role === 'admin';

  // Synchronize when modal opens or teacher changes
  useEffect(() => {
    if (isOpen) {
      setFullName(teacher.fullName);
      setDegree(teacher.degree);
      setSubject(teacher.subject);
      setNip(teacher.nip);
      setIsChangingPassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setPasswordError('');
      setSuccessNotice('');
    }
  }, [isOpen, teacher]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setSuccessNotice('');

    if (!fullName.trim() || !subject.trim()) return;

    let finalPassword = teacher.password;

    if (isChangingPassword) {
      if (!oldPassword) {
        setPasswordError('Password saat ini wajib diisi.');
        return;
      }

      const currentActualPassword =
        teacher.password || (isAdmin ? 'admin123' : 'guru123');

      if (oldPassword !== currentActualPassword) {
        setPasswordError('Password saat ini salah. Silakan periksa kembali.');
        return;
      }

      if (!newPassword.trim() || newPassword.trim().length < 4) {
        setPasswordError('Password baru minimal harus 4 karakter.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('Konfirmasi password baru tidak cocok.');
        return;
      }

      if (newPassword === currentActualPassword) {
        setPasswordError('Password baru tidak boleh sama dengan password saat ini.');
        return;
      }

      finalPassword = newPassword.trim();
    }

    onUpdateTeacher({
      ...teacher,
      fullName: fullName.trim(),
      degree: degree.trim(),
      subject: subject.trim(),
      nip: nip.trim(),
      password: finalPassword,
      avatarInitials: fullName.trim().charAt(0).toUpperCase()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div
          className={`p-5 text-white flex items-center justify-between shrink-0 ${
            isAdmin ? 'bg-slate-900' : 'bg-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg ${
                isAdmin
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-indigo-600/30 text-indigo-400'
              }`}
            >
              {isAdmin ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <UserCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">
                  {isAdmin ? 'Profil Akun Administrator' : 'Profil Guru Pengampu'}
                </h3>
                {isAdmin && (
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAdmin
                  ? 'Kelola data profil dan keamanan login administrator'
                  : 'Informasi pengampu rapor & cetak PDF'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Status Message */}
          {successNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Academic Degree & NIP */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                Gelar Akademik
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="M.Pd. / S.Pd."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                NIP / NUPTK
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="1988..."
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              Mata Pelajaran yang Diampu
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Bahasa Inggris / Matematika"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Username info */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center justify-between">
            <span>Username Login:</span>
            <span className="font-mono font-bold text-indigo-700">@{teacher.username}</span>
          </div>

          {/* OPSI GANTI PASSWORD */}
          <div className="pt-1">
            <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/70 transition-all">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(!isChangingPassword);
                  setPasswordError('');
                }}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-100/90 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>Opsi Ganti Password</span>
                      {isChangingPassword && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-900 font-extrabold">
                          Aktif
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {isChangingPassword
                        ? 'Isi formulir di bawah untuk mengubah kata sandi'
                        : 'Klik untuk membuka formulir ubah kata sandi'}
                    </p>
                  </div>
                </div>
                <div className="text-slate-400">
                  {isChangingPassword ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isChangingPassword && (
                <div className="p-4 pt-3 border-t border-slate-200 bg-white space-y-3 animate-in fade-in">
                  {passwordError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  {/* Password Saat Ini */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
                      <span>Password Saat Ini *</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        {isAdmin ? 'Default: admin123' : 'Default: guru123'}
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => {
                          setOldPassword(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="Masukkan password saat ini..."
                        className="w-full px-3.5 py-2 pr-10 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        tabIndex={-1}
                      >
                        {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Baru */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Password Baru *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="Minimal 4 karakter..."
                        className="w-full px-3.5 py-2 pr-10 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        tabIndex={-1}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Konfirmasi Password Baru */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Konfirmasi Password Baru *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setPasswordError('');
                        }}
                        placeholder="Ulangi password baru..."
                        className="w-full px-3.5 py-2 pr-10 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
