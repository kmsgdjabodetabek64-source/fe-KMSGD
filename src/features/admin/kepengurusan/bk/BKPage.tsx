import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaLayerGroup, FaPlus, FaPen, FaChevronDown, FaChevronUp, FaTimes, FaTrash } from "react-icons/fa";
import ConfirmDeleteModal from "../../kegiatan/components/adminKegiatan/ConfirmDeleteModal";
import {
    getPeriodeSimple,
    getBKByPeriode,
    createBK,
    updateBK,
    deleteBK,
    createAnggotaBK,
    deleteAnggotaBK,
} from "../../service/kepengurusanService";
import type {
    BadanKhusus,
    CreateBKDto,
    UpdateBKDto,
    CreateAnggotaBKDto,
} from "../kepengurusanTypes";

const BKPage = () => {
    const queryClient = useQueryClient();

    const [manualPeriodeId, setManualPeriodeId] = useState<number | null>(null);
    const [expandedBK, setExpandedBK] = useState<number | null>(null);

    // Modal BK
    const [isBKModalOpen, setIsBKModalOpen] = useState(false);
    const [isEditBK, setIsEditBK] = useState(false);
    const [editBKId, setEditBKId] = useState<number | null>(null);
    const [bkForm, setBkForm] = useState<CreateBKDto>({
        periodeId: 0,
        namaBK: "",
        deskripsi: "",
    });

    // Modal Anggota BK
    const [isAnggotaModalOpen, setIsAnggotaModalOpen] = useState(false);
    const [anggotaForm, setAnggotaForm] = useState<CreateAnggotaBKDto & { file?: File | null }>({
        bkId: 0,
        nama: "",
        jabatan: "",
        file: null,
    });
    const [isUploading, setIsUploading] = useState(false);

    // Confirm Delete
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: "bk" | "anggota"; id: number } | null>(null);

    // ── QUERIES ──────────────────────────────────────────────
    // Ambil semua periode — periode aktif di-derive dari list ini
    // sehingga hanya butuh 2 query (periode + bk), bukan 3
    const { data: periodes = [] } = useQuery({
        queryKey: ["periode-list-simple"],
        queryFn: getPeriodeSimple,
        staleTime: 30_000,
    });

    // Derived: cari yg status AKTIF, fallback ke index-0
    const viewPeriodeId = manualPeriodeId
        ?? periodes.find(p => p.status === "AKTIF")?.id
        ?? periodes[0]?.id
        ?? null;

    const { data: bkList = [], isLoading } = useQuery({
        queryKey: ["bk-by-periode", viewPeriodeId],
        queryFn: () => getBKByPeriode(viewPeriodeId as number),
        enabled: viewPeriodeId !== null,
        staleTime: 15_000,
    });

    const refetchCurrentView = () => {
        queryClient.invalidateQueries({ queryKey: ["bk-by-periode", viewPeriodeId] });
    };

    const toggleBK = (id: number) => {
        setExpandedBK(expandedBK === id ? null : id);
    };

    // ── BK HANDLERS ──────────────────────────────────────────
    const handleOpenBKModal = (bk?: BadanKhusus) => {
        if (periodes.length === 0) {
            alert("Belum ada data periode.");
            return;
        }
        if (bk) {
            setIsEditBK(true);
            setEditBKId(bk.id);
            setBkForm({
                periodeId: bk.periodeId,
                namaBK: bk.namaBK,
                deskripsi: bk.deskripsi || "",
            });
        } else {
            setIsEditBK(false);
            setEditBKId(null);
            setBkForm({
                periodeId: viewPeriodeId || periodes[0]?.id || 0,
                namaBK: "",
                deskripsi: "",
            });
        }
        setIsBKModalOpen(true);
    };

    const submitBK = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditBK && editBKId) {
                await updateBK(editBKId, bkForm as UpdateBKDto);
            } else {
                await createBK(bkForm);
            }
            setIsBKModalOpen(false);
            refetchCurrentView();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan badan khusus");
        }
    };

    const handleDeleteBK = (id: number) => {
        setDeleteTarget({ type: "bk", id });
        setConfirmDelete(true);
    };

    // ── ANGGOTA HANDLERS ─────────────────────────────────────
    const handleOpenAnggotaModal = (bkId: number) => {
        setAnggotaForm({
            bkId,
            nama: "",
            jabatan: "Anggota",
            file: null,
        });
        setIsAnggotaModalOpen(true);
    };

    const submitAnggota = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            const formDataPayload = new FormData();
            formDataPayload.append("bkId", String(anggotaForm.bkId));
            formDataPayload.append("nama", anggotaForm.nama);
            formDataPayload.append("jabatan", anggotaForm.jabatan);
            if (anggotaForm.file) {
                formDataPayload.append("image", anggotaForm.file);
            }
            await createAnggotaBK(formDataPayload);
            setIsAnggotaModalOpen(false);
            refetchCurrentView();
        } catch (error) {
            console.error(error);
            alert("Gagal menambahkan anggota");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteAnggota = (id: number) => {
        setDeleteTarget({ type: "anggota", id });
        setConfirmDelete(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            if (deleteTarget.type === "bk") {
                await deleteBK(deleteTarget.id);
            } else {
                await deleteAnggotaBK(deleteTarget.id);
            }
            refetchCurrentView();
        } catch (error) {
            console.error(error);
        } finally {
            setConfirmDelete(false);
            setDeleteTarget(null);
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3 text-[#ffd700]">
                    <FaLayerGroup className="text-xl" />
                    <h2 className="text-xl font-bold">Badan Khusus</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 w-full md:w-auto">
                    <select
                        value={viewPeriodeId || ""}
                        onChange={(e) => setManualPeriodeId(Number(e.target.value))}
                        className="bg-neutral-800 border border-neutral-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-yellow-400 w-full sm:w-auto"
                    >
                        {periodes.map(p => (
                            <option key={p.id} value={p.id} className="text-[14px] bg-neutral-800">
                                {p.periode} ({p.status})
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={() => handleOpenBKModal()}
                        className="flex justify-center items-center gap-2 border border-yellow-400 text-[#ffd700] px-4 py-2 font-semibold hover:bg-yellow-400 hover:text-black transition-colors w-full sm:w-auto"
                    >
                        <FaPlus />
                        Tambah BK
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="text-neutral-400 text-center py-8">Loading...</div>
                ) : bkList.length === 0 ? (
                    <div className="text-neutral-400 text-center py-8 border border-neutral-800">
                        Belum ada badan khusus untuk periode yang dipilih.
                    </div>
                ) : (
                    bkList.map((bk) => (
                        <div key={bk.id} className="border border-neutral-800 bg-neutral-900/30">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 border-l-4 border-l-yellow-400 hover:bg-neutral-800/50 transition-colors gap-4 md:gap-0">
                                <div
                                    className="flex items-start md:items-center gap-4 cursor-pointer flex-1"
                                    onClick={() => toggleBK(bk.id)}
                                >
                                    <div className="w-10 h-10 bg-yellow-400/10 text-[#ffd700] flex items-center justify-center shrink-0">
                                        <FaLayerGroup />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-base">{bk.namaBK}</h3>
                                        <p className="text-neutral-400 text-sm">{bk.deskripsi}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2 md:gap-4 pt-3 md:pt-0 border-t md:border-transparent border-neutral-800">
                                    <span className="border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs text-neutral-300 whitespace-nowrap">
                                        {bk.anggota?.length || 0} Anggota
                                    </span>
                                    <div className="flex items-center gap-1 md:gap-4">
                                        <button onClick={() => handleOpenBKModal(bk)} className="text-neutral-400 hover:text-white p-2">
                                            <FaPen className="text-sm" />
                                        </button>
                                        <button onClick={() => handleDeleteBK(bk.id)} className="text-neutral-400 hover:text-red-500 p-2">
                                            <FaTrash className="text-sm" />
                                        </button>
                                        <button onClick={() => toggleBK(bk.id)} className="text-neutral-400 p-2">
                                            {expandedBK === bk.id ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {expandedBK === bk.id && (
                                <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
                                        <h4 className="text-neutral-400 text-sm font-medium">Daftar Anggota Badan Khusus</h4>
                                        <button
                                            onClick={() => handleOpenAnggotaModal(bk.id)}
                                            className="flex items-center gap-1 text-[#ffd700] text-sm font-semibold hover:text-yellow-300 w-full sm:w-auto"
                                        >
                                            <FaPlus className="text-xs" />
                                            Tambah Anggota
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {bk.anggota && bk.anggota.length > 0 ? (
                                            bk.anggota.map((anggota) => (
                                                <div key={anggota.id} className="flex justify-between items-center bg-neutral-800 p-3">
                                                    <div className="flex items-center gap-3">
                                                        {anggota.image ? (
                                                            <img src={anggota.image} alt={anggota.nama} className="w-10 h-10 object-cover" />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-neutral-700 text-[#ffd700] font-bold flex items-center justify-center text-sm shrink-0">
                                                                {anggota.nama.substring(0, 2).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <div className="overflow-hidden">
                                                            <p className="text-white font-medium text-sm truncate">{anggota.nama}</p>
                                                            {anggota.jabatan.toLowerCase() !== "anggota" && (
                                                                <p className="text-[#ffd700] text-xs truncate">{anggota.jabatan}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleDeleteAnggota(anggota.id)} className="text-neutral-500 hover:text-red-400 transition-colors p-2 shrink-0">
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-neutral-500">Belum ada anggota.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Modal Tambah/Edit BK */}
            {isBKModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl text-white font-bold mb-4">
                            {isEditBK ? "Edit Badan Khusus" : "Tambah Badan Khusus"}
                        </h3>
                        <form onSubmit={submitBK} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Periode</label>
                                <select
                                    required
                                    value={bkForm.periodeId || ""}
                                    onChange={(e) => setBkForm({ ...bkForm, periodeId: Number(e.target.value) })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                                >
                                    <option value="" disabled>Pilih Periode</option>
                                    {periodes.map(p => (
                                        <option key={p.id} value={p.id}>{p.periode} - {p.status}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Nama Badan Khusus</label>
                                <input
                                    type="text"
                                    required
                                    value={bkForm.namaBK}
                                    onChange={(e) => setBkForm({ ...bkForm, namaBK: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Deskripsi</label>
                                <textarea
                                    value={bkForm.deskripsi}
                                    onChange={(e) => setBkForm({ ...bkForm, deskripsi: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                                    rows={3}
                                />
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsBKModalOpen(false)} className="w-full sm:w-auto px-4 py-2 border border-neutral-700 text-neutral-300 text-center">Batal</button>
                                <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-yellow-400 text-black font-semibold text-center">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Tambah Anggota BK */}
            {isAnggotaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl text-white font-bold mb-4">Tambah Anggota BK</h3>
                        <form onSubmit={submitAnggota} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={anggotaForm.nama}
                                    onChange={(e) => setAnggotaForm({ ...anggotaForm, nama: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Jabatan</label>
                                <input
                                    type="text"
                                    required
                                    value={anggotaForm.jabatan}
                                    onChange={(e) => setAnggotaForm({ ...anggotaForm, jabatan: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Foto (Opsional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setAnggotaForm({ ...anggotaForm, file: e.target.files?.[0] || null })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white file:mr-4 file:py-1 file:px-3 file:border-0 file:bg-neutral-700 file:text-neutral-300 hover:file:bg-neutral-600 cursor-pointer text-sm"
                                />
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsAnggotaModalOpen(false)} disabled={isUploading} className="w-full sm:w-auto px-4 py-2 border border-neutral-700 text-neutral-300 text-center">Batal</button>
                                <button type="submit" disabled={isUploading} className="w-full sm:w-auto px-4 py-2 bg-yellow-400 text-black font-semibold text-center flex justify-center">
                                    {isUploading ? "Mengunggah..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDeleteModal
                open={confirmDelete}
                onCancel={() => { setConfirmDelete(false); setDeleteTarget(null); }}
                onConfirm={handleConfirmDelete}
                title="Hapus Data"
                description="Yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan."
            />
        </div>
    );
};

export default BKPage;