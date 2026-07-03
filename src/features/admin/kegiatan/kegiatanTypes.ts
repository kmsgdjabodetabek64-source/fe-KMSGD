export interface KategoriKegiatan {
  id: number;
  nama: string;
}

export interface Departemen {
  id: number;
  namaDepartemen: string;
}

export interface Kegiatan {
  id: number;
  periodeId: number;
  startTime: string;
  endTime?: string | null;
  kategoriId: number;
  kategori: KategoriKegiatan;
  title: string;
  desc: string;
  location: string;
  image?: string | null;
  price: number;
  registrationLink?: string | null;
  departemenId?: number | null;
  departemen?: Departemen | null;
  organizerCustom?: string | null;
  contactPerson?: string | null;
  isPublished: boolean;
  createdAt: string;
  speakers: string[];
}

export type CreateKegiatanPayload = {
  periodeId: number;
  startTime: string;
  endTime?: string;
  kategoriId: number;
  title: string;
  desc: string;
  location: string;
  price?: number;
  registrationLink?: string;
  departemenId?: number;
  organizerCustom?: string;
  contactPerson?: string;
  isPublished: boolean;
  speakers: string[];
  file?: File | null;
};

export type KategoriKegiatanPayload = {
  nama: string;
};
