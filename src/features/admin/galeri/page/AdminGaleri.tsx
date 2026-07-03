import { useEffect, useState, useCallback, useRef } from "react";
import { getGaleriAdmin, createGaleri, updateGaleri, deleteGaleri } from "../../service/galeriService";
import type { Galeri, CreateGaleriPayload } from "../galeriType";
import GaleriFormModal from "../components/GaleriFormModal";
import ConfirmDeleteModal from "../../kegiatan/components/adminKegiatan/ConfirmDeleteModal";
import GaleriTable from "../components/GaleriTable";

const AdminGaleri = () => {
    const [data, setData] = useState<Galeri[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Galeri | null>(null);

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // cegah request duplikat dari StrictMode double-invoke di dev
    const hasFetchedRef = useRef(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getGaleriAdmin();
            setData(result);
        } catch {
            setError("Gagal memuat data galeri.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;

        fetchData();
    }, [fetchData]);

    const handleOpenForm = (galeri?: Galeri) => {
        setEditing(galeri ?? null);
        setFormOpen(true);
    };

    const handleSubmit = async (payload: CreateGaleriPayload) => {
        if (editing) {
            const updated = await updateGaleri(editing.id, payload);
            setData((prev) => prev.map((g) => g.id === editing.id ? updated : g));
        } else {
            const created = await createGaleri(payload);
            setData((prev) => [created, ...prev]);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteGaleri(deleteId);
            setData((prev) => prev.filter((g) => g.id !== deleteId));
        } catch {
            setError("Gagal menghapus galeri.");
        } finally {
            setConfirmDelete(false);
            setDeleteId(null);
        }
    };

    return (
        <section className="font-sans text-[#ffd700]">
            <div className="mb-8 border-b border-[#b8982a] pb-4 flex justify-between items-end flex-wrap gap-4">
                <div>
                    <h1 className="text-[1.75rem] font-bold text-[#ffd700] m-0">Manajemen Galeri</h1>
                    <p className="text-[#a89040] mt-1 m-0 text-[0.9rem]">Kelola foto dokumentasi kegiatan</p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="bg-[#ffd700] text-[#0a0a0a] py-2 px-5 font-bold text-sm tracking-wider hover:bg-[#b8982a]/90 transition-colors cursor-pointer"
                >
                    + Tambah Foto
                </button>
            </div>

            {error && (
                <div className="bg-[#2a0a0a] border border-[#7a1a1a] text-[#f09595] py-2.5 px-4 mb-4 text-sm">
                    {error}
                </div>
            )}

            <GaleriTable
                data={data}
                loading={loading}
                onEditClick={handleOpenForm}
                onDeleteClick={(id) => { setDeleteId(id); setConfirmDelete(true); }}
            />

            <GaleriFormModal
                open={formOpen}
                editing={editing}
                onClose={() => setFormOpen(false)}
                onSubmit={handleSubmit}
            />

            <ConfirmDeleteModal
                open={confirmDelete}
                onCancel={() => { setConfirmDelete(false); setDeleteId(null); }}
                onConfirm={handleDelete}
                title="Hapus Galeri"
                description="Yakin ingin menghapus item galeri ini? Tindakan ini tidak bisa dibatalkan."
            />
        </section>
    );
};

export default AdminGaleri;