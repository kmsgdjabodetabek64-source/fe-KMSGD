import { useEffect, useState, useRef, useCallback } from "react";
import { getKegiatanAdmin, deleteKegiatan } from "../../service/kegiatanService";
import type { Kegiatan } from "../kegiatanTypes";
import AdminKategoriKegiatan from "./AdminKategoriKegiatan";

import KegiatanTable from "../components/adminKegiatan/KegiatanTable";
import Pagination from "../components/adminKegiatan/Pagination";
import ConfirmDeleteModal from "../components/adminKegiatan/ConfirmDeleteModal";
import Tabs from "@/components/Tabs";
import type { TabItem } from "@/components/Tabs";

type TabType = "kegiatan" | "kategori";

function useDebouncedValue<T>(value: T, delay = 400): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

const AdminKegiatan = () => {
    const [data, setData] = useState<Kegiatan[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [activeTab, setActiveTab] = useState<TabType>("kegiatan");

    const debouncedSearch = useDebouncedValue(search, 400);

    const requestIdRef = useRef(0);
    const abortRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async () => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const currentRequestId = ++requestIdRef.current;

        setLoading(true);
        setError(null);

        try {
            const result = await getKegiatanAdmin({
                search: debouncedSearch,
                page,
                perPage,
                signal: controller.signal,
            });

            if (currentRequestId !== requestIdRef.current) return;

            setData(result.data);
            setTotalItems(result.total);
        } catch (err: unknown) {
            const isAbort =
                err instanceof Error &&
                (err.name === "AbortError" || err.name === "CanceledError");
            if (isAbort) return;

            if (currentRequestId === requestIdRef.current) {
                setError("Gagal memuat data kegiatan.");
            }
        } finally {
            if (currentRequestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, [debouncedSearch, page, perPage]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchData();
        return () => abortRef.current?.abort();
    }, [fetchData]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteKegiatan(deleteId);
            fetchData();
        } catch {
            setError("Gagal menghapus kegiatan.");
        } finally {
            setConfirmDelete(false);
            setDeleteId(null);
        }
    };

    const totalPages = Math.ceil(totalItems / perPage);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handlePerPageChange = (value: number) => {
        setPerPage(value);
        setPage(1);
    };

    const tabs: TabItem<TabType>[] = [
        { key: "kegiatan", label: "KEGIATAN" },
        { key: "kategori", label: "KATEGORI" },
    ];

    return (
        <section className="font-sans text-[#ffd700]">
            <div className="mb-8 border-b border-[#b8982a] pb-4">
                <h1 className="text-[1.75rem] font-bold text-[#ffd700] m-0">Manajemen Kegiatan</h1>
                <p className="text-neutral-400 mt-1 m-0 text-[0.9rem]">
                    Kelola data kegiatan, kategori, dan speaker
                </p>
            </div>

            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "kategori" ? (
                <AdminKategoriKegiatan />
            ) : (
                <>
                    <div className="flex justify-between items-center mb-5 gap-4 flex-wrap">
                        <input
                            type="text"
                            placeholder="Cari judul, kategori, departemen, lokasi..."
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="bg-[#1a1a1a] border border-[#ffd700] text-[#ffd700] py-2 px-3.5 text-sm outline-none w-80 focus:ring-1 focus:ring-[#ffd700]"
                        />
                        <a
                            href="/admin/kegiatan/tambah"
                            className="bg-[#ffd700] text-[#0a0a0a] py-2 px-5 font-bold text-sm no-underline tracking-wider hover:bg-[#b8982a]/90 transition-colors"
                        >
                            + Tambah Kegiatan
                        </a>
                    </div>

                    {error && (
                        <div className="bg-[#2a0a0a] border border-[#7a1a1a] text-[#f09595] py-2.5 px-4 mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <KegiatanTable
                        data={data}
                        loading={loading}
                        page={page}
                        perPage={perPage}
                        onDeleteClick={(id) => {
                            setDeleteId(id);
                            setConfirmDelete(true);
                        }}
                    />

                    {!loading && (
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            perPage={perPage}
                            totalItems={totalItems}
                            onPageChange={setPage}
                            onPerPageChange={handlePerPageChange}
                        />
                    )}

                    <ConfirmDeleteModal
                        open={confirmDelete}
                        onCancel={() => {
                            setConfirmDelete(false);
                            setDeleteId(null);
                        }}
                        onConfirm={handleDelete}
                        title="Hapus Kegiatan"
                        description="Yakin ingin menghapus kegiatan ini? Tindakan ini tidak bisa dibatalkan."
                    />
                </>
            )}
        </section>
    );
};

export default AdminKegiatan;