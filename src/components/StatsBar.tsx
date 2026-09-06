import React, { useState } from 'react';
import { ViewMode } from '../types';
import { Users, BarChart2, CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface StatsBarProps {
  totalStudents: number;
  selectedClass: string;
  classAverage: number;
  overallAttendanceRate: number;
  viewMode: ViewMode;
  lastSavedText: string;
  teacherSubject?: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  totalStudents,
  selectedClass,
  classAverage,
  overallAttendanceRate,
  viewMode,
  lastSavedText,
  teacherSubject
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  return (
    <div className="px-3 sm:px-6 py-2.5 sm:py-4 shrink-0">
      {/* Mobile Compact View (< sm) */}
      <div className="sm:hidden bg-white border border-slate-200 rounded-xl p-2.5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded shrink-0">
              {totalStudents} Siswa
            </span>
            <span className="text-xs font-semibold text-slate-700 truncate">
              {viewMode === 'nilai' ? `Rata-rata: ${classAverage}` : `Kehadiran: ${overallAttendanceRate}%`}
            </span>
          </div>

          <button
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/80 px-2 py-1 rounded-lg border border-indigo-100 transition-colors shrink-0"
          >
            <span>{isMobileExpanded ? 'Tutup' : 'Statistik'}</span>
            {isMobileExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Mobile Expanded Cards */}
        {isMobileExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 gap-2.5 animate-in fade-in duration-150">
            {/* Card 1 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-medium text-[10px] uppercase tracking-wider">
                  Total Siswa Kelas {selectedClass}
                </p>
                <p className="text-xl font-bold text-slate-800">{totalStudents} Siswa</p>
              </div>
              <div className="w-8 h-8 bg-blue-100/70 rounded-lg flex items-center justify-center text-blue-700">
                <Users className="w-4 h-4" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-medium text-[10px] uppercase tracking-wider truncate max-w-[200px]">
                  {viewMode === 'nilai' ? (teacherSubject ? `Rata-Rata: ${teacherSubject}` : 'Rata-Rata Nilai') : 'Tingkat Kehadiran'}
                </p>
                <p className="text-xl font-bold text-slate-800">
                  {viewMode === 'nilai' ? classAverage : `${overallAttendanceRate}%`}
                </p>
              </div>
              <div className="w-8 h-8 bg-emerald-100/70 rounded-lg flex items-center justify-center text-emerald-700">
                {viewMode === 'nilai' ? <BarChart2 className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-slate-500 font-medium text-[10px] uppercase tracking-wider">
                  Sinkronisasi Server
                </p>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  Multi-Perangkat Aktif
                </p>
                <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                  Otomatis: {lastSavedText}
                </p>
              </div>
              <div className="w-8 h-8 bg-emerald-100/70 rounded-lg flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop / Tablet Standard View (sm:grid) */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-4">
        {/* Card 1: Total Siswa */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-1">
              Total Siswa (Roster Admin)
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalStudents}</p>
              <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                Kelas {selectedClass}
              </span>
            </div>
          </div>
          <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 text-blue-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Rata-Rata / Kehadiran */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-1 truncate max-w-[200px]" title={teacherSubject ? `Mapel: ${teacherSubject}` : undefined}>
              {viewMode === 'nilai' ? (teacherSubject ? `Rata-Rata: ${teacherSubject}` : 'Rata-Rata Mapel') : 'Kehadiran Mapel'}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">
                {viewMode === 'nilai' ? classAverage : `${overallAttendanceRate}%`}
              </p>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                {viewMode === 'nilai' ? 'Akumulatif' : 'Tercatat'}
              </span>
            </div>
          </div>
          <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 text-emerald-600">
            {viewMode === 'nilai' ? (
              <BarChart2 className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>
        </div>

        {/* Card 3: Real-Time Sync Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 font-medium text-xs uppercase tracking-wider mb-1">
              Penyimpanan & Sinkronisasi
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-bold text-slate-800">Sinkron Semua Perangkat</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" />
              <span>Tersimpan otomatis: {lastSavedText}</span>
            </p>
          </div>
          <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 text-emerald-600">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

