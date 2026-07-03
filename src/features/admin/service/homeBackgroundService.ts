import axiosAdmin from "./axiosAdmin";
import type { PaginatedHomeBackground, HomeBackground } from "../homeBackground/homeBackgroundTypes";

export const getHomeBackgrounds = async (page = 1, limit = 12): Promise<PaginatedHomeBackground> => {
  const { data } = await axiosAdmin.get("/home-background", {
    params: { page, limit },
  });
  return data.data;
};

export const getActiveHomeBackgrounds = async (): Promise<HomeBackground[]> => {
  const { data } = await axiosAdmin.get("/home-background/active");
  return data.data;
};

export const createHomeBackground = async (file: File, isActive: boolean = true) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("isActive", String(isActive));
  const { data } = await axiosAdmin.post("/home-background", formData);
  return data.data;
};

export const updateHomeBackground = async (id: number, file?: File, isActive?: boolean) => {
  const formData = new FormData();
  if (file) formData.append("image", file);
  if (isActive !== undefined) formData.append("isActive", String(isActive));
  const { data } = await axiosAdmin.put(`/home-background/${id}`, formData);
  return data.data;
};

export const deleteHomeBackground = async (id: number) => {
  const { data } = await axiosAdmin.delete(`/home-background/${id}`);
  return data;
};
