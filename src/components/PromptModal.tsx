import React, { useState, useEffect } from 'react';
import { Edit3, X, Save } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  initialValue: string;
  onSave: (val: string) => void;
  onCancel: () => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  title,
  description,
  initialValue,
  onSave,
  onCancel
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSave(value.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-indigo-600" />
            {title}
          </h3>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={14}
            autoFocus
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
