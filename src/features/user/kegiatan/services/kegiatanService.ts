import axiosPublic from "../../../../lib/axiosPublic";
import type { Kegiatan } from "../types/kegiatan.types";

export const CONTENT_HEADER = {
  type: "kegiatan",
  judul: "Kegiatan",
  judul2: "Kami",
  deskripsi: "Jelajahi berbagai agenda, seminar, kompetisi, dan kegiatan sosial yang diselenggarakan oleh Keluarga Mahasiswa Sunan Gunung Djati Jabodetabek.",
  bgImage: "gambar",
};

const FALLBACK_IMAGE = "/bg.webp";

type ApiResponse<T> = {
  data: T;
};

type PaginatedResponse<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

type KategoriKegiatanResponse = {
  nama?: string | null;
};

type DepartemenResponse = {
  namaDepartemen?: string | null;
};

type KegiatanResponse = {
  id: number;
  startTime: string;
  endTime?: string | null;
  kategori?: KategoriKegiatanResponse | null;
  departemen?: DepartemenResponse | null;
  title?: string | null;
  desc?: string | null;
  location?: string | null;
  image?: string | null;
  price?: number | null;
  registrationLink?: string | null;
  organizerCustom?: string | null;
  contactPerson?: string | null;
  speakers?: string[] | null;
  isPenting?: boolean | null;
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
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

const formatDate = (value?: string | null) => {
  const date = toDate(value);
  return date ? dateFormatter.format(date) : "-";
};

const formatTime = (value?: string | null) => {
  const date = toDate(value);
  return date ? timeFormatter.format(date).replace(":", ".") : "-";
};

const normalizeCategory = (value?: string | null) => {
  const category = value?.trim();
  return category ? category.toUpperCase() : "LAINNYA";
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

const formatPrice = (price?: number | null) => {
  if (!price) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);
};

const mapKegiatan = (item: KegiatanResponse): Kegiatan => ({
  id: item.id,
  date: formatDate(item.startTime),
  startTime: formatTime(item.startTime),
  endTime: item.endTime ? formatTime(item.endTime) : "Selesai",
  category: normalizeCategory(item.kategori?.nama),
  title: item.title?.trim() || "Kegiatan KMSGD",
  desc: item.desc?.trim() || "",
  location: item.location?.trim() || "-",
  image: isSafeImageUrl(item.image) ? item.image! : FALLBACK_IMAGE,
  type: item.isPenting ? "dark" : "green",
  action: "DETAIL",
  actionStyle: item.isPenting ? "gold" : "outline",
  price: item.price ?? 0,
  priceLabel: formatPrice(item.price),
  registrationLink: isSafeExternalUrl(item.registrationLink) ? item.registrationLink! : undefined,
  organizer: item.organizerCustom?.trim() || item.departemen?.namaDepartemen?.trim() || undefined,
  contactPerson: item.contactPerson?.trim() || undefined,
  speakers: Array.isArray(item.speakers) ? item.speakers.filter(Boolean) : [],
});

export const getKegiatan = async (signal?: AbortSignal): Promise<Kegiatan[]> => {
  const response = await axiosPublic.get<ApiResponse<PaginatedResponse<KegiatanResponse>>>("/kegiatan", {
    signal,
  });

  return response.data.data.data.map(mapKegiatan);
};

export const getKegiatanFilters = (items: Kegiatan[]): string[] => {
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const labels = categories.map((category) =>
    category
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  );

  return ["Semua", ...labels];
};

export const getLatestKegiatan = async (limit = 3, signal?: AbortSignal): Promise<Kegiatan[]> => {
  const data = await getKegiatan(signal);
  return data.slice(0, limit);
};

export const getKegiatanById = async (id: number, signal?: AbortSignal): Promise<Kegiatan> => {
  const response = await axiosPublic.get<ApiResponse<KegiatanResponse>>(`/kegiatan/${id}`, {
    signal,
  });

  return mapKegiatan(response.data.data);
};
