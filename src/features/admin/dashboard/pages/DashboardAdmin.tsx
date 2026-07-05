import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    MdArticle,
    MdCampaign,
    MdEvent,
    MdGroups,
    MdPhotoLibrary,
    MdTrendingUp,
} from "react-icons/md";
import { Link } from "react-router-dom";
import { getAdminDashboardSummary } from "../../service/dashboardService";
import type { IconType } from "react-icons";

type StatItem = {
    label: string;
    value: number;
    icon: IconType;
    path: string;
};

const formatNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

const formatDate = (value: string) =>
    new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));

const DashboardAdmin = () => {
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

        const stats: StatItem[] = [
            {
                label: "Kegiatan",
                value: data?.totalKegiatan ?? 0,
                icon: MdEvent,
                path: "/admin/kegiatan",
            },
            {
                label: "Pengumuman",
                value: data?.totalPengumuman ?? 0,
                icon: MdCampaign,
                path: "/admin/pengumuman",
            },
            {
                label: "Galeri",
                value: data?.totalGaleri ?? 0,
                icon: MdPhotoLibrary,
                path: "/admin/galeri",
            },
            {
                label: "Anggota",
                value: currentMembers,
                icon: MdGroups,
                path: "/admin/kepengurusan/pengurus",
            },
        ];

        const memberNote =
            memberDelta === 0
                ? "Tetap"
                : `${memberDelta > 0 ? "+" : ""}${formatNumber(memberDelta)} dari sblmnya`;

        const maxTrendValue = Math.max(...memberTrend.map((t) => t.total), 1);

        return { stats, memberNote, memberTrend, maxTrendValue, memberDelta };
    }, [data]);

    return (
        <div className="w-full">
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="mb-6 sm:mb-8 flex flex-col gap-1 sm:gap-2">
                <h1 className="text-[#FACC15] text-xl sm:text-3xl font-bold tracking-wide">
                    Dashboard Admin
                </h1>
                <p className="text-neutral-400 text-xs sm:text-sm">
                    Ringkasan data konten dan perkembangan kepengurusan KMSGD.
                </p>
            </div>

            {/* ── Error ──────────────────────────────────────────────── */}
            {isError && (
                <div className="mb-4 sm:mb-6 border border-[#7a1a1a] bg-[#2a0a0a] px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm text-[#f09595]">
                    Gagal memuat ringkasan dashboard. Periksa koneksi API atau sesi admin.
                </div>
            )}

            {/* ── Stat Cards ─────────────────────────────────────────── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
                {summary.stats.map((item, idx) => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className="flex flex-col justify-between border border-neutral-800 bg-neutral-900 p-3 sm:p-5 hover:border-[#FACC15] transition-colors"
                    >
                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                            <div className="min-w-0">
                                <p className="text-neutral-500 text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-widest line-clamp-1">
                                    {item.label}
                                </p>
                                <p className="mt-1 sm:mt-3 text-lg sm:text-3xl font-bold text-white tabular-nums leading-none truncate">
                                    {isLoading ? "..." : formatNumber(item.value)}
                                </p>
                            </div>
                            <div className="inline-flex shrink-0 h-7 w-7 sm:h-10 sm:w-10 items-center justify-center bg-neutral-800 text-[#FACC15]">
                                <item.icon className="text-base sm:text-2xl" />
                            </div>
                        </div>
                        <p className="mt-3 sm:mt-4 text-[9px] sm:text-xs text-neutral-500 leading-tight line-clamp-2">
                            {isLoading
                                ? "Memuat..."
                                : idx === 3
                                    ? summary.memberNote
                                    : `Total ${item.label.toLowerCase()} tercatat`}
                        </p>
                    </Link>
                ))}
            </div>

            {/* ── Tren Anggota + Aktivitas Terbaru ───────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-4 sm:gap-6">
                {/* Tren Anggota */}
                <section className="border border-neutral-800 bg-neutral-900 p-3 sm:p-5">
                    <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                        <div className="min-w-0">
                            <h2 className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest">
                                Tren Anggota
                            </h2>
                            <p className="text-neutral-500 text-[10px] sm:text-xs mt-1">
                                Berdasarkan BPI dan anggota tercatat.
                            </p>
                        </div>
                        <MdTrendingUp className="shrink-0 text-[#FACC15] text-xl sm:text-2xl" />
                    </div>

                    <div className="flex min-h-48 sm:min-h-64 items-end gap-2 sm:gap-4 overflow-x-auto pb-2">
                        {isLoading ? (
                            <p className="self-center text-xs sm:text-sm text-neutral-500 w-full text-center">
                                Memuat tren...
                            </p>
                        ) : summary.memberTrend.length > 0 ? (
                            summary.memberTrend.map((item) => (
                                <div
                                    key={item.periode}
                                    className="flex min-w-16 sm:min-w-24 flex-1 flex-col items-center gap-2 sm:gap-3"
                                >
                                    <div className="flex h-32 sm:h-44 w-full items-end border-b border-neutral-800">
                                        <div
                                            className="w-full bg-[#FACC15] transition-all"
                                            style={{
                                                height: `${Math.max(
                                                    (item.total / summary.maxTrendValue) * 100,
                                                    8
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                    <div className="text-center w-full min-w-0">
                                        <p className="text-white text-xs sm:text-sm font-bold tabular-nums">
                                            {formatNumber(item.total)}
                                        </p>
                                        <p className="text-neutral-500 text-[9px] sm:text-xs line-clamp-1 px-0.5">
                                            {item.periode}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="self-center text-xs sm:text-sm text-neutral-500 w-full text-center">
                                Belum ada data.
                            </p>
                        )}
                    </div>
                </section>

                {/* Aktivitas Terbaru */}
                <section className="border border-neutral-800 bg-neutral-900 p-3 sm:p-5">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
                        <MdArticle className="shrink-0 text-[#FACC15] text-xl sm:text-2xl" />
                        <h2 className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest">
                            Aktivitas
                        </h2>
                    </div>

                    <div className="flex flex-col divide-y divide-neutral-800">
                        {isLoading ? (
                            <p className="py-6 sm:py-8 text-xs sm:text-sm text-neutral-500 text-center">
                                Memuat aktivitas...
                            </p>
                        ) : (data?.recentItems ?? []).length > 0 ? (
                            (data?.recentItems ?? []).map((item) => (
                                <div key={`${item.module}-${item.id}`} className="py-2 sm:py-3">
                                    <div className="flex items-center justify-between gap-2 sm:gap-3">
                                        <p className="min-w-0 text-white text-xs sm:text-sm font-medium line-clamp-1">
                                            {item.title}
                                        </p>
                                        <span className="shrink-0 border border-neutral-700 px-1.5 py-0.5 sm:px-2 sm:py-1 text-[8px] sm:text-[10px] uppercase tracking-widest text-neutral-400">
                                            {item.module}
                                        </span>
                                    </div>
                                    <p className="text-neutral-500 text-[10px] sm:text-xs mt-1">
                                        {formatDate(item.createdAt)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="py-6 sm:py-8 text-xs sm:text-sm text-neutral-500 text-center">
                                Belum ada aktivitas konten.
                            </p>
                        )}
                    </div>
                </section>
            </div>

            {/* ── Kegiatan Terdekat ──────────────────────────────────── */}
            <section className="mt-4 sm:mt-6 border border-neutral-800 bg-neutral-900 p-3 sm:p-5">
                <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
                    <div className="min-w-0">
                        <h2 className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest">
                            Kegiatan Terdekat
                        </h2>
                        <p className="text-neutral-500 text-[10px] sm:text-xs mt-1">
                            Jadwal mendatang dalam sistem.
                        </p>
                    </div>
                    <Link
                        to="/admin/kegiatan"
                        className="shrink-0 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FACC15]"
                    >
                        Kelola
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {isLoading ? (
                        <p className="text-xs sm:text-sm text-neutral-500">Memuat kegiatan...</p>
                    ) : (data?.upcomingKegiatan ?? []).length > 0 ? (
                        (data?.upcomingKegiatan ?? []).map((item) => (
                            <div
                                key={item.id}
                                className="border border-neutral-800 bg-[#0f0f0f] p-3 sm:p-4"
                            >
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FACC15]">
                                    {formatDate(item.startTime)}
                                </p>
                                <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-white line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-neutral-500 line-clamp-1">
                                    {item.location}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs sm:text-sm text-neutral-500">
                            Belum ada kegiatan mendatang.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default DashboardAdmin;