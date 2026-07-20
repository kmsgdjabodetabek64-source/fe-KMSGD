import { Fragment, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    FaLayerGroup, FaPlus, FaPen, FaTrash, FaTimes,
    FaChevronDown, FaChevronUp, FaImage, FaUsers,
} from "react-icons/fa";
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
    CreateAnggotaBKDto,
} from "../kepengurusanTypes";

const BKPage = () => {
    const queryClient = useQueryClient();

    // ── Periode filter
    const [manualPeriodeId, setManualPeriodeId] = useState<number | null>(null);

    // ── Expanded row (anggota)
    const [expandedBK, setExpandedBK] = useState<number | null>(null);

    // ── Modal BK
    const [isBKModalOpen, setIsBKModalOpen] = useState(false);
    const [isEditBK, setIsEditBK] = useState(false);
    const [editBKId, setEditBKId] = useState<number | null>(null);
    const [bkForm, setBkForm] = useState({
        periodeId: 0,
        namaBK: "",
        deskripsi: "",
    });
    const [bkImgFile, setBkImgFile] = useState<File | null>(null);
    const [bkImgPreview, setBkImgPreview] = useState<string | null>(null);
    const bkImgRef = useRef<HTMLInputElement>(null);
    const [isBKSaving, setIsBKSaving] = useState(false);

    // ── Modal Anggota BK
    const [isAnggotaModalOpen, setIsAnggotaModalOpen] = useState(false);
    const [anggotaForm, setAnggotaForm] = useState<CreateAnggotaBKDto & { file?: File | null }>({
        bkId: 0,
        nama: "",
        jabatan: "",
        file: null,
    });
    const [isUploading, setIsUploading] = useState(false);

    // ── Confirm Delete
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: "bk" | "anggota"; id: number } | null>(null);

    // ── QUERIES
    const { data: periodes = [] } = useQuery({
        queryKey: ["periode-list-simple"],
        queryFn: getPeriodeSimple,
        staleTime: 30_000,
    });

    const viewPeriodeId =
        manualPeriodeId ??
        periodes.find((p) => p.status === "AKTIF")?.id ??
        periodes[0]?.id ??
        null;

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

    // ── BK HANDLERS
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
            setBkImgPreview(bk.img || null);
        } else {
            setIsEditBK(false);
            setEditBKId(null);
            setBkForm({
                periodeId: viewPeriodeId || periodes[0]?.id || 0,
                namaBK: "",
                deskripsi: "",
            });
            setBkImgPreview(null);
        }
        setBkImgFile(null);
        setIsBKModalOpen(true);
    };

    const handleBkImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBkImgFile(file);
        setBkImgPreview(URL.createObjectURL(file));
    };

    const submitBK = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsBKSaving(true);
        try {
            const fd = new FormData();
            fd.append("periodeId", String(bkForm.periodeId));
            fd.append("namaBK", bkForm.namaBK);
            if (bkForm.deskripsi) fd.append("deskripsi", bkForm.deskripsi);
            if (bkImgFile) fd.append("img", bkImgFile);

            if (isEditBK && editBKId) {
                await updateBK(editBKId, fd);
            } else {
                await createBK(fd);
            }
            setIsBKModalOpen(false);
            refetchCurrentView();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan badan khusus");
        } finally {
            setIsBKSaving(false);
        }
    };

    const handleDeleteBK = (id: number) => {
        setDeleteTarget({ type: "bk", id });
        setConfirmDelete(true);
    };

    // ── ANGGOTA HANDLERS
    const handleOpenAnggotaModal = (bkId: number) => {
        setAnggotaForm({ bkId, nama: "", jabatan: "Anggota", file: null });
        setIsAnggotaModalOpen(true);
    };

    const submitAnggota = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            const fd = new FormData();
            fd.append("bkId", String(anggotaForm.bkId));
            fd.append("nama", anggotaForm.nama);
            fd.append("jabatan", anggotaForm.jabatan);
            if (anggotaForm.file) fd.append("image", anggotaForm.file);
            await createAnggotaBK(fd);
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

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3 text-[#ffd700]">
                    <FaLayerGroup className="text-xl" />
                    <h2 className="text-xl font-bold">Badan Khusus</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    <select
                        value={viewPeriodeId || ""}
                        onChange={(e) => setManualPeriodeId(Number(e.target.value))}
                        className="bg-neutral-800 border border-neutral-700 text-white text-sm px-3 py-2 focus:outline-none focus:border-yellow-400 w-full sm:w-auto"
                    >
                        {periodes.map((p) => (
                            <option key={p.id} value={p.id} className="bg-neutral-800">
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

            {/* ── Tabel ── */}
            <div className="overflow-x-auto border border-neutral-800">
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="bg-neutral-800 text-neutral-400 uppercase text-xs tracking-wider">
                            <th className="px-4 py-3 w-10">#</th>
                            <th className="px-4 py-3 w-16">Foto</th>
                            <th className="px-4 py-3">Nama Badan Khusus</th>
                            <th className="px-4 py-3 hidden md:table-cell">Deskripsi</th>
                            <th className="px-4 py-3 text-center">Anggota</th>
                            <th className="px-4 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="text-center text-neutral-400 py-10">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                        Memuat data...
                                    </div>
                                </td>
                            </tr>
                        ) : bkList.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-neutral-500 py-12">
                                    <FaLayerGroup className="text-3xl mx-auto mb-2 text-neutral-700" />
                                    Belum ada badan khusus untuk periode yang dipilih.
                                </td>
                            </tr>
                        ) : (
                            bkList.map((bk, idx) => (
                                <Fragment key={bk.id}>
                                    {/* ── Baris Badan Khusus ── */}
                                    <tr
                                        key={bk.id}
                                        className="border-t border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800/60 transition-colors"
                                    >
                                        {/* No */}
                                        <td className="px-4 py-3 text-neutral-500 font-mono text-xs">
                                            {idx + 1}
                                        </td>

                                        {/* Foto Bersama */}
                                        <td className="px-4 py-3">
                                            <div className="w-12 h-12 bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center shrink-0">
                                                {bk.img ? (
                                                    <img
                                                        src={bk.img}
                                                        alt={bk.namaBK}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FaImage className="text-neutral-600 text-lg" />
                                                )}
                                            </div>
                                        </td>

                                        {/* Nama BK */}
                                        <td className="px-4 py-3">
                                            <p className="text-white font-semibold">{bk.namaBK}</p>
                                            {bk.deskripsi && (
                                                <p className="text-neutral-400 text-xs mt-0.5 md:hidden line-clamp-2">
                                                    {bk.deskripsi}
                                                </p>
                                            )}
                                        </td>

                                        {/* Deskripsi (desktop only) */}
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <p className="text-neutral-400 text-xs line-clamp-2 max-w-xs">
                                                {bk.deskripsi || <span className="italic text-neutral-600">—</span>}
                                            </p>
                                        </td>

                                        {/* Jumlah Anggota */}
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs px-2 py-1 font-medium">
                                                <FaUsers className="text-[10px]" />
                                                {bk.anggota?.length ?? 0}
                                            </span>
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => toggleBK(bk.id)}
                                                    title="Lihat anggota"
                                                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                                                >
                                                    {expandedBK === bk.id
                                                        ? <FaChevronUp className="text-xs" />
                                                        : <FaChevronDown className="text-xs" />}
                                                </button>
                                                <button
                                                    onClick={() => handleOpenBKModal(bk)}
                                                    title="Edit badan khusus"
                                                    className="p-2 text-neutral-400 hover:text-yellow-400 transition-colors"
                                                >
                                                    <FaPen className="text-xs" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBK(bk.id)}
                                                    title="Hapus badan khusus"
                                                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                                                >
                                                    <FaTrash className="text-xs" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* ── Baris Anggota (expanded) ── */}
                                    {expandedBK === bk.id && (
                                        <tr key={`anggota-${bk.id}`} className="bg-neutral-950/60 border-t border-neutral-800">
                                            <td colSpan={6} className="p-0">
                                                <div className="px-6 py-4 border-l-4 border-l-yellow-400/40">
                                                    {/* Sub-header */}
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                                        <h4 className="text-neutral-400 text-sm font-medium flex items-center gap-2">
                                                            <FaUsers className="text-yellow-400/70" />
                                                            Daftar Anggota — <span className="text-white">{bk.namaBK}</span>
                                                        </h4>
                                                        <button
                                                            onClick={() => handleOpenAnggotaModal(bk.id)}
                                                            className="flex items-center gap-1.5 text-[#ffd700] text-xs font-semibold border border-yellow-400/50 px-3 py-1.5 hover:bg-yellow-400/10 transition-colors"
                                                        >
                                                            <FaPlus className="text-[10px]" />
                                                            Tambah Anggota
                                                        </button>
                                                    </div>

                                                    {/* Sub-tabel anggota */}
                                                    {bk.anggota && bk.anggota.length > 0 ? (
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm">
                                                                <thead>
                                                                    <tr className="text-neutral-500 text-xs border-b border-neutral-800">
                                                                        <th className="pb-2 font-medium text-left w-8">#</th>
                                                                        <th className="pb-2 font-medium text-left">Anggota</th>
                                                                        <th className="pb-2 font-medium text-left hidden sm:table-cell">Jabatan</th>
                                                                        <th className="pb-2 font-medium text-center w-16">Hapus</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {bk.anggota.map((anggota, aIdx) => (
                                                                        <tr
                                                                            key={anggota.id}
                                                                            className="border-b border-neutral-800/50 last:border-0 hover:bg-neutral-800/30 transition-colors"
                                                                        >
                                                                            <td className="py-2.5 text-neutral-600 text-xs font-mono">
                                                                                {aIdx + 1}
                                                                            </td>
                                                                            <td className="py-2.5">
                                                                                <div className="flex items-center gap-3">
                                                                                    {anggota.image ? (
                                                                                        <img
                                                                                            src={anggota.image}
                                                                                            alt={anggota.nama}
                                                                                            className="w-8 h-8 object-cover shrink-0"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="w-8 h-8 bg-neutral-700 text-[#ffd700] font-bold flex items-center justify-center text-xs shrink-0">
                                                                                            {anggota.nama.substring(0, 2).toUpperCase()}
                                                                                        </div>
                                                                                    )}
                                                                                    <div>
                                                                                        <p className="text-white text-sm font-medium">{anggota.nama}</p>
                                                                                        <p className="text-[#ffd700] text-xs sm:hidden">{anggota.jabatan}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="py-2.5 hidden sm:table-cell">
                                                                                <span className={`text-xs px-2 py-0.5 ${anggota.jabatan.toLowerCase() !== "anggota"
                                                                                    ? "bg-yellow-400/10 text-yellow-300 border border-yellow-400/20"
                                                                                    : "text-neutral-400"
                                                                                    }`}>
                                                                                    {anggota.jabatan}
                                                                                </span>
                                                                            </td>
                                                                            <td className="py-2.5 text-center">
                                                                                <button
                                                                                    onClick={() => handleDeleteAnggota(anggota.id)}
                                                                                    className="text-neutral-500 hover:text-red-400 transition-colors p-1.5"
                                                                                >
                                                                                    <FaTimes className="text-xs" />
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <p className="text-neutral-600 text-sm italic">
                                                            Belum ada anggota di badan khusus ini.
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            {!isLoading && bkList.length > 0 && (
                <p className="text-neutral-600 text-xs mt-3">
                    Total <span className="text-neutral-400 font-medium">{bkList.length}</span> badan khusus
                    · <span className="text-neutral-400 font-medium">
                        {bkList.reduce((acc, b) => acc + (b.anggota?.length ?? 0), 0)}
                    </span> anggota
                </p>
            )}

            {/* ══════════════════════════════════════
                Modal Tambah / Edit Badan Khusus
            ══════════════════════════════════════ */}
            {isBKModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {/* Header modal */}
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg text-white font-bold">
                                {isEditBK ? "Edit Badan Khusus" : "Tambah Badan Khusus"}
                            </h3>
                            <button
                                onClick={() => setIsBKModalOpen(false)}
                                className="text-neutral-400 hover:text-white transition-colors p-1"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={submitBK} className="flex flex-col gap-4">
                            {/* Foto Bersama */}
                            <div>
                                <label className="block text-sm text-neutral-400 mb-2">
                                    Foto Bersama Badan Khusus
                                    <span className="text-neutral-600 ml-1">(opsional)</span>
                                </label>
                                <div
                                    className="w-full h-40 bg-neutral-800 border-2 border-dashed border-neutral-700 hover:border-yellow-400/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden mb-2 relative group"
                                    onClick={() => bkImgRef.current?.click()}
                                >
                                    {bkImgPreview ? (
                                        <>
                                            <img
                                                src={bkImgPreview}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-xs font-medium flex items-center gap-1">
                                                    <FaImage /> Ganti foto
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <FaImage className="text-neutral-600 text-2xl mx-auto mb-1" />
                                            <p className="text-neutral-500 text-xs">Klik untuk upload foto</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={bkImgRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBkImgChange}
                                    className="hidden"
                                />
                                {bkImgPreview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBkImgFile(null);
                                            setBkImgPreview(null);
                                            if (bkImgRef.current) bkImgRef.current.value = "";
                                        }}
                                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                                    >
                                        <FaTimes className="text-[10px]" /> Hapus foto
                                    </button>
                                )}
                            </div>

                            {/* Periode */}
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Periode</label>
                                <select
                                    required
                                    value={bkForm.periodeId || ""}
                                    onChange={(e) => setBkForm({ ...bkForm, periodeId: Number(e.target.value) })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400"
                                >
                                    <option value="" disabled>Pilih Periode</option>
                                    {periodes.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.periode} — {p.status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Nama BK */}
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Nama Badan Khusus</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="contoh: Badan Khusus Media & Komunikasi"
                                    value={bkForm.namaBK}
                                    onChange={(e) => setBkForm({ ...bkForm, namaBK: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-yellow-400"
                                />
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Deskripsi</label>
                                <textarea
                                    placeholder="Deskripsi singkat badan khusus..."
                                    value={bkForm.deskripsi}
                                    onChange={(e) => setBkForm({ ...bkForm, deskripsi: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-yellow-400 resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2 pt-4 border-t border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setIsBKModalOpen(false)}
                                    disabled={isBKSaving}
                                    className="px-4 py-2 border border-neutral-700 text-neutral-300 text-sm hover:border-neutral-500 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isBKSaving}
                                    className="px-4 py-2 bg-yellow-400 text-black font-semibold text-sm hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isBKSaving ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════
                Modal Tambah Anggota BK
            ══════════════════════════════════════ */}
            {isAnggotaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg text-white font-bold">Tambah Anggota BK</h3>
                            <button
                                onClick={() => setIsAnggotaModalOpen(false)}
                                className="text-neutral-400 hover:text-white transition-colors p-1"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={submitAnggota} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nama anggota..."
                                    value={anggotaForm.nama}
                                    onChange={(e) => setAnggotaForm({ ...anggotaForm, nama: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Jabatan</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="contoh: Ketua / Wakil Ketua / Anggota"
                                    value={anggotaForm.jabatan}
                                    onChange={(e) => setAnggotaForm({ ...anggotaForm, jabatan: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">
                                    Foto <span className="text-neutral-600">(opsional)</span>
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setAnggotaForm({ ...anggotaForm, file: e.target.files?.[0] || null })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-neutral-700 file:text-neutral-300 hover:file:bg-neutral-600 cursor-pointer"
                                />
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2 pt-4 border-t border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setIsAnggotaModalOpen(false)}
                                    disabled={isUploading}
                                    className="px-4 py-2 border border-neutral-700 text-neutral-300 text-sm hover:border-neutral-500 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="px-4 py-2 bg-yellow-400 text-black font-semibold text-sm hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Mengunggah...
                                        </>
                                    ) : "Simpan"}
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