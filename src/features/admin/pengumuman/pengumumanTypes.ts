export interface KategoriPengumuman {
  id: number;
  nama: string;
}

export interface PengumumanTimeline {
  id?: number;
  agenda: string;
  tanggal: string;
}

export interface Pengumuman {
  id: number;
  tanggal: string;
  kategoriId: number;
  kategori: KategoriPengumuman;
  title: string;
  desc: string;
  author: string;
  image?: string | null;
  isPenting: boolean;
  isPublished: boolean;
  createdAt: string;
  persyaratan: string[];
  berkas: string[];
  timeline: PengumumanTimeline[];
  linkPendaftaran?: string | null;
  contactPerson?: string | null;
}

export type CreatePengumumanPayload = {
  tanggal: string;
  kategoriId: number;
  title: string;
  desc: string;
  author: string;
  isPenting?: boolean;
  isPublished: boolean;
  persyaratan: string[];
  berkas: string[];
  timeline: PengumumanTimeline[];
  linkPendaftaran?: string;
  contactPerson?: string;
  file?: File | null;
};

export type UpdatePengumumanPayload = CreatePengumumanPayload & {
  removeImage?: boolean;
};

export type KategoriPengumumanPayload = {
  nama: string;
};
