import { Fragment, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    FaSitemap, FaPlus, FaPen, FaTrash, FaTimes,
    FaChevronDown, FaChevronUp, FaImage, FaUsers
} from "react-icons/fa";
import ConfirmDeleteModal from "../../kegiatan/components/adminKegiatan/ConfirmDeleteModal";
import {
    getPeriodeSimple,
    getPeriodeAktif,
    getDepartemenByPeriode,
    createDepartemen,
    updateDepartemen,
    deleteDepartemen,
    createAnggota,
    deleteAnggota,
} from "../../service/kepengurusanService";
import type {
    Departemen,
    CreateAnggotaDto,
} from "../kepengurusanTypes";

/* ─────────────────────────────────────────────
   Helper: preview image
───────────────────────────────────────────── */
const ImagePreview = ({ src, alt, className }: { src?: string | null; alt: string; className?: string }) => {
    if (!src) return null;
    return <img src={src} alt={alt} className={className ?? "w-full h-full object-cover"} />;
};

/* ─────────────────────────────────────────────
   DepartemenPage
───────────────────────────────────────────── */
const DepartemenPage = () => {
    const queryClient = useQueryClient();

    // ── Periode filter
    const [manualPeriodeId, setManualPeriodeId] = useState<number | null>(null);

    // ── Expanded row (anggota)
    const [expandedDept, setExpandedDept] = useState<number | null>(null);

    // ── Modal Departemen
    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
    const [isEditDept, setIsEditDept] = useState(false);
    const [editDeptId, setEditDeptId] = useState<number | null>(null);
    const [deptForm, setDeptForm] = useState({
        periodeId: 0,
        namaDepartemen: "",
        deskripsi: "",
    });
    const [deptImgFile, setDeptImgFile] = useState<File | null>(null);
    const [deptImgPreview, setDeptImgPreview] = useState<string | null>(null);

    const deptImgRef = useRef<HTMLInputElement>(null);

    // ── Modal Anggota
    const [isAnggotaModalOpen, setIsAnggotaModalOpen] = useState(false);
    const [anggotaForm, setAnggotaForm] = useState<CreateAnggotaDto & { file?: File | null }>({
        departemenId: 0,
        nama: "",
        jabatan: "",
        file: null,
    });
    const [isUploading, setIsUploading] = useState(false);
    const [isDeptSaving, setIsDeptSaving] = useState(false);

    // ── Confirm Delete
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: "dept" | "anggota"; id: number } | null>(null);

    // ── QUERIES
    const { data: periodes = [] } = useQuery({
        queryKey: ["periode-list-simple"],
        queryFn: getPeriodeSimple,
        staleTime: 30_000,
    });

    const { data: periodeAktif } = useQuery({
        queryKey: ["periode-aktif"],
        queryFn: getPeriodeAktif,
        staleTime: 30_000,
    });

    const viewPeriodeId = manualPeriodeId ?? periodeAktif?.id ?? periodes[0]?.id ?? null;

    const { data: departemenList = [], isLoading } = useQuery({
        queryKey: ["departemen-by-periode", viewPeriodeId],
        queryFn: () => getDepartemenByPeriode(viewPeriodeId as number),
        enabled: viewPeriodeId !== null,
        staleTime: 15_000,
    });

    const refetchCurrentView = () => {
        queryClient.invalidateQueries({ queryKey: ["departemen-by-periode", viewPeriodeId] });
    };

    const toggleDept = (id: number) => {
        setExpandedDept(expandedDept === id ? null : id);
    };

    // ── DEPARTEMEN HANDLERS
    const handleOpenDeptModal = (dept?: Departemen) => {
        if (periodes.length === 0) {
            alert("Belum ada data periode.");
            return;
        }
        if (dept) {
            setIsEditDept(true);
            setEditDeptId(dept.id);
            setDeptForm({
                periodeId: dept.periodeId,
                namaDepartemen: dept.namaDepartemen,
                deskripsi: dept.deskripsi || "",
            });

            setDeptImgPreview(dept.img || null);
        } else {
            setIsEditDept(false);
            setEditDeptId(null);
            setDeptForm({
                periodeId: viewPeriodeId || periodes[0]?.id || 0,
                namaDepartemen: "",
                deskripsi: "",
            });
            setDeptImgPreview(null);
        }
        setDeptImgFile(null);
        setIsDeptModalOpen(true);
    };

    const handleDeptImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setDeptImgFile(file);
        setDeptImgPreview(URL.createObjectURL(file));
    };

    const submitDept = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDeptSaving(true);
        try {
            const fd = new FormData();
            fd.append("periodeId", String(deptForm.periodeId));
            fd.append("namaDepartemen", deptForm.namaDepartemen);
            if (deptForm.deskripsi) fd.append("deskripsi", deptForm.deskripsi);
            if (deptImgFile) fd.append("img", deptImgFile);

            if (isEditDept && editDeptId) {
                await updateDepartemen(editDeptId, fd);
            } else {
                await createDepartemen(fd);
            }
            setIsDeptModalOpen(false);
            refetchCurrentView();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan departemen");
        } finally {
            setIsDeptSaving(false);
        }
    };

    const handleDeleteDept = (id: number) => {
        setDeleteTarget({ type: "dept", id });
        setConfirmDelete(true);
    };

    // ── ANGGOTA HANDLERS
    const handleOpenAnggotaModal = (deptId: number) => {
        setAnggotaForm({ departemenId: deptId, nama: "", jabatan: "Anggota", file: null });
        setIsAnggotaModalOpen(true);
    };

    const submitAnggota = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            const fd = new FormData();
            fd.append("departemenId", String(anggotaForm.departemenId));
            fd.append("nama", anggotaForm.nama);
            fd.append("jabatan", anggotaForm.jabatan);
            if (anggotaForm.file) fd.append("image", anggotaForm.file);
            await createAnggota(fd);
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
            if (deleteTarget.type === "dept") {
                await deleteDepartemen(deleteTarget.id);
            } else {
                await deleteAnggota(deleteTarget.id);
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
                    <FaSitemap className="text-xl" />
                    <h2 className="text-xl font-bold">Departemen</h2>
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
                        onClick={() => handleOpenDeptModal()}
                        className="flex justify-center items-center gap-2 border border-yellow-400 text-[#ffd700] px-4 py-2 font-semibold hover:bg-yellow-400 hover:text-black transition-colors w-full sm:w-auto"
                    >
                        <FaPlus />
                        Tambah Departemen
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
                            <th className="px-4 py-3">Nama Departemen</th>
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
                        ) : departemenList.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center text-neutral-500 py-12">
                                    <FaSitemap className="text-3xl mx-auto mb-2 text-neutral-700" />
                                    Belum ada departemen untuk periode yang dipilih.
                                </td>
                            </tr>
                        ) : (
                            departemenList.map((dept, idx) => (
                                <Fragment key={dept.id}>
                                    {/* ── Baris Departemen ── */}
                                    <tr
                                        key={dept.id}
                                        className="border-t border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800/60 transition-colors"
                                    >
                                        {/* No */}
                                        <td className="px-4 py-3 text-neutral-500 font-mono text-xs">
                                            {idx + 1}
                                        </td>

                                        {/* Foto Bersama */}
                                        <td className="px-4 py-3">
                                            <div className="w-12 h-12 bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center shrink-0">
                                                {dept.img ? (
                                                    <ImagePreview
                                                        src={dept.img}
                                                        alt={dept.namaDepartemen}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FaImage className="text-neutral-600 text-lg" />
                                                )}
                                            </div>
                                        </td>

                                        {/* Nama Departemen */}
                                        <td className="px-4 py-3">
                                            <p className="text-white font-semibold">{dept.namaDepartemen}</p>
                                            {/* Deskripsi tampil di mobile (di bawah nama) */}
                                            {dept.deskripsi && (
                                                <p className="text-neutral-400 text-xs mt-0.5 md:hidden line-clamp-2">
                                                    {dept.deskripsi}
                                                </p>
                                            )}
                                        </td>

                                        {/* Deskripsi (desktop only) */}
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <p className="text-neutral-400 text-xs line-clamp-2 max-w-xs">
                                                {dept.deskripsi || <span className="italic text-neutral-600">—</span>}
                                            </p>
                                        </td>

                                        {/* Jumlah Anggota */}
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex items-center gap-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs px-2 py-1 font-medium">
                                                <FaUsers className="text-[10px]" />
                                                {dept.anggota?.length ?? 0}
                                            </span>
                                        </td>

                                        {/* Aksi */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                {/* Toggle anggota */}
                                                <button
                                                    onClick={() => toggleDept(dept.id)}
                                                    title="Lihat anggota"
                                                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                                                >
                                                    {expandedDept === dept.id
                                                        ? <FaChevronUp className="text-xs" />
                                                        : <FaChevronDown className="text-xs" />}
                                                </button>
                                                {/* Edit */}
                                                <button
                                                    onClick={() => handleOpenDeptModal(dept)}
                                                    title="Edit departemen"
                                                    className="p-2 text-neutral-400 hover:text-yellow-400 transition-colors"
                                                >
                                                    <FaPen className="text-xs" />
                                                </button>
                                                {/* Hapus */}
                                                <button
                                                    onClick={() => handleDeleteDept(dept.id)}
                                                    title="Hapus departemen"
                                                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                                                >
                                                    <FaTrash className="text-xs" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* ── Baris Anggota (expanded) ── */}
                                    {expandedDept === dept.id && (
                                        <tr key={`anggota-${dept.id}`} className="bg-neutral-950/60 border-t border-neutral-800">
                                            <td colSpan={6} className="p-0">
                                                <div className="px-6 py-4 border-l-4 border-l-yellow-400/40">
                                                    {/* Sub-header */}
                                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                                                        <h4 className="text-neutral-400 text-sm font-medium flex items-center gap-2">
                                                            <FaUsers className="text-yellow-400/70" />
                                                            Daftar Anggota — <span className="text-white">{dept.namaDepartemen}</span>
                                                        </h4>
                                                        <button
                                                            onClick={() => handleOpenAnggotaModal(dept.id)}
                                                            className="flex items-center gap-1.5 text-[#ffd700] text-xs font-semibold border border-yellow-400/50 px-3 py-1.5 hover:bg-yellow-400/10 transition-colors"
                                                        >
                                                            <FaPlus className="text-[10px]" />
                                                            Tambah Anggota
                                                        </button>
                                                    </div>

                                                    {/* Sub-tabel anggota */}
                                                    {dept.anggota && dept.anggota.length > 0 ? (
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
                                                                    {dept.anggota.map((anggota, aIdx) => (
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
                                                                                        {/* Jabatan tampil di mobile */}
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
                                                            Belum ada anggota di departemen ini.
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
            {!isLoading && departemenList.length > 0 && (
                <p className="text-neutral-600 text-xs mt-3">
                    Total <span className="text-neutral-400 font-medium">{departemenList.length}</span> departemen
                    · <span className="text-neutral-400 font-medium">
                        {departemenList.reduce((acc, d) => acc + (d.anggota?.length ?? 0), 0)}
                    </span> anggota
                </p>
            )}

            {/* ══════════════════════════════════════
                Modal Tambah / Edit Departemen
            ══════════════════════════════════════ */}
            {isDeptModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        {/* Header modal */}
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg text-white font-bold">
                                {isEditDept ? "Edit Departemen" : "Tambah Departemen"}
                            </h3>
                            <button
                                onClick={() => setIsDeptModalOpen(false)}
                                className="text-neutral-400 hover:text-white transition-colors p-1"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={submitDept} className="flex flex-col gap-4">
                            {/* Foto Bersama */}
                            <div>
                                <label className="block text-sm text-neutral-400 mb-2">
                                    Foto Bersama Departemen
                                    <span className="text-neutral-600 ml-1">(opsional)</span>
                                </label>
                                {/* Preview */}
                                <div
                                    className="w-full h-40 bg-neutral-800 border-2 border-dashed border-neutral-700 hover:border-yellow-400/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden mb-2 relative group"
                                    onClick={() => deptImgRef.current?.click()}
                                >
                                    {deptImgPreview ? (
                                        <>
                                            <img
                                                src={deptImgPreview}
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
                                    ref={deptImgRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleDeptImgChange}
                                    className="hidden"
                                />
                                {/* Tombol hapus preview */}
                                {deptImgPreview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDeptImgFile(null);
                                            setDeptImgPreview(null);
                                            if (deptImgRef.current) deptImgRef.current.value = "";
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
                                    value={deptForm.periodeId || ""}
                                    onChange={(e) => setDeptForm({ ...deptForm, periodeId: Number(e.target.value) })}
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

                            {/* Nama Departemen */}
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Nama Departemen</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="contoh: Departemen Hubungan Masyarakat"
                                    value={deptForm.namaDepartemen}
                                    onChange={(e) => setDeptForm({ ...deptForm, namaDepartemen: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-yellow-400"
                                />
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Deskripsi</label>
                                <textarea
                                    placeholder="Deskripsi singkat departemen..."
                                    value={deptForm.deskripsi}
                                    onChange={(e) => setDeptForm({ ...deptForm, deskripsi: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-yellow-400 resize-none"
                                    rows={3}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2 pt-4 border-t border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setIsDeptModalOpen(false)}
                                    disabled={isDeptSaving}
                                    className="px-4 py-2 border border-neutral-700 text-neutral-300 text-sm hover:border-neutral-500 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isDeptSaving}
                                    className="px-4 py-2 bg-yellow-400 text-black font-semibold text-sm hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isDeptSaving ? (
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
                Modal Tambah Anggota
            ══════════════════════════════════════ */}
            {isAnggotaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg text-white font-bold">Tambah Anggota</h3>
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
                                    placeholder="contoh: Ketua Divisi / Anggota"
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

export default DepartemenPage;