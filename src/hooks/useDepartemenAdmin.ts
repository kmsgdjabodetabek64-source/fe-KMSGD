import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPeriodeSimple, getPeriodeAktif, getDepartemenByPeriode, createDepartemen, updateDepartemen, deleteDepartemen, createAnggota, deleteAnggota } from "../features/admin/service/kepengurusanService";
import type { Departemen, CreateAnggotaDto } from "../features/admin/kepengurusan/kepengurusanTypes";

interface DeptFormState {
  periodeId: number;
  namaDepartemen: string;
  deskripsi: string;
}

const emptyDeptForm: DeptFormState = { periodeId: 0, namaDepartemen: "", deskripsi: "" };
const emptyAnggotaForm: CreateAnggotaDto & { file?: File | null } = {
  departemenId: 0,
  nama: "",
  jabatan: "Anggota",
  file: null,
};

export const useDepartemenAdmin = () => {
  const queryClient = useQueryClient();

  // ── Periode filter
  const [manualPeriodeId, setManualPeriodeId] = useState<number | null>(null);

  // ── Expanded row (anggota)
  const [expandedDept, setExpandedDept] = useState<number | null>(null);

  // ── Modal Departemen
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isEditDept, setIsEditDept] = useState(false);
  const [editDeptId, setEditDeptId] = useState<number | null>(null);
  const [deptForm, setDeptForm] = useState<DeptFormState>(emptyDeptForm);
  const [deptImgFile, setDeptImgFile] = useState<File | null>(null);
  const [deptImgPreview, setDeptImgPreview] = useState<string | null>(null);
  const [isDeptSaving, setIsDeptSaving] = useState(false);
  const deptImgRef = useRef<HTMLInputElement>(null);

  // ── Modal Anggota
  const [isAnggotaModalOpen, setIsAnggotaModalOpen] = useState(false);
  const [anggotaForm, setAnggotaForm] = useState(emptyAnggotaForm);
  const [isUploading, setIsUploading] = useState(false);

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
    setExpandedDept((prev) => (prev === id ? null : id));
  };

  // ── DEPARTEMEN HANDLERS
  const openDeptModal = (dept?: Departemen) => {
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
      setDeptForm({ ...emptyDeptForm, periodeId: viewPeriodeId || periodes[0]?.id || 0 });
      setDeptImgPreview(null);
    }
    setDeptImgFile(null);
    setIsDeptModalOpen(true);
  };

  const closeDeptModal = () => setIsDeptModalOpen(false);

  const handleDeptImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDeptImgFile(file);
    setDeptImgPreview(URL.createObjectURL(file));
  };

  const removeDeptImg = () => {
    setDeptImgFile(null);
    setDeptImgPreview(null);
    if (deptImgRef.current) deptImgRef.current.value = "";
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
      closeDeptModal();
      refetchCurrentView();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan departemen");
    } finally {
      setIsDeptSaving(false);
    }
  };

  // ── ANGGOTA HANDLERS
  const openAnggotaModal = (deptId: number) => {
    setAnggotaForm({ ...emptyAnggotaForm, departemenId: deptId });
    setIsAnggotaModalOpen(true);
  };

  const closeAnggotaModal = () => setIsAnggotaModalOpen(false);

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
      closeAnggotaModal();
      refetchCurrentView();
    } catch (error) {
      console.error(error);
      alert("Gagal menambahkan anggota");
    } finally {
      setIsUploading(false);
    }
  };

  // ── DELETE HANDLERS
  const requestDeleteDept = (id: number) => {
    setDeleteTarget({ type: "dept", id });
    setConfirmDelete(true);
  };

  const requestDeleteAnggota = (id: number) => {
    setDeleteTarget({ type: "anggota", id });
    setConfirmDelete(true);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
    setDeleteTarget(null);
  };

  const confirmDeleteAction = async () => {
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
      cancelDelete();
    }
  };

  return {
    periodes,
    viewPeriodeId,
    setManualPeriodeId,

    departemenList,
    isLoading,

    expandedDept,
    toggleDept,

    deptModal: {
      isOpen: isDeptModalOpen,
      isEdit: isEditDept,
      form: deptForm,
      setForm: setDeptForm,
      imgPreview: deptImgPreview,
      imgRef: deptImgRef,
      isSaving: isDeptSaving,
      open: openDeptModal,
      close: closeDeptModal,
      handleImgChange: handleDeptImgChange,
      removeImg: removeDeptImg,
      submit: submitDept,
    },

    anggotaModal: {
      isOpen: isAnggotaModalOpen,
      form: anggotaForm,
      setForm: setAnggotaForm,
      isUploading,
      open: openAnggotaModal,
      close: closeAnggotaModal,
      submit: submitAnggota,
    },

    deleteModal: {
      isOpen: confirmDelete,
      requestDeleteDept,
      requestDeleteAnggota,
      confirm: confirmDeleteAction,
      cancel: cancelDelete,
    },
  };
};
