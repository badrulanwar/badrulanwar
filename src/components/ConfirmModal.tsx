import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Konfirmasi Hapus',
  message,
  confirmLabel = 'Hapus',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4 text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-slate-300 text-slate-600 text-xs sm:text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
