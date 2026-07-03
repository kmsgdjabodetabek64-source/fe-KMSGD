import { useEffect, useState, useCallback, useRef } from "react";
import { getPengumuman, deletePengumuman } from "../../service/pengumumanService";
import type { Pengumuman } from "../pengumumanTypes";
import AdminKategoriPengumuman from "../components/AdminKategoriPengumuman";

import PengumumanTable from "../components/PengumumanTable";
import Pagination from "@/features/admin/kegiatan/components/adminKegiatan/Pagination";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

type TabType = "pengumuman" | "kategori";

const AdminPengumuman = () => {
    const [data, setData] = useState<Pengumuman[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState<TabType>("pengumuman");

    // cegah request duplikat (StrictMode double-invoke) & race condition
    const requestIdRef = useRef(0);
    const abortRef = useRef<AbortController | null>(null);
    const hasFetchedRef = useRef(false);

    const fetchData = useCallback(async () => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const currentRequestId = ++requestIdRef.current;

        setLoading(true);
        setError(null);
        try {
            const result = await getPengumuman({ signal: controller.signal });

            if (currentRequestId !== requestIdRef.current) return;
            setData(result);
        } catch (err: unknown) {
            const isAbort =
                err instanceof Error &&
                (err.name === "AbortError" || err.name === "CanceledError");
            if (isAbort) return;

            if (currentRequestId === requestIdRef.current) {
                setError("Gagal memuat data pengumuman.");
            }
        } finally {
            if (currentRequestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(1);
    }, [search, perPage]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deletePengumuman(deleteId);
            setData((prev) => prev.filter((p) => p.id !== deleteId));
        } catch {
            setError("Gagal menghapus pengumuman.");
        } finally {
            setConfirmDelete(false);
            setDeleteId(null);
        }
    };

    const filtered = data.filter(
        (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.kategori.nama.toLowerCase().includes(search.toLowerCase()) ||
            p.author.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / perPage);
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const tabs: { key: TabType; label: string }[] = [
        { key: "pengumuman", label: "PENGUMUMAN" },
        { key: "kategori", label: "KATEGORI" },
    ];

    return (
        <section className="font-sans text-[#ffd700]">
            <div className="mb-8 border-b border-[#b8982a] pb-4">
                <h1 className="text-[1.75rem] font-bold text-[#ffd700] m-0">Manajemen Pengumuman</h1>
                <p className="text-[#a89040] mt-1 m-0 text-[0.9rem]">Kelola data pengumuman dan kategori</p>
            </div>

            <div className="flex gap-1 border-b border-[#2a2a2a] mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-6 py-3 font-bold text-sm tracking-wider transition-colors cursor-pointer ${activeTab === tab.key
                            ? "bg-[#1a1500] border-b-2 border-[#b8982a] text-[#ffd700]"
                            : "bg-transparent border-b-2 border-transparent text-zinc-500 hover:text-[#b8982a]"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "kategori" ? (
                <AdminKategoriPengumuman />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-5 gap-4 flex-wrap">
                        <input
                            type="text"
                            placeholder="Cari judul, kategori, author..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#ffd700] text-[#ffd700] py-2 px-3.5 text-sm outline-none w-80 focus:ring-1 focus:ring-[#ffd700]"
                        />
                        <a
                            href="/admin/pengumuman/tambah"
                            className="bg-[#ffd700] text-[#0a0a0a] py-2 px-5 font-bold text-sm no-underline tracking-wider hover:bg-[#b8982a]/90 transition-colors"
                        >
                            + Tambah Pengumuman
                        </a>
                    </div>

                    {error && (
                        <div className="bg-[#2a0a0a] border border-[#7a1a1a] text-[#f09595] py-2.5 px-4 mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <PengumumanTable
                        data={paginated}
                        loading={loading}
                        page={page}
                        perPage={perPage}
                        onDeleteClick={(id) => { setDeleteId(id); setConfirmDelete(true); }}
                    />

                    {!loading && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            perPage={perPage}
                            totalItems={filtered.length}
                            onPageChange={setPage}
                            onPerPageChange={setPerPage}
                        />
                    )}

                    <ConfirmDeleteModal
                        open={confirmDelete}
                        onCancel={() => { setConfirmDelete(false); setDeleteId(null); }}
                        onConfirm={handleDelete}
                        title="Hapus Pengumuman"
                        description="Yakin ingin menghapus pengumuman ini? Tindakan ini tidak bisa dibatalkan."
                    />
                </>
            )
            }
        </section >
    );
};

export default AdminPengumuman;