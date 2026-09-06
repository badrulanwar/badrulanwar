export interface Teacher {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  degree: string;
  subject: string;
  nip: string;
  role: 'guru' | 'admin';
  avatarInitials: string;
}

export interface ColumnDef {
  id: string;
  label: string;
}

export interface ColumnsBySem {
  absensi: ColumnDef[];
  tugas: ColumnDef[];
  vocab: ColumnDef[];
  percakapan: ColumnDef[];
  uh: ColumnDef[];
}

export interface Student {
  id: number;
  name: string;
  class: string;
  gender?: 'L' | 'P';
  nisn?: string;
  scores: {
    '1': Record<string, any>;
    '2': Record<string, any>;
  };
  teacherScores?: Record<
    string,
    {
      '1': Record<string, any>;
      '2': Record<string, any>;
    }
  >;
}

export type ViewMode = 'nilai' | 'absensi';
export type Semester = '1' | '2';

export interface ClassGradeGroup {
  grade: string;
  list: string[];
}
