import React, { useState } from 'react';
import { ViewMode, Semester, Teacher } from '../types';
import {
  Menu,
  Printer,
  FileUp,
  UserPlus,
  Search,
  MapPin,
  CheckCheck,
  BookOpen,
  Lock,
  CheckCircle2,
  LogOut,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  Sparkles,
  School
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  selectedClass: string;
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  semester: Semester;
  onSetSemester: (sem: Semester) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddStudent: () => void;
  onOpenImportCsv: () => void;
  onDownloadPdf: () => void;
  onMarkAllPresent?: () => void;
  teacher: Teacher;
  onLogoutToPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  selectedClass,
  viewMode,
  onSetViewMode,
  semester,
  onSetSemester,
  searchQuery,
  onSearchChange,
  onOpenAddStudent,
  onOpenImportCsv,
  onDownloadPdf,
  onMarkAllPresent,
  teacher,
  onLogoutToPortal
}) => {
  // Mobile Header states: collapsed by default on mobile for maximum gradebook view
  const [isMobileHeaderExpanded, setIsMobileHeaderExpanded] = useState(false);
  const [isMobileActionModalOpen, setIsMobileActionModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. COMPACT MOBILE BAR (Visible on mobile when full header is collapsed)    */}
      {/* ========================================================================= */}
      <div className="md:hidden sticky top-0 z-[40] bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-white shadow-md border-b border-indigo-700/80">
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          {/* Left: Sidebar toggle + Class & Subject badge */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onToggleSidebar}
              className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
              aria-label="Buka Menu Kelas & Pengaturan"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1.5 truncate">
              <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-xs font-extrabold px-2 py-0.5 rounded shrink-0">
                {selectedClass}
              </span>
              <span className="text-xs font-semibold text-indigo-100 truncate max-w-[100px] sm:max-w-[150px]">
                {teacher.subject}
              </span>
            </div>
          </div>

          {/* Center/Right: Quick Switchers & Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Quick Mode pill */}
            <button
              onClick={() => onSetViewMode(viewMode === 'nilai' ? 'absensi' : 'nilai')}
              title="Ganti Mode Nilai / Absensi"
              className={`px-2 py-1 rounded text-[11px] font-bold tracking-wider uppercase transition-all shadow-xs border ${
                viewMode === 'nilai'
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-cyan-600 text-white border-cyan-400'
              }`}
            >
              {viewMode === 'nilai' ? 'NILAI' : 'ABSEN'}
            </button>

            {/* Quick Semester pill */}
            <button
              onClick={() => onSetSemester(semester === '1' ? '2' : '1')}
              title="Ganti Semester 1 / Semester 2"
              className="px-2 py-1 rounded text-[11px] font-bold uppercase bg-blue-600 text-white border border-blue-400 shadow-xs"
            >
              SEM {semester}
            </button>

            {/* Quick Search toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isMobileSearchOpen || searchQuery
                  ? 'bg-white/20 border-white/40 text-white'
                  : 'bg-white/10 border-white/20 text-indigo-200 hover:text-white'
              }`}
              title="Cari Siswa"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Pop-up Menu Button */}
            <button
              onClick={() => setIsMobileActionModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-950/40 border border-emerald-300 active:scale-95 transition-all"
              title="Buka Menu Pop-up Alat & Opsi"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Menu</span>
            </button>

            {/* Toggle Full Header */}
            <button
              onClick={() => setIsMobileHeaderExpanded(!isMobileHeaderExpanded)}
              className="p-1 text-indigo-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              title={isMobileHeaderExpanded ? 'Sembunyikan Header' : 'Tampilkan Header Lengkap'}
            >
              {isMobileHeaderExpanded ? (
                <ChevronUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Inline Mobile Search Drawer (when search toggle is active) */}
        {isMobileSearchOpen && (
          <div className="px-3 pb-2.5 pt-1 bg-indigo-950/95 border-t border-indigo-800 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
              <input
                type="text"
                autoFocus
                placeholder="Ketik nama siswa..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-white/10 border border-white/25 text-white placeholder:text-indigo-300 text-xs rounded-lg pl-8 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="text-xs text-indigo-200 hover:text-white px-2 py-1 rounded bg-white/10 border border-white/20"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. FULL HEADER (Shown on Desktop OR when expanded by user on mobile)      */}
      {/* ========================================================================= */}
      <header
        className={`bg-gradient-to-r from-indigo-900 via-blue-800 to-indigo-900 z-[39] shadow-md shrink-0 border-b border-indigo-700 transition-all ${
          isMobileHeaderExpanded ? 'block' : 'hidden md:block'
        } ${isMobileHeaderExpanded ? 'relative' : 'md:sticky md:top-0'}`}
      >
        {/* Mobile Banner to collapse header back */}
        {isMobileHeaderExpanded && (
          <div className="md:hidden bg-indigo-950/90 px-4 py-1.5 border-b border-indigo-800 flex items-center justify-between text-xs text-indigo-200">
            <span className="text-[11px] font-medium text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Header Lengkap Terbuka
            </span>
            <button
              onClick={() => setIsMobileHeaderExpanded(false)}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] border border-white/20"
            >
              <ChevronUp className="w-3.5 h-3.5 text-emerald-300" />
              <span>Sembunyikan (Hemat Layar)</span>
            </button>
          </div>
        )}

        <div className="px-4 sm:px-6 py-4 flex flex-col gap-4">
          {/* Top bar: School branding & actions */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                onClick={onToggleSidebar}
                className="md:hidden mt-1 p-2 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Buka Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-indigo-300 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-indigo-300 shrink-0" />
                  Dinas Kabupaten Lombok Tengah &bull; Kemenag NTB
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
                  MTs NW Asmaul Husna Aik Bukak
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-indigo-200">
                  <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded border border-white/15">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                    Mapel: {teacher.subject}
                  </span>
                  <span>
                    Guru: {teacher.fullName}, {teacher.degree}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-200 px-2 py-0.5 rounded border border-emerald-400/30 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                    Nilai & Absen Khusus Mapel Ini
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons & Search */}
            <div className="flex flex-col items-end gap-2.5 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full justify-end flex-wrap sm:flex-nowrap">
                {/* Pop-up Action trigger */}
                <button
                  onClick={() => setIsMobileActionModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600/90 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg transition-all shadow-sm font-semibold text-xs border border-emerald-400"
                  title="Buka Menu & Alat Pop-up"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Menu Alat</span>
                </button>

                {viewMode === 'absensi' && onMarkAllPresent && (
                  <button
                    onClick={onMarkAllPresent}
                    title="Tandai semua siswa hadir untuk pertemuan terakhir"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-cyan-600/80 hover:bg-cyan-500 text-white px-3 py-2 rounded-lg transition-all shadow-sm font-semibold text-xs border border-cyan-400"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Set Hadir Semua</span>
                  </button>
                )}

                <button
                  onClick={onDownloadPdf}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white px-3.5 py-2 rounded-lg transition-all shadow-sm font-medium text-xs sm:text-sm backdrop-blur-sm"
                >
                  <Printer className="w-4 h-4 text-indigo-200" />
                  <span>Cetak PDF</span>
                </button>

                {onLogoutToPortal && (
                  <button
                    onClick={onLogoutToPortal}
                    title="Kembali ke Portal Masuk untuk berganti akun"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white/10 hover:bg-rose-600/80 border border-white/20 hover:border-rose-400 text-white px-3 py-2 rounded-lg transition-all shadow-sm font-medium text-xs sm:text-sm backdrop-blur-sm"
                  >
                    <LogOut className="w-4 h-4 text-rose-300" />
                    <span className="hidden sm:inline">Ganti Akun / Portal</span>
                    <span className="sm:hidden">Portal</span>
                  </button>
                )}

                {teacher.role === 'admin' ? (
                  <>
                    <button
                      onClick={onOpenImportCsv}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-lg transition-all shadow-md shadow-emerald-600/30 font-medium text-xs sm:text-sm border border-emerald-500"
                    >
                      <FileUp className="w-4 h-4" />
                      <span>Import CSV</span>
                    </button>

                    <button
                      onClick={onOpenAddStudent}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-white px-3.5 py-2 rounded-lg transition-all shadow-md shadow-blue-500/30 font-medium text-xs sm:text-sm border border-blue-400"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>+ Siswa</span>
                    </button>
                  </>
                ) : (
                  <div
                    title="Data siswa terpusat untuk semua guru dan hanya dapat ditambah/dihapus oleh Admin"
                    className="hidden sm:flex items-center gap-1.5 bg-white/10 text-indigo-200 border border-white/20 px-3 py-2 rounded-lg text-xs font-semibold backdrop-blur-sm shadow-xs select-none"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>Roster Siswa: Dikelola Admin</span>
                  </div>
                )}
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-300" />
                <input
                  type="text"
                  placeholder="Cari siswa..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-indigo-300 text-xs sm:text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all backdrop-blur-sm"
                />
              </div>
            </div>
          </div>

          {/* Sub-bar: Mode & Semester Selection */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/10 border border-white/20 backdrop-blur-sm rounded-lg p-2 gap-2 sm:gap-0">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-950/60 px-3 py-1.5 rounded-md border border-indigo-800 shadow-inner text-xs sm:text-sm font-semibold text-indigo-100 flex items-center gap-2">
                <span>{viewMode === 'nilai' ? 'Daftar Nilai Siswa' : 'Daftar Absensi Siswa'}</span>
                <span className="text-blue-300 font-bold">Kelas {selectedClass}</span>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
              {/* View Mode Switcher */}
              <div className="flex bg-indigo-950/60 p-1 rounded-md border border-indigo-800 w-full sm:w-auto shadow-inner">
                <button
                  onClick={() => onSetViewMode('nilai')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-xs font-bold tracking-wide uppercase transition-all shadow-xs ${
                    viewMode === 'nilai'
                      ? 'bg-emerald-500 text-white'
                      : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  NILAI
                </button>
                <button
                  onClick={() => onSetViewMode('absensi')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-xs font-bold tracking-wide uppercase transition-all shadow-xs ${
                    viewMode === 'absensi'
                      ? 'bg-emerald-500 text-white'
                      : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  ABSENSI
                </button>
              </div>

              {/* Semester Switcher */}
              <div className="flex bg-indigo-950/60 p-1 rounded-md border border-indigo-800 w-full sm:w-auto shadow-inner">
                <button
                  onClick={() => onSetSemester('1')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-xs font-bold tracking-wide uppercase transition-all shadow-xs ${
                    semester === '1'
                      ? 'bg-blue-500 text-white'
                      : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  SEM 1
                </button>
                <button
                  onClick={() => onSetSemester('2')}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-xs font-bold tracking-wide uppercase transition-all shadow-xs ${
                    semester === '2'
                      ? 'bg-blue-500 text-white'
                      : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  SEM 2
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. FLOATING QUICK-ACTION BUTTON ON MOBILE (Bottom Right Thumb Access)     */}
      {/* ========================================================================= */}
      <div className="md:hidden fixed bottom-5 right-4 z-40">
        <button
          onClick={() => setIsMobileActionModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/50 ring-2 ring-white/30 active:scale-95 transition-all"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Menu Alat</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 4. MOBILE POP-UP ACTION MODAL / SHEET                                      */}
      {/* ========================================================================= */}
      {isMobileActionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base leading-tight">Menu & Alat Cepat</h3>
                  <p className="text-[11px] text-slate-400">
                    Kelas {selectedClass} &bull; Mapel: {teacher.subject}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileActionModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Quick Search inside Modal */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Cari Siswa di Kelas {selectedClass}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Ketik nama siswa..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none pl-9 pr-9"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* View Mode & Semester Controls */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Mode Lembar Kerja
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => onSetViewMode('nilai')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        viewMode === 'nilai'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Nilai
                    </button>
                    <button
                      onClick={() => onSetViewMode('absensi')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        viewMode === 'absensi'
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Absensi
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Semester Aktif
                  </label>
                  <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => onSetSemester('1')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        semester === '1'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sem 1
                    </button>
                    <button
                      onClick={() => onSetSemester('2')}
                      className={`py-2 rounded-lg text-xs font-bold transition-all ${
                        semester === '2'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sem 2
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons List */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Tindakan & Cetak
                </label>

                {viewMode === 'absensi' && onMarkAllPresent && (
                  <button
                    onClick={() => {
                      onMarkAllPresent();
                      setIsMobileActionModalOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-900/60 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCheck className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold">Tandai Semua Siswa Hadir</span>
                    </div>
                    <span className="text-[11px] text-cyan-400">Pertemuan Ini</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onDownloadPdf();
                    setIsMobileActionModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 border border-slate-700 hover:bg-slate-750 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Printer className="w-4 h-4 text-indigo-300" />
                    <span className="text-xs font-bold text-white">Cetak Dokumen PDF</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Siap Cetak / Bagikan</span>
                </button>

                {teacher.role === 'admin' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onOpenImportCsv();
                        setIsMobileActionModalOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 text-xs font-bold transition-colors"
                    >
                      <FileUp className="w-4 h-4" />
                      <span>Import CSV</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenAddStudent();
                        setIsMobileActionModalOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-300 hover:bg-blue-900/50 text-xs font-bold transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>+ Tambah Siswa</span>
                    </button>
                  </div>
                )}

                {onLogoutToPortal && (
                  <button
                    onClick={() => {
                      onLogoutToPortal();
                      setIsMobileActionModalOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/40 text-xs font-bold transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Ganti Akun / Keluar ke Portal</span>
                  </button>
                )}
              </div>

              {/* Header Visibility Toggle in Mobile */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsMobileHeaderExpanded(!isMobileHeaderExpanded);
                    setIsMobileActionModalOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <span>
                    {isMobileHeaderExpanded
                      ? 'Sembunyikan Header (Mode Layar Penuh)'
                      : 'Tampilkan Header Lengkap di Halaman'}
                  </span>
                  {isMobileHeaderExpanded ? (
                    <ChevronUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-emerald-400" />
                  )}
                </button>
              </div>

              {/* Dismiss button */}
              <button
                type="button"
                onClick={() => setIsMobileActionModalOpen(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors text-center"
              >
                Tutup Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

