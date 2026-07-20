export interface PengurusInti {
  id: number;
  periodeId: number;
  nama: string;
  jabatan: string;
  slogan?: string | null;
  image?: string | null;
}

export interface AnggotaDepartemen {
  id: number;
  departemenId: number;
  nama: string;
  jabatan: string;
  image?: string | null;
}

export interface Sambutan {
  id: number;
  nama: string;
  jabatan: string;
  isi: string;
  image?: string | null;
}

export interface Departemen {
  id: number;
  periodeId: number;
  namaDepartemen: string;
  deskripsi?: string | null;
  img?: string | null;
  anggota: AnggotaDepartemen[];
}

export interface PeriodeOrganisasi {
  id: number;
  periode: string;
  status: "AKTIF" | "DEMISIONER";
  pengurusInti: PengurusInti[];
  departemen: Departemen[];
}

export interface BadanKhusus {
  id: number;
  periodeId: number;
  namaBK: string;
  deskripsi?: string | null;
  img?: string | null;
  anggota: AnggotaBK[];
}

export interface AnggotaBK {
  id: number;
  bkId: number;
  nama: string;
  jabatan: string;
  image?: string | null;
}
