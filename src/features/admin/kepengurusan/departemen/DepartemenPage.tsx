import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaSitemap, FaPlus, FaPen, FaChevronDown, FaChevronUp, FaTimes, FaTrash } from "react-icons/fa";
import ConfirmDeleteModal from "../../kegiatan/components/adminKegiatan/ConfirmDeleteModal";
import {
    getPeriodeSimple,
    getPeriodeAktif,
    getDepartemenByPeriode,
    createDepartemen,
    updateDepartemen,
    deleteDepartemen,
    createAnggota,
    deleteAnggota
} from "../../service/kepengurusanService";
import type {
    Departemen,
    CreateDepartemenDto,
    UpdateDepartemenDto,
    CreateAnggotaDto,
} from "../kepengurusanTypes";

const DepartemenPage = () => {
    const queryClient = useQueryClient();

    // Cuma menyimpan pilihan MANUAL user dari dropdown — null berarti "belum override, pakai default"
    const [manualPeriodeId, setManualPeriodeId] = useState<number | null>(null);
    const [expandedDept, setExpandedDept] = useState<number | null>(null);

    // Modal Dept
    const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
    const [isEditDept, setIsEditDept] = useState(false);
    const [editDeptId, setEditDeptId] = useState<number | null>(null);
    const [deptForm, setDeptForm] = useState<CreateDepartemenDto>({
        periodeId: 0,
        namaDepartemen: "",
        deskripsi: ""
    });

    // Modal Anggota
    const [isAnggotaModalOpen, setIsAnggotaModalOpen] = useState(false);
    const [anggotaForm, setAnggotaForm] = useState<CreateAnggotaDto & { file?: File | null }>({
        departemenId: 0,
        nama: "",
        jabatan: "",
        file: null
    });
    const [isUploading, setIsUploading] = useState(false);

    // Confirm Delete
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: "dept" | "anggota"; id: number } | null>(null);

    // ── QUERIES ──────────────────────────────────────────────
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

    // ✅ Derived value — BUKAN state, jadi tidak butuh setState di dalam effect.
    // Prioritas: pilihan manual user > periode aktif > periode pertama dalam list.
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

    // ── DEPARTEMEN HANDLERS ──────────────────────────────────
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
                deskripsi: dept.deskripsi || ""
            });
        } else {
            setIsEditDept(false);
            setEditDeptId(null);
            setDeptForm({
                periodeId: viewPeriodeId || periodes[0]?.id || 0,
                namaDepartemen: "",
                deskripsi: ""
            });
        }
        setIsDeptModalOpen(true);
    };

    const submitDept = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditDept && editDeptId) {
                await updateDepartemen(editDeptId, deptForm as UpdateDepartemenDto);
            } else {
                await createDepartemen(deptForm);
            }
            setIsDeptModalOpen(false);
            refetchCurrentView();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan departemen");
        }
    };

    const handleDeleteDept = (id: number) => {
        setDeleteTarget({ type: "dept", id });
        setConfirmDelete(true);
    };

    // ── ANGGOTA HANDLERS ─────────────────────────────────────
    const handleOpenAnggotaModal = (deptId: number) => {
        setAnggotaForm({
            departemenId: deptId,
            nama: "",
            jabatan: "Anggota",
            file: null
        });
        setIsAnggotaModalOpen(true);
    };

    const submitAnggota = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            const formDataPayload = new FormData();
            formDataPayload.append("departemenId", String(anggotaForm.departemenId));
            formDataPayload.append("nama", anggotaForm.nama);
            formDataPayload.append("jabatan", anggotaForm.jabatan);
            if (anggotaForm.file) {
                formDataPayload.append("image", anggotaForm.file);
            }

            await createAnggota(formDataPayload);
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
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3 text-[#ffd700]">
                    <FaSitemap className="text-xl" />
                    <h2 className="text-xl font-bold">Departemen</h2>
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
                        onClick={() => handleOpenDeptModal()}
                        className="flex justify-center items-center gap-2 border border-yellow-400 text-[#ffd700] px-4 py-2 font-semibold hover:bg-yellow-400 hover:text-black transition-colors w-full sm:w-auto"
                    >
                        <FaPlus />
                        Tambah Dept
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="text-neutral-400 text-center py-8">Loading...</div>
                ) : departemenList.length === 0 ? (
                    <div className="text-neutral-400 text-center py-8 border border-neutral-800">
                        Belum ada departemen untuk periode yang dipilih.
                    </div>
                ) : (
                    departemenList.map((dept) => (
                        <div key={dept.id} className="border border-neutral-800 bg-neutral-900/30">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 border-l-4 border-l-yellow-400 hover:bg-neutral-800/50 transition-colors gap-4 md:gap-0">
                                <div
                                    className="flex items-start md:items-center gap-4 cursor-pointer flex-1"
                                    onClick={() => toggleDept(dept.id)}
                                >
                                    <div className="w-10 h-10 bg-yellow-400/10 text-[#ffd700] flex items-center justify-center shrink-0">
                                        <FaSitemap />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-base">{dept.namaDepartemen}</h3>
                                        <p className="text-neutral-400 text-sm">{dept.deskripsi}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2 md:gap-4 pt-3 md:pt-0 border-t md:border-transparent border-neutral-800">
                                    <span className="border border-neutral-700 bg-neutral-800 px-3 py-1 text-xs text-neutral-300 whitespace-nowrap">
                                        {dept.anggota?.length || 0} Anggota
                                    </span>
                                    <div className="flex items-center gap-1 md:gap-4">
                                        <button onClick={() => handleOpenDeptModal(dept)} className="text-neutral-400 hover:text-white p-2">
                                            <FaPen className="text-sm" />
                                        </button>
                                        <button onClick={() => handleDeleteDept(dept.id)} className="text-neutral-400 hover:text-red-500 p-2">
                                            <FaTrash className="text-sm" />
                                        </button>
                                        <button onClick={() => toggleDept(dept.id)} className="text-neutral-400 p-2">
                                            {expandedDept === dept.id ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {expandedDept === dept.id && (
                                <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
                                        <h4 className="text-neutral-400 text-sm font-medium">Daftar Anggota Departemen</h4>
                                        <button
                                            onClick={() => handleOpenAnggotaModal(dept.id)}
                                            className="flex items-center gap-1 text-[#ffd700] text-sm font-semibold hover:text-yellow-300 w-full sm:w-auto"
                                        >
                                            <FaPlus className="text-xs" />
                                            Tambah Anggota
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {dept.anggota && dept.anggota.length > 0 ? (
                                            dept.anggota.map((anggota) => (
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
                                                            <p className="text-white font-medium text-sm truncate">
                                                                {anggota.nama}
                                                            </p>
                                                            {anggota.jabatan.toLowerCase() !== 'anggota' && (
                                                                <p className="text-[#ffd700] text-xs truncate">
                                                                    {anggota.jabatan}
                                                                </p>
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

            {isDeptModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl text-white font-bold mb-4">
                            {isEditDept ? "Edit Departemen" : "Tambah Departemen"}
                        </h3>
                        <form onSubmit={submitDept} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Periode</label>
                                <select
                                    required
                                    value={deptForm.periodeId || ""}
                                    onChange={(e) => setDeptForm({ ...deptForm, periodeId: Number(e.target.value) })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                                >
                                    <option value="" disabled>Pilih Periode</option>
                                    {periodes.map(p => (
                                        <option key={p.id} value={p.id}>{p.periode} - {p.status}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Nama Departemen</label>
                                <input
                                    type="text"
                                    required
                                    value={deptForm.namaDepartemen}
                                    onChange={(e) => setDeptForm({ ...deptForm, namaDepartemen: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-neutral-400 mb-1">Deskripsi</label>
                                <textarea
                                    value={deptForm.deskripsi}
                                    onChange={(e) => setDeptForm({ ...deptForm, deskripsi: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white focus:outline-none focus:border-yellow-400"
                                    rows={3}
                                />
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsDeptModalOpen(false)} className="w-full sm:w-auto px-4 py-2 border border-neutral-700 text-neutral-300 text-center">Batal</button>
                                <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-yellow-400 text-black font-semibold text-center">Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isAnggotaModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl text-white font-bold mb-4">Tambah Anggota</h3>
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

export default DepartemenPage;