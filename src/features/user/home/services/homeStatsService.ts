import axiosPublic from "@/lib/axiosPublic";
import { getDepartemenAktif, getPengurusInti } from "../../tentang/Kepengurusan/services/kepengurusan";

const FALLBACK_ACTIVE_MEMBERS = 500;
const FALLBACK_PROGRAM_COUNT = 50;
export const FOUNDED_YEARS = 15;

const toSafeCount = (value: number, fallback: number) => (Number.isFinite(value) && value >= 0 ? value : fallback);

type PaginatedResponse<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

async function getPublishedKegiatanCount() {
  // limit=1 → payload minimal, kita cuma butuh meta.total, bukan isi datanya
  const response = await axiosPublic.get<{ data: PaginatedResponse<unknown> }>("/kegiatan?limit=1");
  return response.data.data.meta?.total ?? FALLBACK_PROGRAM_COUNT;
}

async function getActiveMemberCount() {
  const [pengurusInti, departemenAktif] = await Promise.all([getPengurusInti(), getDepartemenAktif()]);

  const anggotaDepartemenCount = departemenAktif.reduce((total, departemen) => total + (departemen.anggota?.length ?? 0), 0);

  return pengurusInti.length + anggotaDepartemenCount;
}

export async function getHomeStatsFromBackend() {
  const [activeMembersResult, programCountResult] = await Promise.allSettled([getActiveMemberCount(), getPublishedKegiatanCount()]);

  const activeMembers = activeMembersResult.status === "fulfilled" ? toSafeCount(activeMembersResult.value, FALLBACK_ACTIVE_MEMBERS) : FALLBACK_ACTIVE_MEMBERS;

  const programCount = programCountResult.status === "fulfilled" ? toSafeCount(programCountResult.value, FALLBACK_PROGRAM_COUNT) : FALLBACK_PROGRAM_COUNT;

  return [
    { value: `${activeMembers}+`, label: "Anggota Aktif" },
    { value: `${programCount}+`, label: "Program Kegiatan" },
    { value: `${FOUNDED_YEARS}+`, label: "Tahun berdiri" },
  ];
}
