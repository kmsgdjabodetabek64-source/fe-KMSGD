import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getHomeBackgrounds, deleteHomeBackground } from "../service/homeBackgroundService";
import type { HomeBackground } from "./homeBackgroundTypes";
import Table, { type Column } from "@/components/TableAdmin";
import { FaPlus } from "react-icons/fa";
import FormBackgroundModal from "./FormBackgroundModal";

const HOME_BACKGROUND_QUERY_KEY = ["home-backgrounds"];

const AdminHomeBackground = () => {
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [editId, setEditId] = useState<number | null>(null);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");

    const { data = [], isLoading } = useQuery({
        queryKey: HOME_BACKGROUND_QUERY_KEY,
        queryFn: async () => {
            const res = await getHomeBackgrounds(1, 50);
            return res.data || [];
        },
    });

    const refreshBackgrounds = useCallback(() => {
        return queryClient.invalidateQueries({ queryKey: HOME_BACKGROUND_QUERY_KEY });
    }, [queryClient]);

    const handleOpenForm = useCallback((bg?: HomeBackground) => {
        if (bg) {
            setEditId(bg.id);
            setIsActive(bg.isActive);
            setFile(null);
            setPreview(bg.image);
        } else {
            setEditId(null);
            setIsActive(true);
            setFile(null);
            setPreview("");
        }
        setIsFormOpen(true);
    }, []);

    const handleCloseForm = useCallback(() => {
        setIsFormOpen(false);
        setEditId(null);
        setIsActive(true);
        setFile(null);
        setPreview("");
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus background ini?")) return;
        try {
            await deleteHomeBackground(id);
            await refreshBackgrounds();
        } catch (error) {
            console.error("Gagal menghapus:", error);
            alert("Gagal menghapus data");
        }
    }, [refreshBackgrounds]);

    const columns = useMemo<Column<HomeBackground>[]>(() => [
        {
            header: "Foto",
            cellClassName: "w-32",
            render: (item) => (
                <div className="w-54 border border-[#2a2a2a] overflow-hidden bg-[#1a1a1a]">
                    <img src={item.image} alt="Background" className="w-full h-full object-cover" />
                </div>
            )
        },
        {
            header: "Status",
            render: (item) => (
                <span className={`inline-block px-3 py-1 text-xs font-bold border ${item.isActive
                    ? 'border-[#b8982a] text-[#ffd700] bg-[#1a1500]'
                    : 'border-[#444] text-zinc-400 bg-[#1a1a1a]'
                    }`}>
                    {item.isActive ? "Aktif" : "Tidak Aktif"}
                </span>
            )
        },
        {
            header: "Tanggal Dibuat",
            cellClassName: "text-zinc-400",
            render: (item) => new Date(item.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit", month: "short", year: "numeric"
            })
        },
        {
            header: "Aksi",
            cellClassName: "w-40",
            render: (item) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenForm(item)}
                        className="bg-transparent border border-[#b8982a] text-[#b8982a] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#b8982a]/10 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-transparent border border-[#7a1a1a] text-[#f09595] py-1 px-3 text-xs cursor-pointer tracking-[0.04em] hover:bg-[#7a1a1a]/10 transition-colors"
                    >
                        Hapus
                    </button>
                </div>
            )
        }
    ], [handleDelete, handleOpenForm]);

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#ffd700] tracking-wider mb-1">
                        Home Background
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Kelola foto latar belakang (slideshow) untuk halaman utama.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 bg-[#ffd700] text-[#0a0a0a] py-2 px-5 font-bold text-sm tracking-wider hover:bg-[#b8982a]/90 transition-colors cursor-pointer"
                >
                    <FaPlus /> TAMBAH FOTO
                </button>
            </div>

            <Table
                data={data}
                columns={columns}
                loading={isLoading}
                rowKey={(bg) => bg.id}
                emptyMessage="Belum ada home background yang ditambahkan."
            />

            {isFormOpen && (
                <FormBackgroundModal
                    editId={editId}
                    isActive={isActive}
                    setIsActive={setIsActive}
                    file={file}
                    setFile={setFile}
                    preview={preview}
                    setPreview={setPreview}
                    onClose={handleCloseForm}
                    onSuccess={refreshBackgrounds}
                />
            )}
        </div>
    );
};

export default AdminHomeBackground;