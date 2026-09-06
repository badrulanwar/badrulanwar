import { Teacher, Student, ClassGradeGroup, ColumnsBySem } from '../types';

export const CLASSES_DATA: ClassGradeGroup[] = [
  { grade: 'VII', list: ['VII A', 'VII B'] },
  { grade: 'VIII', list: ['VIII A', 'VIII B'] },
  { grade: 'IX', list: ['IX A', 'IX B'] }
];

export const ALL_CLASSES = CLASSES_DATA.flatMap(g => g.list);

export const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    username: 'badrul.anwar',
    password: 'guru123',
    fullName: 'Badrul Anwar Al Mubarak',
    degree: 'M.Pd.',
    subject: 'Bahasa Inggris',
    nip: '19880412 201503 1 002',
    role: 'guru',
    avatarInitials: 'B'
  },
  {
    id: 't-2',
    username: 'siti.rahmawati',
    password: 'guru123',
    fullName: 'Dra. Hj. Siti Rahmawati',
    degree: 'M.Pd.',
    subject: 'Bahasa Indonesia',
    nip: '19790615 200801 2 011',
    role: 'guru',
    avatarInitials: 'S'
  },
  {
    id: 't-3',
    username: 'ahmad.fauzi',
    password: 'guru123',
    fullName: 'Ahmad Fauzi',
    degree: 'S.Pd.I',
    subject: 'PAI & Budi Pekerti',
    nip: '19851120 201101 1 008',
    role: 'guru',
    avatarInitials: 'A'
  },
  {
    id: 't-4',
    username: 'nurul.hidayati',
    password: 'guru123',
    fullName: 'Nurul Hidayati',
    degree: 'S.Si.',
    subject: 'Matematika & IPA',
    nip: '19920310 201902 2 004',
    role: 'guru',
    avatarInitials: 'N'
  },
  {
    id: 't-5',
    username: 'admin.mts',
    password: 'admin123',
    fullName: 'Administrator Madrasah',
    degree: 'Admin Sistem',
    subject: 'Administrasi Kurikulum',
    nip: '-',
    role: 'admin',
    avatarInitials: 'A'
  }
];

export const INITIAL_COLUMNS: ColumnsBySem = {
  absensi: [
    { id: 'abs_1', label: '01/09' },
    { id: 'abs_2', label: '03/09' },
    { id: 'abs_3', label: '05/09' },
    { id: 'abs_4', label: '08/09' },
    { id: 'abs_5', label: '10/09' }
  ],
  tugas: [
    { id: 'tugas_1', label: 'UH 1' },
    { id: 'tugas_2', label: 'UH 2' }
  ],
  vocab: [
    { id: 'vocab_1', label: 'Porto 1' },
    { id: 'vocab_2', label: 'Porto 2' }
  ],
  percakapan: [
    { id: 'cakap_1', label: 'Prak 1' },
    { id: 'cakap_2', label: 'Prak 2' }
  ],
  uh: [
    { id: 'uh_1', label: 'Proy 1' }
  ]
};

export function getDefaultColumnsForTeacher(teacherId: string, subject?: string): ColumnsBySem {
  const sub = (subject || '').toLowerCase();

  if (teacherId === 't-2' || sub.includes('indonesia')) {
    return {
      absensi: [
        { id: 'abs_1', label: '02/09' },
        { id: 'abs_2', label: '04/09' },
        { id: 'abs_3', label: '09/09' },
        { id: 'abs_4', label: '11/09' },
        { id: 'abs_5', label: '16/09' }
      ],
      tugas: [
        { id: 'tugas_1', label: 'UH 1' },
        { id: 'tugas_2', label: 'UH 2' }
      ],
      vocab: [
        { id: 'vocab_1', label: 'Porto 1' },
        { id: 'vocab_2', label: 'Porto 2' }
      ],
      percakapan: [
        { id: 'cakap_1', label: 'Prak 1' },
        { id: 'cakap_2', label: 'Prak 2' }
      ],
      uh: [
        { id: 'uh_1', label: 'Proy 1' }
      ]
    };
  }

  if (teacherId === 't-3' || sub.includes('pai') || sub.includes('islam')) {
    return {
      absensi: [
        { id: 'abs_1', label: '01/09' },
        { id: 'abs_2', label: '04/09' },
        { id: 'abs_3', label: '08/09' },
        { id: 'abs_4', label: '11/09' },
        { id: 'abs_5', label: '15/09' }
      ],
      tugas: [
        { id: 'tugas_1', label: 'UH 1' },
        { id: 'tugas_2', label: 'UH 2' }
      ],
      vocab: [
        { id: 'vocab_1', label: 'Porto 1' },
        { id: 'vocab_2', label: 'Porto 2' }
      ],
      percakapan: [
        { id: 'cakap_1', label: 'Prak 1' },
        { id: 'cakap_2', label: 'Prak 2' }
      ],
      uh: [
        { id: 'uh_1', label: 'Proy 1' }
      ]
    };
  }

  if (teacherId === 't-4' || sub.includes('matematika') || sub.includes('ipa')) {
    return {
      absensi: [
        { id: 'abs_1', label: '02/09' },
        { id: 'abs_2', label: '03/09' },
        { id: 'abs_3', label: '09/09' },
        { id: 'abs_4', label: '10/09' },
        { id: 'abs_5', label: '16/09' }
      ],
      tugas: [
        { id: 'tugas_1', label: 'UH 1' },
        { id: 'tugas_2', label: 'UH 2' }
      ],
      vocab: [
        { id: 'vocab_1', label: 'Porto 1' },
        { id: 'vocab_2', label: 'Porto 2' }
      ],
      percakapan: [
        { id: 'cakap_1', label: 'Prak 1' },
        { id: 'cakap_2', label: 'Prak 2' }
      ],
      uh: [
        { id: 'uh_1', label: 'Proy 1' }
      ]
    };
  }

  return JSON.parse(JSON.stringify(INITIAL_COLUMNS));
}

export function getDefaultTeacherColumns(): Record<
  string,
  Record<string, { '1': ColumnsBySem; '2': ColumnsBySem }>
> {
  const res: Record<string, Record<string, { '1': ColumnsBySem; '2': ColumnsBySem }>> = {};
  DEFAULT_TEACHERS.forEach((teacher) => {
    res[teacher.id] = {};
    ALL_CLASSES.forEach((cls) => {
      const teacherCol = getDefaultColumnsForTeacher(teacher.id, teacher.subject);
      res[teacher.id][cls] = {
        '1': JSON.parse(JSON.stringify(teacherCol)),
        '2': JSON.parse(JSON.stringify(teacherCol))
      };
    });
  });
  return res;
}

export const INITIAL_STUDENTS: Student[] = [
  // Kelas VII A
  {
    id: 101,
    name: 'Ahmad Dahlan Al Bukaki',
    class: 'VII A',
    gender: 'L',
    nisn: '0098234101',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 88, tugas_2: 92, vocab_1: 85, vocab_2: 90, cakap_1: 90, cakap_2: 88, uh_1: 87, uts: 89, uas: 91 },
      '2': {}
    }
  },
  {
    id: 102,
    name: 'Baiq Nurul Aulia',
    class: 'VII A',
    gender: 'P',
    nisn: '0098234102',
    scores: {
      '1': { abs_1: 'H', abs_2: 'S', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 90, tugas_2: 95, vocab_1: 92, vocab_2: 94, cakap_1: 92, cakap_2: 94, uh_1: 90, uts: 93, uas: 95 },
      '2': {}
    }
  },
  {
    id: 103,
    name: 'Danu Pratama Sasak',
    class: 'VII A',
    gender: 'L',
    nisn: '0098234103',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'I', abs_4: 'H', abs_5: 'H', tugas_1: 78, tugas_2: 80, vocab_1: 75, vocab_2: 82, cakap_1: 80, cakap_2: 78, uh_1: 82, uts: 80, uas: 84 },
      '2': {}
    }
  },
  {
    id: 104,
    name: 'Fatimah Zahra Maulida',
    class: 'VII A',
    gender: 'P',
    nisn: '0098234104',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'H', abs_4: 'T', abs_5: 'H', tugas_1: 85, tugas_2: 88, vocab_1: 86, vocab_2: 89, cakap_1: 87, cakap_2: 85, uh_1: 88, uts: 86, uas: 88 },
      '2': {}
    }
  },
  {
    id: 105,
    name: 'Hasan Basri Saputra',
    class: 'VII A',
    gender: 'L',
    nisn: '0098234105',
    scores: {
      '1': { abs_1: 'H', abs_2: 'A', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 72, tugas_2: 75, vocab_1: 70, vocab_2: 74, cakap_1: 76, cakap_2: 72, uh_1: 75, uts: 74, uas: 76 },
      '2': {}
    }
  },
  {
    id: 106,
    name: 'Lalu Muhammad Hafiz',
    class: 'VII A',
    gender: 'L',
    nisn: '0098234106',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 94, tugas_2: 96, vocab_1: 92, vocab_2: 95, cakap_1: 95, cakap_2: 93, uh_1: 96, uts: 95, uas: 97 },
      '2': {}
    }
  },

  // Kelas VII B
  {
    id: 107,
    name: 'Baiq Salsabila Rahmah',
    class: 'VII B',
    gender: 'P',
    nisn: '0098234107',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 86, tugas_2: 88, vocab_1: 84, vocab_2: 87, cakap_1: 88, cakap_2: 85, uh_1: 86, uts: 87, uas: 89 },
      '2': {}
    }
  },
  {
    id: 108,
    name: 'Muhammad Rizky Ramadhan',
    class: 'VII B',
    gender: 'L',
    nisn: '0098234108',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'S', abs_4: 'H', abs_5: 'H', tugas_1: 82, tugas_2: 85, vocab_1: 80, vocab_2: 83, cakap_1: 84, cakap_2: 82, uh_1: 84, uts: 82, uas: 85 },
      '2': {}
    }
  },
  {
    id: 109,
    name: 'Siti Nurhaliza Asmaul',
    class: 'VII B',
    gender: 'P',
    nisn: '0098234109',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 90, tugas_2: 92, vocab_1: 88, vocab_2: 91, cakap_1: 92, cakap_2: 90, uh_1: 91, uts: 90, uas: 93 },
      '2': {}
    }
  },

  // Kelas VIII A
  {
    id: 201,
    name: 'Budi Santoso Wibowo',
    class: 'VIII A',
    gender: 'L',
    nisn: '0088234201',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 85, tugas_2: 87, vocab_1: 84, vocab_2: 86, cakap_1: 88, cakap_2: 86, uh_1: 85, uts: 86, uas: 88 },
      '2': {}
    }
  },
  {
    id: 202,
    name: 'Lalu Arya Gunawan',
    class: 'VIII A',
    gender: 'L',
    nisn: '0088234202',
    scores: {
      '1': { abs_1: 'H', abs_2: 'I', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 79, tugas_2: 82, vocab_1: 80, vocab_2: 81, cakap_1: 83, cakap_2: 80, uh_1: 82, uts: 81, uas: 83 },
      '2': {}
    }
  },
  {
    id: 203,
    name: 'Nurul Huda Lestari',
    class: 'VIII A',
    gender: 'P',
    nisn: '0088234203',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 92, tugas_2: 94, vocab_1: 90, vocab_2: 93, cakap_1: 94, cakap_2: 91, uh_1: 93, uts: 92, uas: 95 },
      '2': {}
    }
  },

  // Kelas VIII B
  {
    id: 204,
    name: 'Angga Wijaya Pratama',
    class: 'VIII B',
    gender: 'L',
    nisn: '0088234204',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 80, tugas_2: 83, vocab_1: 82, vocab_2: 84, cakap_1: 81, cakap_2: 83, uh_1: 82, uts: 82, uas: 84 },
      '2': {}
    }
  },
  {
    id: 205,
    name: 'Baiq Intan Permatasari',
    class: 'VIII B',
    gender: 'P',
    nisn: '0088234205',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'S', abs_4: 'H', abs_5: 'H', tugas_1: 88, tugas_2: 90, vocab_1: 86, vocab_2: 89, cakap_1: 87, cakap_2: 89, uh_1: 88, uts: 89, uas: 91 },
      '2': {}
    }
  },

  // Kelas IX A
  {
    id: 301,
    name: 'Dimas Aditya Saputra',
    class: 'IX A',
    gender: 'L',
    nisn: '0078234301',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 91, tugas_2: 93, vocab_1: 90, vocab_2: 92, cakap_1: 93, cakap_2: 91, uh_1: 92, uts: 92, uas: 94 },
      '2': {}
    }
  },
  {
    id: 302,
    name: 'Fitri Handayani',
    class: 'IX A',
    gender: 'P',
    nisn: '0078234302',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 87, tugas_2: 89, vocab_1: 85, vocab_2: 88, cakap_1: 89, cakap_2: 86, uh_1: 88, uts: 88, uas: 90 },
      '2': {}
    }
  },

  // Kelas IX B
  {
    id: 303,
    name: 'Indra Gunawan Hakim',
    class: 'IX B',
    gender: 'L',
    nisn: '0078234303',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'H', abs_4: 'H', abs_5: 'H', tugas_1: 83, tugas_2: 86, vocab_1: 84, vocab_2: 85, cakap_1: 87, cakap_2: 84, uh_1: 85, uts: 85, uas: 87 },
      '2': {}
    }
  },
  {
    id: 304,
    name: 'Zahrotul Jannah',
    class: 'IX B',
    gender: 'P',
    nisn: '0078234304',
    scores: {
      '1': { abs_1: 'H', abs_2: 'H', abs_3: 'I', abs_4: 'H', abs_5: 'H', tugas_1: 89, tugas_2: 91, vocab_1: 88, vocab_2: 90, cakap_1: 90, cakap_2: 89, uh_1: 90, uts: 90, uas: 92 },
      '2': {}
    }
  }
];
