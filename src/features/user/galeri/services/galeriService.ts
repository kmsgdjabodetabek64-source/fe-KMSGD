import axiosPublic from "../../../../lib/axiosPublic";

export interface GaleriItem {
  id: number;
  judul?: string;
  tipe: "FOTO" | "VIDEO";
  url: string;
  thumbnail?: string;
  kegiatanId?: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationData<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getGaleri(tipe?: "FOTO" | "VIDEO", page = 1, limit = 12): Promise<PaginationData<GaleriItem>> {
  const url = tipe ? `/galeri/tipe/${tipe}` : "/galeri";
  const res = await axiosPublic.get<ApiResponse<PaginationData<GaleriItem>>>(url, {
    params: { page, limit },
  });
  return res.data.data;
}

