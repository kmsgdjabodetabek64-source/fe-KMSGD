import { useState } from "react";
import AdminKategoriKegiatan from "./AdminKategoriKegiatan";
import AdminKegiatanHeader from "../components/adminKegiatan/AdminKegiatanHeader";
import KegiatanTabContent from "../components/adminKegiatan/KegiatanTabContent";
import Tabs from "@/components/Tabs";
import type { TabItem } from "@/components/Tabs";

type TabType = "kegiatan" | "kategori";

export default function AdminKegiatan() {
    const [activeTab, setActiveTab] = useState<TabType>("kegiatan");

    const tabs: TabItem<TabType>[] = [
        { key: "kegiatan", label: "KEGIATAN" },
        { key: "kategori", label: "KATEGORI" },
    ];

    return (
        <section className="font-sans text-[#ffd700]">
            <AdminKegiatanHeader />

            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "kategori" ? <AdminKategoriKegiatan /> : <KegiatanTabContent />}
        </section>
    );
}