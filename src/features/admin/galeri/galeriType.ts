export type GaleriTipe = "FOTO" | "VIDEO";

export interface Kegiatan {
  id: number;
  title: string;
}

export interface Galeri {
  id: number;
  judul?: string | null;
  tipe: GaleriTipe;
  url: string;
  thumbnail?: string | null;
  kegiatanId?: number | null;
  kegiatan?: Kegiatan | null;
  isPublished: boolean;
  createdAt: string;
}

export type CreateGaleriPayload = {
  judul?: string;
  tipe: GaleriTipe;
  kegiatanId?: number;
  isPublished?: boolean;
  file?: File | null;
};