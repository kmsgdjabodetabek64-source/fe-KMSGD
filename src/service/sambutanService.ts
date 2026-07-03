import axiosPublic from "../lib/axiosPublic";

export interface PengurusIntiData {
  id: number;
  periodeId: number;
  nama: string;
  jabatan: string;
  slogan: string | null;
  image: string | null;
}

export interface PeriodeData {
  id: number;
  periode: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface SambutanDisplayData {
  nama: string;
  jabatan: string;
  isi: string;
  image: string | null;
}

// In-memory cache untuk menghindari duplikat API call
const CACHE_TTL_MS = 5 * 60_000;
let sambutanCache: { expiresAt: number; data: SambutanDisplayData | null } | null = null;
let inFlight: Promise<SambutanDisplayData | null> | null = null;

export async function getSambutan(): Promise<SambutanDisplayData | null> {
  const now = Date.now();

  if (sambutanCache && sambutanCache.expiresAt > now) {
    return sambutanCache.data;
  }

  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      // 1. Dapatkan periode aktif
      const resPeriode = await axiosPublic.get<ApiResponse<PeriodeData>>("/kepengurusan/periode/aktif");
      const periodeAktif = resPeriode.data.data;
      if (!periodeAktif) return null;

      // 2. Dapatkan pengurus inti pada periode aktif tersebut
      const resPengurus = await axiosPublic.get<ApiResponse<PengurusIntiData[]>>(`/kepengurusan/inti`, {
        params: { periodeId: periodeAktif.id }
      });

      // 3. Cari yang jabatannya adalah Ketua Umum
      const ketuaUmum = resPengurus.data.data.find(
        (p) => p.jabatan.toLowerCase() === "ketua umum"
      );

      if (!ketuaUmum) return null;

      const result: SambutanDisplayData = {
        nama: ketuaUmum.nama,
        jabatan: ketuaUmum.jabatan,
        isi: ketuaUmum.slogan || "Tidak ada sambutan",
        image: ketuaUmum.image
      };

      sambutanCache = { data: result, expiresAt: now + CACHE_TTL_MS };
      return result;

    } catch (error) {
      console.error("Failed to fetch sambutan dari pengurus inti:", error);
      return null;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}
