import axiosAdmin from "./axiosAdmin";
import type { Pengumuman, CreatePengumumanPayload, KategoriPengumuman, KategoriPengumumanPayload, UpdatePengumumanPayload } from "../pengumuman/pengumumanTypes";

const BASE = "/pengumuman";

type PaginatedResponse<T> = {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export interface GetPengumumanParams {
  limit?: number;
  signal?: AbortSignal;
}

export async function getPengumuman(params?: number | GetPengumumanParams): Promise<Pengumuman[]> {
  const { limit, signal } = typeof params === "number" ? { limit: params, signal: undefined } : (params ?? {});

  const res = await axiosAdmin.get<{ data: PaginatedResponse<Pengumuman> }>(BASE, {
    params: limit ? { limit } : undefined,
    signal,
  });
  return res.data.data.data;
}

export async function getPengumumanPenting(): Promise<Pengumuman[]> {
  const res = await axiosAdmin.get<{ data: PaginatedResponse<Pengumuman> }>(`${BASE}/penting`);
  return res.data.data.data;
}

export async function getPengumumanById(id: number): Promise<Pengumuman> {
  const res = await axiosAdmin.get<{ data: Pengumuman }>(`${BASE}/admin/${id}`);
  return res.data.data;
}

// ─── KATEGORI PENGUMUMAN (tidak dipaginasi) ──────────────────────────────────

export async function getKategoriPengumuman(): Promise<KategoriPengumuman[]> {
  const res = await axiosAdmin.get<{ data: KategoriPengumuman[] }>("/kategori-pengumuman");
  return res.data.data;
}

export async function createKategoriPengumuman(payload: KategoriPengumumanPayload): Promise<KategoriPengumuman> {
  const res = await axiosAdmin.post<{ data: KategoriPengumuman }>("/kategori-pengumuman", payload);
  return res.data.data;
}

export async function updateKategoriPengumuman(id: number, payload: KategoriPengumumanPayload): Promise<KategoriPengumuman> {
  const res = await axiosAdmin.put<{ data: KategoriPengumuman }>(`/kategori-pengumuman/${id}`, payload);
  return res.data.data;
}

export async function deleteKategoriPengumuman(id: number): Promise<void> {
  await axiosAdmin.delete(`/kategori-pengumuman/${id}`);
}

// ─── FORM DATA BUILDER ────────────────────────────────────────────────────

function buildFormData(payload: Omit<CreatePengumumanPayload, "file"> & { file?: File | null }): FormData {
  const { file, persyaratan, berkas, timeline, ...rest } = payload;
  const fd = new FormData();

  Object.entries(rest).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      fd.append(key, String(val));
    }
  });

  fd.append("persyaratan", JSON.stringify(persyaratan ?? []));
  fd.append("berkas", JSON.stringify(berkas ?? []));
  fd.append("timeline", JSON.stringify(timeline ?? []));

  if (file) fd.append("image", file);

  return fd;
}

export async function createPengumuman(payload: CreatePengumumanPayload): Promise<Pengumuman> {
  const fd = buildFormData(payload);
  const res = await axiosAdmin.post<{ data: Pengumuman }>(BASE, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function updatePengumuman(id: number, payload: UpdatePengumumanPayload): Promise<Pengumuman> {
  const fd = buildFormData(payload as CreatePengumumanPayload);
  const res = await axiosAdmin.put<{ data: Pengumuman }>(`${BASE}/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function deletePengumuman(id: number): Promise<void> {
  await axiosAdmin.delete(`${BASE}/${id}`);
}
