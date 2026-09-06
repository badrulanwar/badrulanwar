import React from 'react';
import { Teacher, Student } from '../types';
import { CLASSES_DATA } from '../data/initialData';
import {
  GraduationCap,
  BookOpen,
  Folder,
  FolderOpen,
  X,
  Users,
  UserCheck,
  RefreshCw,
  LogOut,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTeacher: Teacher;
  selectedClass: string;
  onSelectClass: (cls: string) => void;
  students: Student[];
  onOpenAuthModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAdminModal: () => void;
  isRealtimeSyncing: boolean;
  onLogoutToPortal?: () => void;
  isCloudConnected?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentTeacher,
  selectedClass,
  onSelectClass,
  students,
  onOpenAuthModal,
  onOpenProfileModal,
  onOpenAdminModal,
  isRealtimeSyncing,
  onLogoutToPortal,
  isCloudConnected = true
}) => {
  const isAdmin = currentTeacher.role === 'admin';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 fixed md:sticky md:top-0 h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)] shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo & School Area */}
        <div className="bg-gradient-to-r from-indigo-900 to-blue-800 p-5 border-b border-indigo-800 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2.5 rounded-xl shadow-inner backdrop-blur-sm border border-white/10">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-white leading-none tracking-tight">
                  Absensi Digital
                </h1>
                <p className="text-[10px] text-indigo-200 font-medium mt-1.5 uppercase tracking-widest">
                  Teacher Portal
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-indigo-300 hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Teacher Profile Card */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 shrink-0">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md ring-2 ring-white ${
                    isAdmin ? 'bg-amber-600' : 'bg-indigo-600'
                  }`}
                >
                  {currentTeacher.avatarInitials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-800 truncate" title={currentTeacher.fullName}>
                      {currentTeacher.fullName}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {isAdmin ? (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                        Admin
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-500 truncate">
                        {currentTeacher.degree}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">&bull;</span>
                    <span className="font-mono text-[10px] text-indigo-600 truncate">@{currentTeacher.username}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subject Badge */}
            <div className="bg-white rounded-lg p-2 border border-slate-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 truncate">
                  Guru {currentTeacher.subject}
                </span>
              </div>
              <button
                onClick={onOpenProfileModal}
                title="Edit Profil Guru"
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium px-1.5 py-0.5 rounded hover:bg-indigo-50"
              >
                Edit
              </button>
            </div>

            {/* Action Buttons: Ganti Guru & Admin Management */}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={onOpenAuthModal}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-lg text-xs font-semibold transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Ganti Guru / Login</span>
              </button>

              <button
                onClick={onOpenAdminModal}
                className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  isAdmin
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAdmin ? 'text-amber-600' : 'text-slate-500'}`} />
                <span>{isAdmin ? 'Kelola Akun Guru (Admin)' : 'Panel Admin (Kelola Guru)'}</span>
              </button>

              {onLogoutToPortal && (
                <button
                  onClick={onLogoutToPortal}
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-lg text-xs font-semibold transition-colors mt-0.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar ke Portal Akun</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Multi-Device Status Badge */}
        <div className="px-4 py-2 bg-emerald-50/70 border-b border-emerald-100/70 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Sinkron Multi-Perangkat</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Cloud Server ON</span>
        </div>

        {/* Navigation: Class list grouped by grade */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {CLASSES_DATA.map((group) => {
            let badgeGradient = 'from-emerald-500 to-teal-500 shadow-emerald-100';
            if (group.grade === 'VIII') badgeGradient = 'from-blue-500 to-indigo-500 shadow-blue-100';
            if (group.grade === 'IX') badgeGradient = 'from-violet-500 to-purple-500 shadow-violet-100';

            return (
              <div key={group.grade} className="mb-4">
                <div className="flex items-center gap-2 mb-2.5 px-1">
                  <span
                    className={`text-[10px] font-bold text-white uppercase tracking-widest px-2.5 py-1 rounded-md bg-gradient-to-r ${badgeGradient} shadow-xs`}
                  >
                    KELAS {group.grade}
                  </span>
                  <div className="h-px bg-slate-200 flex-1 rounded-full"></div>
                </div>

                <nav className="space-y-1">
                  {group.list.map((cls) => {
                    const count = students.filter((s) => s.class === cls).length;
                    const isActive = selectedClass === cls;

                    return (
                      <button
                        key={cls}
                        onClick={() => {
                          onSelectClass(cls);
                          if (window.innerWidth < 768) {
                            onClose();
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs font-semibold'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isActive ? (
                            <FolderOpen className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Folder className="w-4 h-4 text-slate-400" />
                          )}
                          <span>{cls}</span>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
          MTs NW Asmaul Husna &bull; TA 2026/2027
        </div>
      </aside>
    </>
  );
};
