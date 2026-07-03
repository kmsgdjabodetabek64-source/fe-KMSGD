import axiosPublic from "@/lib/axiosPublic";

import type { PengurusInti, AnggotaDepartemen, Sambutan } from "../types/kepengurusanTypes";

interface PeriodeAktif {
  id: number;
  nama: string;
}

async function getPeriodeAktifPublic(): Promise<PeriodeAktif | null> {
  try {
    const res = await axiosPublic.get<{ data: PeriodeAktif }>("/kepengurusan/periode/aktif");
    return res.data.data;
  } catch {
    return null;
  }
}

export async function getPengurusInti(): Promise<PengurusInti[]> {
  const periode = await getPeriodeAktifPublic();
  if (!periode) return [];
  try {
    const res = await axiosPublic.get<{ data: PengurusInti[] }>("/kepengurusan/inti", {
      params: { periodeId: periode.id },
    });
    return res.data.data ?? [];
  } catch {
    return [];
  }
}

export async function getAnggotaDepartemen(departemenId?: number): Promise<AnggotaDepartemen[]> {
  try {
    const res = await axiosPublic.get<{ data: AnggotaDepartemen[] }>("/kepengurusan/anggota", {
      params: departemenId ? { departemenId } : undefined,
    });
    return res.data.data ?? [];
  } catch {
    return [];
  }
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
