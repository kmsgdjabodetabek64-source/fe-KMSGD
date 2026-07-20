import type { PengurusInti } from "../types/kepengurusanTypes";

export interface DemisionerDepartemen {
  namaDepartemen: string;
  img?: string | null;
  anggota: { jabatan: string; nama: string; image?: string | null }[];
}

export interface DemisionerDataGroup {
  periode: string;
  pengurusInti: PengurusInti[];
  departemen: DemisionerDepartemen[];
}
