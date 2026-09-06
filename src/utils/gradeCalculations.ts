import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ColumnsBySem, Student, Teacher } from '../types';

export function getStudentScoresForTeacher(
  student: Student,
  teacherId: string,
  defaultTeacherId = 't-1'
): { '1': Record<string, any>; '2': Record<string, any> } {
  if (student.teacherScores && student.teacherScores[teacherId]) {
    return student.teacherScores[teacherId];
  }
  if (teacherId === defaultTeacherId && student.scores) {
    return student.scores;
  }
  return { '1': {}, '2': {} };
}

export function generateInitialTeacherScoresForStudent(
  studentId: number,
  baseScores: { '1': Record<string, any>; '2': Record<string, any> }
): Record<string, { '1': Record<string, any>; '2': Record<string, any> }> {
  const clamp = (val: number) => Math.min(100, Math.max(65, Math.round(val)));

  // t-1 (Bahasa Inggris): uses original baseScores
  const t1 = baseScores;

  // t-2 (Bahasa Indonesia)
  const abs2_3 = studentId % 7 === 0 ? 'S' : studentId % 9 === 0 ? 'I' : 'H';
  const abs2_5 = studentId % 11 === 0 ? 'T' : 'H';
  const t2_sem1: Record<string, any> = {
    abs_1: 'H',
    abs_2: 'H',
    abs_3: abs2_3,
    abs_4: 'H',
    abs_5: abs2_5,
    tugas_1: clamp(86 + (studentId % 9) - ((studentId * 2) % 5)),
    tugas_2: clamp(88 + ((studentId * 3) % 8)),
    vocab_1: clamp(87 + (studentId % 7)),
    vocab_2: clamp(90 + ((studentId * 2) % 6)),
    cakap_1: clamp(88 + ((studentId * 4) % 7)),
    cakap_2: clamp(89 + (studentId % 6)),
    uh_1: clamp(86 + ((studentId * 3) % 9)),
    uts: clamp(88 + (studentId % 8)),
    uas: clamp(90 + ((studentId * 2) % 7))
  };

  // t-3 (PAI & Budi Pekerti)
  const abs3_2 = studentId % 8 === 0 ? 'I' : 'H';
  const abs3_4 = studentId % 12 === 0 ? 'S' : 'H';
  const t3_sem1: Record<string, any> = {
    abs_1: 'H',
    abs_2: abs3_2,
    abs_3: 'H',
    abs_4: abs3_4,
    abs_5: 'H',
    tugas_1: clamp(88 + ((studentId * 2) % 8)),
    tugas_2: clamp(92 + (studentId % 6)),
    vocab_1: clamp(90 + ((studentId * 3) % 7)),
    vocab_2: clamp(89 + ((studentId * 4) % 6)),
    cakap_1: clamp(92 + (studentId % 5)),
    cakap_2: clamp(90 + ((studentId * 2) % 6)),
    uh_1: clamp(89 + (studentId % 7)),
    uts: clamp(91 + ((studentId * 3) % 6)),
    uas: clamp(93 + (studentId % 5))
  };

  // t-4 (Matematika & IPA)
  const abs4_3 = studentId % 6 === 0 ? 'S' : 'H';
  const abs4_5 = studentId % 10 === 0 ? 'T' : 'H';
  const t4_sem1: Record<string, any> = {
    abs_1: 'H',
    abs_2: 'H',
    abs_3: abs4_3,
    abs_4: 'H',
    abs_5: abs4_5,
    tugas_1: clamp(80 + ((studentId * 3) % 15)),
    tugas_2: clamp(82 + ((studentId * 2) % 14)),
    vocab_1: clamp(84 + (studentId % 12)),
    vocab_2: clamp(85 + ((studentId * 4) % 11)),
    cakap_1: clamp(83 + ((studentId * 3) % 12)),
    cakap_2: clamp(86 + (studentId % 10)),
    uh_1: clamp(81 + ((studentId * 2) % 14)),
    uts: clamp(83 + (studentId % 13)),
    uas: clamp(85 + ((studentId * 3) % 12))
  };

  // t-5 (Administrator)
  const t5_sem1: Record<string, any> = {
    abs_1: 'H',
    abs_2: 'H',
    abs_3: 'H',
    abs_4: 'H',
    abs_5: 'H',
    tugas_1: 85,
    tugas_2: 88,
    vocab_1: 86,
    vocab_2: 89,
    cakap_1: 87,
    cakap_2: 88,
    uh_1: 86,
    uts: 87,
    uas: 89
  };

  return {
    't-1': t1,
    't-2': { '1': t2_sem1, '2': {} },
    't-3': { '1': t3_sem1, '2': {} },
    't-4': { '1': t4_sem1, '2': {} },
    't-5': { '1': t5_sem1, '2': {} }
  };
}

export function calculateAverage(scores: Record<string, any>, columns: ColumnsBySem): number {
  const categories: (keyof Pick<ColumnsBySem, 'tugas' | 'vocab' | 'percakapan' | 'uh'>)[] = [
    'tugas',
    'vocab',
    'percakapan',
    'uh'
  ];

  const categorySums: number[] = [];

  categories.forEach((cat) => {
    const colList = columns[cat] || [];
    if (colList.length === 0) {
      categorySums.push(0);
      return;
    }
    const sum = colList.reduce((acc, col) => {
      const val = parseFloat(scores[col.id]);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    categorySums.push(sum / colList.length);
  });

  // Standalone UTS
  let utsScore = 0;
  if (typeof scores.uts === 'object' && scores.uts !== null) {
    const keys = Object.keys(scores.uts);
    if (keys.length > 0) utsScore = parseFloat(scores.uts[keys[0]]) || 0;
  } else {
    utsScore = parseFloat(scores.uts) || 0;
  }
  categorySums.push(utsScore);

  // Standalone UAS
  const uasScore = parseFloat(scores.uas) || 0;
  categorySums.push(uasScore);

  const totalSum = categorySums.reduce((a, b) => a + b, 0);
  return Math.round(totalSum / 6);
}

export function getGradeBadge(avg: number): {
  badgeClass: string;
  predicate: string;
  colorHex: string;
} {
  if (avg >= 90) {
    return {
      badgeClass: 'bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold',
      predicate: 'A (Sangat Baik)',
      colorHex: '#059669'
    };
  }
  if (avg >= 80) {
    return {
      badgeClass: 'bg-blue-100 text-blue-700 border border-blue-300 font-bold',
      predicate: 'B (Baik)',
      colorHex: '#2563eb'
    };
  }
  if (avg >= 70) {
    return {
      badgeClass: 'bg-amber-100 text-amber-700 border border-amber-300 font-bold',
      predicate: 'C (Cukup)',
      colorHex: '#d97706'
    };
  }
  if (avg >= 60) {
    return {
      badgeClass: 'bg-orange-100 text-orange-700 border border-orange-300 font-bold',
      predicate: 'D (Kurang)',
      colorHex: '#ea580c'
    };
  }
  return {
    badgeClass: 'bg-rose-100 text-rose-700 border border-rose-300 font-bold',
    predicate: 'E (Perlu Bimbingan)',
    colorHex: '#e11d48'
  };
}

export function generateExportPDF({
  students,
  className,
  semester,
  viewMode,
  columns,
  teacher
}: {
  students: Student[];
  className: string;
  semester: string;
  viewMode: 'nilai' | 'absensi';
  columns: ColumnsBySem;
  teacher: Teacher;
}) {
  const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
  const isAbsensi = viewMode === 'absensi';
  const titleText = isAbsensi ? 'DAFTAR REKAPITULASI KEHADIRAN SISWA' : 'DAFTAR NILAI & HASIL BELAJAR SISWA';

  // Kop Surat & Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('MADRASAH TSANAWIYAH NW ASMAUL HUSNA AIK BUKAK', 14, 15);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('DINAS PENDIDIKAN & KEMENTERIAN AGAMA KABUPATEN LOMBOK TENGAH', 14, 21);
  doc.text(
    `Jl. Asmaul Husna, Aik Bukak, Kec. Batukliang Utara, Kabupaten Lombok Tengah, Nusa Tenggara Barat`,
    14,
    26
  );

  doc.setLineWidth(0.5);
  doc.line(14, 28, 283, 28);
  doc.setLineWidth(0.2);
  doc.line(14, 29, 283, 29);

  // Sub-header Info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(titleText, 14, 37);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Kelas: ${className}`, 14, 43);
  doc.text(`Semester: ${semester} (Ganjil/Genap)`, 70, 43);
  doc.text(`Mata Pelajaran: ${teacher.subject}`, 140, 43);
  doc.text(`Guru Pengampu: ${teacher.fullName}, ${teacher.degree}`, 210, 43);

  const head1: any[] = [
    { content: 'No', rowSpan: 2, styles: { halign: 'center', valign: 'middle', cellWidth: 10 } },
    { content: 'Nama Siswa', rowSpan: 2, styles: { halign: 'left', valign: 'middle', cellWidth: 46 } }
  ];
  const head2: any[] = [];

  const addCategoryHeader = (label: string, colData: { id: string; label: string }[]) => {
    if (colData && colData.length > 0) {
      head1.push({ content: label, colSpan: colData.length, styles: { halign: 'center' } });
      colData.forEach((c) => {
        head2.push({ content: c.label, styles: { halign: 'center' } });
      });
    }
  };

  if (isAbsensi) {
    addCategoryHeader('Pertemuan / Tanggal', columns.absensi);
    head1.push({
      content: 'Rekapitulasi Kehadiran',
      colSpan: 8,
      styles: { halign: 'center', fillColor: [241, 245, 249], textColor: [15, 23, 42] }
    });
    ['H', 'S', 'I', 'A', 'B', 'T', 'Total', '%'].forEach((h) => {
      head2.push({
        content: h,
        styles: { halign: 'center', fillColor: [241, 245, 249], textColor: [15, 23, 42] }
      });
    });
  } else {
    addCategoryHeader('Ulangan Harian', columns.tugas);
    addCategoryHeader('Portofolio', columns.vocab);
    addCategoryHeader('Praktik', columns.percakapan);
    addCategoryHeader('Proyek', columns.uh);
    head1.push({
      content: 'UTS',
      rowSpan: 2,
      styles: { halign: 'center', valign: 'middle', fillColor: [243, 232, 255], textColor: [88, 28, 135] }
    });
    head1.push({
      content: 'UAS',
      rowSpan: 2,
      styles: { halign: 'center', valign: 'middle', fillColor: [241, 245, 249], textColor: [15, 23, 42] }
    });
    head1.push({
      content: 'Nilai Akhir',
      rowSpan: 2,
      styles: { halign: 'center', valign: 'middle', fillColor: [30, 41, 59], textColor: 255 }
    });
    head1.push({
      content: 'Predikat',
      rowSpan: 2,
      styles: { halign: 'center', valign: 'middle', fillColor: [15, 23, 42], textColor: 255 }
    });
  }

  const bodyData = students.map((s, idx) => {
    const row: any[] = [{ content: idx + 1, styles: { halign: 'center' } }, s.name];
    const scores = s.scores[semester as '1' | '2'] || {};

    if (isAbsensi) {
      let countH = 0,
        countS = 0,
        countI = 0,
        countA = 0,
        countB = 0,
        countT = 0,
        totalFilled = 0;
      columns.absensi.forEach((c) => {
        const v = scores[c.id];
        row.push({ content: v || '-', styles: { halign: 'center' } });
        if (v) {
          totalFilled++;
          if (v === 'H') countH++;
          else if (v === 'S') countS++;
          else if (v === 'I') countI++;
          else if (v === 'A') countA++;
          else if (v === 'B') countB++;
          else if (v === 'T') countT++;
        }
      });
      const presentCount = countH + countT;
      const percentH = totalFilled > 0 ? Math.round((presentCount / totalFilled) * 100) : 0;

      row.push({ content: countH, styles: { halign: 'center', textColor: [5, 150, 105] } });
      row.push({ content: countS, styles: { halign: 'center', textColor: [37, 99, 235] } });
      row.push({ content: countI, styles: { halign: 'center', textColor: [217, 119, 6] } });
      row.push({ content: countA, styles: { halign: 'center', textColor: [225, 29, 72] } });
      row.push({ content: countB, styles: { halign: 'center', textColor: [147, 51, 234] } });
      row.push({ content: countT, styles: { halign: 'center', textColor: [234, 88, 12] } });
      row.push({ content: presentCount, styles: { halign: 'center', fontStyle: 'bold' } });
      row.push({ content: `${percentH}%`, styles: { halign: 'center', fontStyle: 'bold' } });
    } else {
      const appendScores = (colList: { id: string }[]) => {
        colList.forEach((c) => {
          row.push({ content: scores[c.id] || '-', styles: { halign: 'center' } });
        });
      };
      appendScores(columns.tugas);
      appendScores(columns.vocab);
      appendScores(columns.percakapan);
      appendScores(columns.uh);

      const utsVal = typeof scores.uts === 'object' ? '' : scores.uts || '-';
      row.push({ content: utsVal, styles: { halign: 'center', fontStyle: 'bold' } });
      row.push({ content: scores.uas || '-', styles: { halign: 'center', fontStyle: 'bold' } });

      const avg = calculateAverage(scores, columns);
      const grade = getGradeBadge(avg);
      row.push({ content: avg, styles: { halign: 'center', fontStyle: 'bold' } });
      row.push({ content: grade.predicate.split(' ')[0], styles: { halign: 'center', fontStyle: 'bold' } });
    }

    return row;
  });

  const baseFontSize = isAbsensi ? (columns.absensi.length > 15 ? 7 : 8) : 8;

  autoTable(doc, {
    startY: 48,
    head: [head1, head2],
    body: bodyData,
    theme: 'grid',
    styles: {
      fontSize: baseFontSize,
      cellPadding: 1.5,
      lineWidth: 0.1,
      lineColor: [203, 213, 225]
    },
    headStyles: {
      fillColor: [67, 56, 202],
      textColor: 255,
      halign: 'center',
      valign: 'middle'
    },
    didDrawPage: (data) => {
      // Signature and Date Section on the last page
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.text(
        `Dicetak otomatis dari Sistem Absensi Digital MTs NW Asmaul Husna Aik Bukak pada ${new Date().toLocaleDateString(
          'id-ID',
          { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        )}`,
        data.settings.margin.left,
        pageHeight - 8
      );
    }
  });

  // Tanda Tangan
  const finalY = (doc as any).lastAutoTable.finalY + 12;
  if (finalY < 170) {
    doc.setFontSize(9);
    doc.text('Mengetahui,', 25, finalY);
    doc.text('Kepala MTs NW Asmaul Husna Aik Bukak', 25, finalY + 5);
    doc.text('................................................................', 25, finalY + 28);
    doc.text('NIP. -', 25, finalY + 33);

    doc.text(`Aik Bukak, ${new Date().toLocaleDateString('id-ID')}`, 205, finalY);
    doc.text(`Guru Mata Pelajaran,`, 205, finalY + 5);
    doc.text(`${teacher.fullName}, ${teacher.degree}`, 205, finalY + 28);
    doc.text(`NIP. ${teacher.nip || '-'}`, 205, finalY + 33);
  }

  const safeClassName = className.replace(/\s+/g, '_');
  const fileName = isAbsensi
    ? `Absensi_${safeClassName}_Sem${semester}.pdf`
    : `Nilai_${safeClassName}_Sem${semester}.pdf`;

  doc.save(fileName);
}
