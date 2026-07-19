import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdEvent, MdCampaign, MdPhotoLibrary, MdGroups } from "react-icons/md";
import { getAdminDashboardSummary } from "@/features/admin/service/dashboardService";
import { formatNumber } from "../utils/formatters";
import type { StatItem } from "@/features/admin/dashboard/components/Statistik";

export function useDashboardSummary() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-dashboard-summary"],
    queryFn: getAdminDashboardSummary,
    staleTime: 60_000,
  });

  const summary = useMemo(() => {
    const memberTrend = data?.memberTrend ?? [];
    const currentMembers = memberTrend.at(-1)?.total ?? 0;
    const previousMembers = memberTrend.at(-2)?.total ?? 0;
    const memberDelta = currentMembers - previousMembers;

    const memberNote = memberDelta === 0 ? "Tetap" : `${memberDelta > 0 ? "+" : ""}${formatNumber(memberDelta)} dari sblmnya`;

    const stats: StatItem[] = [
      {
        label: "Kegiatan",
        value: data?.totalKegiatan ?? 0,
        note: "Total kegiatan tercatat",
        icon: MdEvent,
        path: "/admin/kegiatan",
      },
      {
        label: "Pengumuman",
        value: data?.totalPengumuman ?? 0,
        note: "Total pengumuman tercatat",
        icon: MdCampaign,
        path: "/admin/pengumuman",
      },
      {
        label: "Galeri",
        value: data?.totalGaleri ?? 0,
        note: "Total galeri tercatat",
        icon: MdPhotoLibrary,
        path: "/admin/galeri",
      },
      {
        label: "Anggota",
        value: currentMembers,
        note: memberNote,
        icon: MdGroups,
        path: "/admin/kepengurusan/pengurus",
      },
    ];

    const maxTrendValue = Math.max(...memberTrend.map((t) => t.total), 1);

    return { stats, memberTrend, maxTrendValue };
  }, [data]);

  return {
    isLoading,
    isError,
    stats: summary.stats,
    memberTrend: summary.memberTrend,
    maxTrendValue: summary.maxTrendValue,
    recentItems: data?.recentItems ?? [],
    upcomingKegiatan: data?.upcomingKegiatan ?? [],
  };
}
