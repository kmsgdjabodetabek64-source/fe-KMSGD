import axiosPublic from "@/lib/axiosPublic";

import type { PengurusInti, AnggotaDepartemen, Sambutan } from "../types/kepengurusanTypes";

interface PeriodeAktif {
  id: number;
  nama: string;
}

let periodeAktifCache: PeriodeAktif | null | undefined; // undefined = belum pernah di-fetch
let periodeAktifPromise: Promise<PeriodeAktif | null> | null = null;

async function getPeriodeAktifPublic(): Promise<PeriodeAktif | null> {
  // Sudah ada di cache (termasuk hasil null dari fetch sebelumnya)
  if (periodeAktifCache !== undefined) {
    return periodeAktifCache;
  }

  // Sedang ada request berjalan → tumpangi promise yang sama, jangan fetch baru
  if (periodeAktifPromise) {
    return periodeAktifPromise;
  }

  periodeAktifPromise = axiosPublic
    .get<{ data: PeriodeAktif }>("/kepengurusan/periode/aktif")
    .then((res) => {
      periodeAktifCache = res.data.data;
      return periodeAktifCache;
    })
    .catch(() => {
      periodeAktifCache = null;
      return null;
    })
    .finally(() => {
      periodeAktifPromise = null;
    });

  return periodeAktifPromise;
}

// Panggil ini kalau ada aksi yang mengubah periode aktif (misal dari halaman admin)
// supaya cache tidak basi.
export function invalidatePeriodeAktifCache() {
  periodeAktifCache = undefined;
  periodeAktifPromise = null;
}

// --- Cache & dedupe untuk pengurus inti (bergantung pada periode aktif) ---
let pengurusIntiCache: PengurusInti[] | null = null;
let pengurusIntiPromise: Promise<PengurusInti[]> | null = null;

export async function getPengurusInti(): Promise<PengurusInti[]> {
  if (pengurusIntiCache) {
    return pengurusIntiCache;
  }

  if (pengurusIntiPromise) {
    return pengurusIntiPromise;
  }

  pengurusIntiPromise = (async () => {
    const periode = await getPeriodeAktifPublic();
    if (!periode) return [];

    try {
      const res = await axiosPublic.get<{ data: PengurusInti[] }>("/kepengurusan/inti", {
        params: { periodeId: periode.id },
      });
      const data = res.data.data ?? [];
      pengurusIntiCache = data;
      return data;
    } catch {
      return [];
    }
  })().finally(() => {
    pengurusIntiPromise = null;
  });

  return pengurusIntiPromise;
}

export function invalidatePengurusIntiCache() {
  pengurusIntiCache = null;
  pengurusIntiPromise = null;
}

// --- Anggota departemen: dedupe per parameter (departemenId) ---
const anggotaDepartemenPromiseMap = new Map<string, Promise<AnggotaDepartemen[]>>();

export async function getAnggotaDepartemen(departemenId?: number): Promise<AnggotaDepartemen[]> {
  const cacheKey = departemenId != null ? String(departemenId) : "all";

  const existing = anggotaDepartemenPromiseMap.get(cacheKey);
  if (existing) {
    return existing;
  }

  const promise = axiosPublic
    .get<{ data: AnggotaDepartemen[] }>("/kepengurusan/anggota", {
      params: departemenId ? { departemenId } : undefined,
    })
    .then((res) => res.data.data ?? [])
    .catch(() => [])
    .finally(() => {
      anggotaDepartemenPromiseMap.delete(cacheKey);
    });

  anggotaDepartemenPromiseMap.set(cacheKey, promise);
  return promise;
}

export async function getSambutan(): Promise<Sambutan[]> {
  const res = await axiosPublic.get<{ data: Sambutan[] }>("/sambutan");
  return res.data.data;
}

export async function getSemuaPeriode(): Promise<import("../types/kepengurusanTypes").PeriodeOrganisasi[]> {
  const res = await axiosPublic.get<{ data: import("../types/kepengurusanTypes").PeriodeOrganisasi[] }>("/kepengurusan/periode");
  return res.data.data;
}

export async function getDepartemenAktif(): Promise<import("../types/kepengurusanTypes").Departemen[]> {
  try {
    const res = await axiosPublic.get<{ data: import("../types/kepengurusanTypes").Departemen[] }>("/kepengurusan/departemen/aktif");
    return res.data.data ?? [];
  } catch {
    return [];
  }
}

export async function getBKAktif(): Promise<import("../types/kepengurusanTypes").BadanKhusus[]> {
  try {
    const res = await axiosPublic.get<{ data: import("../types/kepengurusanTypes").BadanKhusus[] }>("/kepengurusan/bk/aktif");
    return res.data.data ?? [];
  } catch {
    return [];
  }
}