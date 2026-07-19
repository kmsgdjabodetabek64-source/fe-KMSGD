import { useDashboardSummary } from "@/hooks/useDashboardSummary";
import DashboardHeader from "../components/DashboardHeader";
import DashboardErrorBanner from "../components/DashboardErrorBanner";
import Statistik from "../components/Statistik";
import TrenAnggota from "../components/TrenAnggota";
import Aktivitas from "../components/Aktivitas";
import KegiatanTerdekat from "../components/KegiatanTerdekat";

export default function DashboardAdmin() {
    const {
        isLoading,
        isError,
        stats,
        memberTrend,
        maxTrendValue,
        recentItems,
        upcomingKegiatan,
    } = useDashboardSummary();

    return (
        <div className="w-full">
            <DashboardHeader />

            {isError && <DashboardErrorBanner />}

            <Statistik stats={stats} isLoading={isLoading} />

            <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-4 sm:gap-6">
                <TrenAnggota isLoading={isLoading} memberTrend={memberTrend} maxTrendValue={maxTrendValue} />
                <Aktivitas isLoading={isLoading} items={recentItems} />
            </div>

            <KegiatanTerdekat isLoading={isLoading} events={upcomingKegiatan} />
        </div>
    );
}