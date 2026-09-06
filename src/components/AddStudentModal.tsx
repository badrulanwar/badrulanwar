import React, { useState } from 'react';
import { UserPlus, X, Users, Save } from 'lucide-react';
import { ALL_CLASSES } from '../data/initialData';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClass: string;
  onAddStudent: (studentData: { name: string; class: string; nisn?: string; gender?: 'L' | 'P' }) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  defaultClass,
  onAddStudent
}) => {
  const [name, setName] = useState('');
  const [targetClass, setTargetClass] = useState(defaultClass);
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [nisn, setNisn] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddStudent({
      name: name.trim(),
      class: targetClass,
      gender,
      nisn: nisn.trim() || undefined
    });

    setName('');
    setNisn('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            Tambah Siswa Baru
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-white p-1 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Nama Lengkap Siswa
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Muhammad Farhan Maulana"
              required
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all text-slate-800 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Pilih Kelas
              </label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
              >
                {ALL_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    Kelas {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Jenis Kelamin
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              NISN (Nomor Induk Siswa Nasional) - Opsional
            </label>
            <input
              type="text"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              placeholder="0098..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan Siswa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
