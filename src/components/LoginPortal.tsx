import React, { useState } from 'react';
import { Teacher } from '../types';
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Wifi,
  Users,
  CheckCircle2,
  School,
  AlertCircle
} from 'lucide-react';

interface LoginPortalProps {
  teachers: Teacher[];
  onLogin: (teacher: Teacher, rememberSession: boolean) => void;
  syncStatusText?: string;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({
  teachers,
  onLogin,
  syncStatusText = 'Server Cloud Terhubung • Sinkron di Semua Perangkat'
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Manual credentials form state
  const [manualUsername, setManualUsername] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [manualError, setManualError] = useState('');

  const adminTeacher = teachers.find((t) => t.role === 'admin');
  const regularTeachers = teachers.filter((t) => t.role !== 'admin');

  const handleSelectTeacherCard = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setPassword('');
    setErrorMessage('');
    setShowPassword(false);
  };

  const handleQuickLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    setErrorMessage('');
    const expectedPassword =
      selectedTeacher.password || (selectedTeacher.role === 'admin' ? 'admin123' : 'guru123');

    if (password === expectedPassword) {
      onLogin(selectedTeacher, rememberMe);
    } else {
      setErrorMessage('Password salah. Silakan coba kembali.');
    }
  };

  const handleManualLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');

    const trimmedUser = manualUsername.trim().toLowerCase();
    const found = teachers.find(
      (t) =>
        t.username.toLowerCase() === trimmedUser ||
        (t.nip && t.nip.replace(/[^0-9]/g, '') === trimmedUser.replace(/[^0-9]/g, ''))
    );

    if (!found) {
      setManualError('Akun dengan Username / NIP tersebut tidak ditemukan.');
      return;
    }

    const expectedPassword = found.password || (found.role === 'admin' ? 'admin123' : 'guru123');
    if (manualPassword === expectedPassword) {
      onLogin(found, rememberMe);
    } else {
      setManualError('Password yang Anda masukkan salah.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between antialiased selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner / Navigation */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30 ring-2 ring-emerald-400/30">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                MTs NW ASMAUL HUSNA
                <span className="text-[10px] uppercase font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  AIK BUKAK
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                Sistem Absensi & Penilaian Siswa Terpadu Multi-Perangkat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs text-emerald-300">
            <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-medium">{syncStatusText}</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-8 sm:py-12 flex flex-col justify-center">
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-medium text-emerald-400 mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            Portal Masuk Akademik Madrasah
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pilih Akun untuk Memulai Sesi
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Pilih akun pengampu Anda di bawah ini, atau gunakan login manual. Seluruh data nilai dan
            absensi Anda tersimpan otomatis serta tersinkron ke semua perangkat.
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700 inline-flex shadow-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('quick');
                setSelectedTeacher(null);
                setErrorMessage('');
              }}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'quick'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Pilih Akun Terdaftar
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('credentials');
                setSelectedTeacher(null);
                setManualError('');
              }}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'credentials'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4" />
              Login Username / NIP
            </button>
          </div>
        </div>

        {/* Tab 1: Quick Account Selection */}
        {activeTab === 'quick' && (
          <div>
            {/* Modal / Overlay for Password Verification when an account is selected */}
            {selectedTeacher && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                  <button
                    onClick={() => setSelectedTeacher(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                  >
                    &times;
                  </button>

                  <div className="flex items-center gap-3.5 pb-4 mb-4 border-b border-slate-800">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-md ${
                        selectedTeacher.role === 'admin'
                          ? 'bg-gradient-to-tr from-amber-600 to-amber-500 ring-2 ring-amber-400/40'
                          : 'bg-gradient-to-tr from-emerald-600 to-teal-500 ring-2 ring-emerald-400/40'
                      }`}
                    >
                      {selectedTeacher.role === 'admin' ? (
                        <ShieldCheck className="w-6 h-6" />
                      ) : (
                        selectedTeacher.avatarInitials || selectedTeacher.fullName.slice(0, 2)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">
                        {selectedTeacher.fullName}
                        {selectedTeacher.degree ? `, ${selectedTeacher.degree}` : ''}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            selectedTeacher.role === 'admin' ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                        />
                        {selectedTeacher.role === 'admin'
                          ? 'Administrator Madrasah'
                          : `Guru Pengampu: ${selectedTeacher.subject}`}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleQuickLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Masukkan Password Akun
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          autoFocus
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setErrorMessage('');
                          }}
                          placeholder={
                            selectedTeacher.role === 'admin' ? 'Password admin' : 'Password guru'
                          }
                          className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5">
                        {selectedTeacher.role === 'admin'
                          ? 'Password bawaan admin: admin123'
                          : 'Password bawaan guru: guru123'}
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="rememberMeQuick"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
                      />
                      <label htmlFor="rememberMeQuick" className="text-xs text-slate-400 cursor-pointer">
                        Ingat sesi login di perangkat ini
                      </label>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedTeacher(null)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
                      >
                        <span>Masuk ke Sistem</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Account Selection Cards Grid */}
            <div className="space-y-6">
              {/* Administrator Card Section */}
              {adminTeacher && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400/90 mb-3 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Akses Administrator (Pengelola Utama)
                  </h3>
                  <div
                    onClick={() => handleSelectTeacherCard(adminTeacher)}
                    className="group cursor-pointer bg-gradient-to-r from-amber-950/40 via-slate-800/80 to-slate-800/80 border border-amber-500/30 hover:border-amber-400/70 p-5 rounded-2xl transition-all hover:shadow-xl hover:shadow-amber-950/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-900/40 ring-2 ring-amber-400/30 group-hover:scale-105 transition-transform">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                            {adminTeacher.fullName}
                          </h4>
                          <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                            Super Admin
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          Pengelolaan master data siswa seluruh kelas, registrasi akun guru, dan konfigurasi madrasah.
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <span>Pilih Akun</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Subject Teachers Section */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400/90 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  Guru Pengampu Mata Pelajaran
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regularTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      onClick={() => handleSelectTeacherCard(teacher)}
                      className="group cursor-pointer bg-slate-800/70 border border-slate-700/80 hover:border-emerald-500/60 p-4 rounded-2xl transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-emerald-950/20 flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-base flex items-center justify-center shadow-md shadow-emerald-950/30 group-hover:scale-105 transition-transform shrink-0">
                          {teacher.avatarInitials || teacher.fullName.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                            {teacher.fullName}
                            {teacher.degree ? `, ${teacher.degree}` : ''}
                          </h4>
                          <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-md truncate max-w-full">
                            {teacher.subject}
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-400">
                        <span className="text-[11px] font-mono text-slate-500">
                          NIP: {teacher.nip ? teacher.nip : '—'}
                        </span>
                        <span className="text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          Masuk <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Manual Username / NIP Login */}
        {activeTab === 'credentials' && (
          <div className="max-w-md mx-auto w-full bg-slate-800/80 border border-slate-700 p-6 sm:p-8 rounded-2xl shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Masuk dengan Username atau NIP
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Gunakan kredensial resmi yang telah didaftarkan oleh Administrator Madrasah.
            </p>

            <form onSubmit={handleManualLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Username atau NIP
                </label>
                <input
                  type="text"
                  required
                  value={manualUsername}
                  onChange={(e) => setManualUsername(e.target.value)}
                  placeholder="Contoh: baiq.rohmiatun atau NIP"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={manualPassword}
                    onChange={(e) => setManualPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {manualError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{manualError}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rememberMeManual"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 bg-slate-950"
                />
                <label htmlFor="rememberMeManual" className="text-xs text-slate-400 cursor-pointer">
                  Ingat sesi login di perangkat ini
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <span>Masuk ke Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Feature Highlights Footer */}
        <div className="mt-12 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <h5 className="text-xs font-semibold text-white">Sinkronisasi Otomatis</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Nilai dan absen tersimpan langsung ke server & sinkron di semua gadget.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <BookOpen className="w-4 h-4 text-teal-400 mx-auto mb-1" />
            <h5 className="text-xs font-semibold text-white">Lembar Nilai Terpisah</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Setiap mata pelajaran memiliki lembar kerja dan penilaian khusus.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <h5 className="text-xs font-semibold text-white">Master Data Terpadu</h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Nama dan biodata siswa dikelola terpusat oleh Administrator Madrasah.
            </p>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-4 px-6 text-center text-xs text-slate-500">
        &copy; 2026 MTs NW Asmaul Husna Aik Bukak &bull; Sistem Absensi & Penilaian Siswa Terpadu
      </footer>
    </div>
  );
};
