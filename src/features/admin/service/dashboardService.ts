import axiosAdmin from "./axiosAdmin";

export type DashboardRecentItem = {
  id: number;
  title: string;
  module: "Kegiatan" | "Pengumuman" | "Galeri";
  createdAt: string;
};

export type DashboardUpcomingEvent = {
  id: number;
  title: string;
  startTime: string;
  location: string;
};

export type DashboardMemberTrend = {
  periode: string;
  total: number;
};

export type DashboardSummary = {
  totalKegiatan: number;
  totalPengumuman: number;
  totalGaleri: number;
  recentItems: DashboardRecentItem[];
  upcomingKegiatan: DashboardUpcomingEvent[];
  memberTrend: DashboardMemberTrend[];
};

export async function getAdminDashboardSummary(): Promise<DashboardSummary> {
  const res = await axiosAdmin.get("/admin/dashboard/summary");
  return res.data.data;
}
