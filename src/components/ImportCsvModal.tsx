import React, { useState, useRef } from 'react';
import { FileUp, X, Download, Info, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { ALL_CLASSES } from '../data/initialData';

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportStudents: (imported: Array<{ name: string; class: string; gender?: 'L' | 'P'; nisn?: string }>) => void;
}

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({
  isOpen,
  onClose,
  onImportStudents
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const csvContent =
      'Nama,Kelas,Jenis Kelamin,NISN\n' +
      'Ahmad Dahlan Al Bukaki,VII A,L,0098234101\n' +
      'Baiq Nurul Aulia,VII A,P,0098234102\n' +
      'Budi Santoso Wibowo,VIII A,L,0088234201\n' +
      'Siti Nurhaliza Asmaul,VIII B,P,0088234202\n' +
      'Dimas Aditya Saputra,IX A,L,0078234301\n' +
      'Zahrotul Jannah,IX B,P,0078234302\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_siswa_mts_nw.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setStatusMessage('Mohon pilih file dengan format CSV (.csv)');
      return;
    }
    setSelectedFile(file);
    setStatusMessage(null);
  };

  const processImport = () => {
    if (!selectedFile) {
      setStatusMessage('Silakan pilih file CSV terlebih dahulu.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n/);
      const validStudents: Array<{ name: string; class: string; gender?: 'L' | 'P'; nisn?: string }> = [];
      let skippedCount = 0;

      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        const delimiter = trimmed.includes(';') ? ';' : ',';
        const parts = trimmed.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ''));

        if (parts.length >= 2) {
          const name = parts[0];
          let className = parts[1].toUpperCase();
          const genderRaw = parts[2] ? parts[2].toUpperCase() : undefined;
          const nisn = parts[3] || undefined;

          // Skip header row
          if (index === 0 && (name.toLowerCase().includes('nama') || className.toLowerCase().includes('kelas'))) {
            return;
          }

          // Normalize class names
          if (className === '7A' || className === '7 A') className = 'VII A';
          else if (className === '7B' || className === '7 B') className = 'VII B';
          else if (className === '8A' || className === '8 A') className = 'VIII A';
          else if (className === '8B' || className === '8 B') className = 'VIII B';
          else if (className === '9A' || className === '9 A') className = 'IX A';
          else if (className === '9B' || className === '9 B') className = 'IX B';

          if (name && ALL_CLASSES.includes(className)) {
            const gender: 'L' | 'P' | undefined = genderRaw === 'L' || genderRaw === 'P' ? genderRaw : undefined;
            validStudents.push({ name, class: className, gender, nisn });
          } else if (name) {
            skippedCount++;
          }
        }
      });

      if (validStudents.length > 0) {
        onImportStudents(validStudents);
        onClose();
      } else {
        setStatusMessage('Tidak ada data siswa yang valid ditemukan dalam file CSV.');
      }
    };

    reader.readAsText(selectedFile);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileUp className="w-5 h-5 text-emerald-600" />
            Import Data Siswa (CSV)
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-white p-1 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Info Card */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-900 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-indigo-900">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              Format File CSV yang Didukung:
            </div>
            <p className="text-slate-600">
              Kolom: <strong>Nama, Kelas, Jenis Kelamin (opsional), NISN (opsional)</strong>.
              <br />
              Kelas valid: <em>VII A, VII B, VIII A, VIII B, IX A, IX B</em>.
            </p>
          </div>

          <div className="flex justify-between items-center px-1">
            <span className="text-xs text-slate-500">Gunakan format standar madrasah:</span>
            <button
              type="button"
              onClick={downloadTemplate}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-md hover:bg-indigo-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Template CSV
            </button>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/50'
                : selectedFile
                ? 'border-emerald-500 bg-emerald-50/30'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, text/csv"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="flex flex-col items-center">
              <UploadCloud
                className={`w-10 h-10 mb-2 ${
                  selectedFile ? 'text-emerald-600' : 'text-slate-400'
                }`}
              />
              {selectedFile ? (
                <div>
                  <p className="text-sm font-bold text-slate-800">{selectedFile.name}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    {(selectedFile.size / 1024).toFixed(1)} KB &bull; Siap diproses
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Tarik file CSV ke sini, atau klik untuk memilih file
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Format didukung: .csv</p>
                </div>
              )}
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={processImport}
              disabled={!selectedFile}
              className={`px-5 py-2 text-white text-sm font-semibold rounded-lg shadow-sm flex items-center gap-2 transition-all ${
                selectedFile
                  ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Mulai Import Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
