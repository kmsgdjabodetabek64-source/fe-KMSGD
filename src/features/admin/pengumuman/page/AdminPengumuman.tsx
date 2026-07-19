import { useState } from "react";
import AdminKategoriPengumuman from "../components/AdminKategoriPengumuman";
import AdminListHeader from "@/components/common/admin/AdminListHeader";
import PengumumanTabContent from "../components/PengumumanTabContent";
import Tabs from "@/components/Tabs";
import type { TabItem } from "@/components/Tabs";

type TabType = "pengumuman" | "kategori";

export default function AdminPengumuman() {
    const [activeTab, setActiveTab] = useState<TabType>("pengumuman");

    const tabs: TabItem<TabType>[] = [
        { key: "pengumuman", label: "PENGUMUMAN" },
        { key: "kategori", label: "KATEGORI" },
    ];

    return (
        <section className="font-sans text-[#ffd700]">
            <AdminListHeader title="Manajemen Pengumuman" subtitle="Kelola data pengumuman dan kategori" />

            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "kategori" ? <AdminKategoriPengumuman /> : <PengumumanTabContent />}
        </section>
    );
}