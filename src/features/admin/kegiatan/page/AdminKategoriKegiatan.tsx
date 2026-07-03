import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { getKategori, createKategori, updateKategori, deleteKategori } from "../../service/kegiatanService";
import type { KategoriKegiatan } from "../kegiatanTypes";
import Table, { type Column } from "@/components/TableAdmin";

const AdminKategoriKegiatan = () => {
    const [data, setData] = useState<KategoriKegiatan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [formNama, setFormNama] = useState("");

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

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
            const result = await getKategori(controller.signal);

            if (currentRequestId !== requestIdRef.current) return;
            setData(result);
        } catch (err: unknown) {
            const isAbort =
                err instanceof Error &&
                (err.name === "AbortError" || err.name === "CanceledError");
            if (isAbort) return;

            if (currentRequestId === requestIdRef.current) {
                setError("Gagal memuat data kategori.");
            }
        } finally {
            if (currentRequestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        // guard tambahan: cegah fetch ganda dari StrictMode double-invoke di dev
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        fetchData();

        return () => abortRef.current?.abort();
    }, [fetchData]);

    const handleOpenForm = (kategori?: KategoriKegiatan) => {
        if (kategori) {
            setEditId(kategori.id);
            setFormNama(kategori.nama);
        } else {
            setEditId(null);
            setFormNama("");
        }
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditId(null);
        setFormNama("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                const updated = await updateKategori(editId, { nama: formNama });
                setData((prev) => prev.map((k) => k.id === editId ? updated : k));
            } else {
                const created = await createKategori({ nama: formNama });
                setData((prev) => [...prev, created]);
            }
            handleCloseForm();
        } catch {
            setError("Gagal menyimpan kategori.");
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteKategori(deleteId);
            setData((prev) => prev.filter((k) => k.id !== deleteId));
        } catch {
            setError("Gagal menghapus kategori. Pastikan tidak ada kegiatan yang menggunakan kategori ini.");
        } finally {
            setConfirmDelete(false);
            setDeleteId(null);
        }
    };

    const columns = useMemo<Column<KategoriKegiatan>[]>(() => [
        {
            header: "#",
            cellClassName: "text-zinc-500 tabular-nums w-16",
            render: (_, globalIndex) => globalIndex,
        },
        {
            header: "Nama Kategori",
            cellClassName: "text-[#ffd700]",
            render: (k) => k.nama,
        },
        {
            header: "Aksi",
            cellClassName: "w-40",
            render: (k) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenForm(k)}
                        className="bg-transparent border border-[#b8982a] text-[#b8982a] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#b8982a]/10 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => { setDeleteId(k.id); setConfirmDelete(true); }}
                        className="bg-transparent border border-[#7a1a1a] text-[#f09595] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#7a1a1a]/10 transition-colors"
                    >
                        Hapus
                    </button>
                </div>
            ),
        },
    ], []);

    return (
        <div className="mt-6">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-[#ffd700] m-0 text-xl font-bold">Daftar Kategori</h2>
                <button
                    onClick={() => handleOpenForm()}
                    className="bg-[#ffd700] text-[#0a0a0a] py-2 px-5 font-bold text-sm tracking-wider hover:bg-[#b8982a]/90 transition-colors cursor-pointer"
                >
                    + Tambah Kategori
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-[#2a0a0a] border border-[#7a1a1a] text-[#f09595] py-2.5 px-4 mb-4 text-sm">
                    {error}
                </div>
            )}

            {/* Table */}
            <Table
                data={data}
                columns={columns}
                loading={loading}
                rowKey={(k) => k.id}
                emptyMessage="Tidak ada kategori ditemukan."
            />

            {/* Form Modal */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                    <div className="bg-[#0f0f0f] border border-[#b8982a] p-8 w-90">
                        <h3 className="text-[#ffd700] m-0 mb-4 text-base font-bold">
                            {editId ? "Edit Kategori" : "Tambah Kategori"}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-[#a89040] text-xs font-bold uppercase mb-2">
                                    Nama Kategori *
                                </label>
                                <input
                                    type="text"
                                    value={formNama}
                                    onChange={(e) => setFormNama(e.target.value)}
                                    required
                                    placeholder="Contoh: Seminar"
                                    className="w-full bg-[#1a1a1a] border border-[#b8982a] text-[#ffd700] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#b8982a]"
                                />
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="bg-transparent border border-zinc-700 text-zinc-400 py-2 px-5 cursor-pointer text-sm hover:bg-zinc-900 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#b8982a] border border-[#b8982a] text-[#0a0a0a] py-2 px-5 cursor-pointer text-sm font-bold hover:bg-[#b8982a]/90 transition-colors"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
                    <div className="bg-[#0f0f0f] border border-[#b8982a] p-8 w-90">
                        <h3 className="text-[#ffd700] m-0 mb-3 text-base font-bold">
                            Hapus Kategori
                        </h3>
                        <p className="text-[#a89040] text-sm m-0 mb-6">
                            Yakin ingin menghapus kategori ini? Pastikan kategori ini tidak sedang digunakan oleh kegiatan.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => { setConfirmDelete(false); setDeleteId(null); }}
                                className="bg-transparent border border-zinc-700 text-zinc-400 py-2 px-5 cursor-pointer text-sm hover:bg-zinc-900 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-[#7a1a1a] border border-[#7a1a1a] text-[#f09595] py-2 px-5 cursor-pointer text-sm font-bold hover:bg-[#962121] transition-colors"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminKategoriKegiatan;