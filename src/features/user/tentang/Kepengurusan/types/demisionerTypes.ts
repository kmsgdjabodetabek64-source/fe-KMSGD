import type { PengurusInti } from "../types/kepengurusanTypes";

export interface DemisionerDepartemen {
  namaDepartemen: string;
  anggota: { jabatan: string; nama: string; image?: string | null }[];
}

export interface DemisionerDataGroup {
  periode: string;
  pengurusInti: PengurusInti[];
  departemen: DemisionerDepartemen[];
}
