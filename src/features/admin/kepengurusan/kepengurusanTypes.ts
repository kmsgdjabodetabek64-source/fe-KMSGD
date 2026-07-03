// --- PERIODE ORGANISASI ---
export type CreatePeriodeDto = Omit<PeriodeOrganisasi, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePeriodeDto = Partial<CreatePeriodeDto>;

export interface PeriodeOrganisasi {
  id: number;
  periode: string;
  status: "AKTIF" | "DEMISIONER";
  createdAt: string;
  updatedAt: string;
}

// --- DEPARTEMEN ---
export type CreateDepartemenDto = Omit<Departemen, 'id' | 'createdAt' | 'updatedAt' | 'anggota'>;
export type UpdateDepartemenDto = Partial<CreateDepartemenDto>;

export interface Departemen {
  id: number;
  periodeId: number;
  namaDepartemen: string;
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
  anggota?: AnggotaDepartemen[];
}

// --- PENGURUS INTI (BPI) ---
export type CreatePengurusIntiDto = Omit<PengurusInti, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePengurusIntiDto = Partial<CreatePengurusIntiDto>;

export interface PengurusInti {
  id: number;
  periodeId: number;
  nama: string;
  jabatan: string;
  slogan?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// --- ANGGOTA DEPARTEMEN ---
export type CreateAnggotaDto = Omit<AnggotaDepartemen, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAnggotaDto = Partial<CreateAnggotaDto>;

export interface AnggotaDepartemen {
  id: number;
  departemenId: number;
  nama: string;
  jabatan: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// --- BADAN KHUSUS (BK) ---
export type CreateBKDto = Omit<BadanKhusus, 'id' | 'createdAt' | 'updatedAt' | 'anggota'>;
export type UpdateBKDto = Partial<CreateBKDto>;

export interface BadanKhusus {
  id: number;
  periodeId: number;
  namaBK: string;
  deskripsi?: string;
  createdAt: string;
  updatedAt: string;
  anggota?: AnggotaBK[];
}

// --- ANGGOTA BK ---
export type CreateAnggotaBKDto = Omit<AnggotaBK, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAnggotaBKDto = Partial<CreateAnggotaBKDto>;

export interface AnggotaBK {
  id: number;
  bkId: number;
  nama: string;
  jabatan: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}
