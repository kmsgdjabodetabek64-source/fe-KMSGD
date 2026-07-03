import axiosPublic from "@/lib/axiosPublic";
import type { Pengumuman } from "../types/pengumuman.types";

export const CONTENT_HEADER = {
  judul: "Pengumuman",
  deskripsi: "Informasi terbaru, edaran resmi, dan kabar penting seputar kegiatan dan keorganisasian KMSGD Jabodetabek.",
  bgImage: "Gambar",
};

const FALLBACK_IMAGE = "/bg.webp";

type ApiResponse<T> = {
  data: T;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

type KategoriPengumumanResponse = {
  nama?: string | null;
};

type PengumumanResponse = {
  id: number;
  tanggal: string;
  kategori?: KategoriPengumumanResponse | null;
  title?: string | null;
  desc?: string | null;
  author?: string | null;
  image?: string | null;
  isPenting?: boolean | null;
  persyaratan?: string[] | null;
  berkas?: string[] | null;
  timeline?: Array<{
    agenda?: string | null;
    tanggal?: string | null;
  }> | null;
  linkPendaftaran?: string | null;
  contactPerson?: string | null;
};

const monthFormatter = new Intl.DateTimeFormat("id-ID", { month: "long" });
const fullDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const toDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeCategory = (value?: string | null) => {
  const category = value?.trim();
  if (!category) return "Pengumuman";
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
};

const isSafeImageUrl = (value?: string | null) => {
  if (!value) return false;
  return value.startsWith("/") || value.startsWith("https://");
};

const isSafeExternalUrl = (value?: string | null) => {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

const mapPengumuman = (item: PengumumanResponse): Pengumuman => {
  const date = toDate(item.tanggal);

  return {
    id: item.id,
    day: date?.getDate() ?? 0,
    month: date ? monthFormatter.format(date) : "-",
    year: date?.getFullYear() ?? new Date().getFullYear(),
    fullDate: date ? `${fullDateFormatter.format(date)}, ${timeFormatter.format(date).replace(":", ".")}` : "-",
    category: normalizeCategory(item.kategori?.nama),
    title: item.title?.trim() || "Pengumuman KMSGD",
    desc: item.desc?.trim() || "",
    author: item.author?.trim() || "Admin KMSGD",
    image: isSafeImageUrl(item.image) ? item.image! : FALLBACK_IMAGE,
    isPenting: Boolean(item.isPenting),
    persyaratan: Array.isArray(item.persyaratan) ? item.persyaratan.filter(Boolean) : [],
    berkas: Array.isArray(item.berkas) ? item.berkas.filter(Boolean) : [],
    timeline: Array.isArray(item.timeline)
      ? item.timeline
          .map((timeline) => ({
            agenda: timeline.agenda?.trim() || "",
            tanggal: timeline.tanggal?.trim() || "",
          }))
          .filter((timeline) => timeline.agenda && timeline.tanggal)
      : [],
    linkPendaftaran: isSafeExternalUrl(item.linkPendaftaran) ? item.linkPendaftaran! : undefined,
    contactPerson: item.contactPerson?.trim() || undefined,
  };
};

const getSortTime = (value?: string | null) => toDate(value)?.getTime() ?? 0;

const sortPengumumanResponse = (items: PengumumanResponse[]) =>
  [...items].sort((a, b) => {
    const aIsPenting = Boolean(a.isPenting);
    const bIsPenting = Boolean(b.isPenting);

    if (aIsPenting !== bIsPenting) return aIsPenting ? -1 : 1;

    return getSortTime(b.tanggal) - getSortTime(a.tanggal) || b.id - a.id;
  });

export const getPengumuman = async (signal?: AbortSignal): Promise<Pengumuman[]> => {
  const response = await axiosPublic.get<ApiResponse<PaginatedResponse<PengumumanResponse>>>("/pengumuman", {
    signal,
  });

  return sortPengumumanResponse(response.data.data.data).map(mapPengumuman);
};

export const getPengumumanFilters = (items: Pengumuman[]): string[] => {
  const categories = Array.from(new Set(items.map((item) => item.category)));
  return ["Semua", ...categories];
};

export const getLatestPengumuman = async (limit = 3, signal?: AbortSignal): Promise<Pengumuman[]> => {
  const data = await getPengumuman(signal);
  return data.slice(0, limit);
};

export const getPengumumanById = async (id: number, signal?: AbortSignal): Promise<Pengumuman> => {
  const response = await axiosPublic.get<ApiResponse<PengumumanResponse>>(`/pengumuman/${id}`, {
    signal,
  });

  return mapPengumuman(response.data.data);
};
