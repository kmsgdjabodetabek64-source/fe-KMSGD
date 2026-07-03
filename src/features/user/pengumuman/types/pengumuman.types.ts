export type CategoryType = string;

export interface Pengumuman {
  id: number;
  day: number;
  month: string;
  year: number;
  fullDate: string;
  category: CategoryType;
  title: string;
  desc: string;
  author: string;
  image: string;
  isPenting: boolean;
  persyaratan: string[];
  berkas: string[];
  timeline: PengumumanTimeline[];
  linkPendaftaran?: string;
  contactPerson?: string;
}

export interface PengumumanTimeline {
  agenda: string;
  tanggal: string;
}
