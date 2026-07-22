import { useRef, useState } from "react";
import type { ChangeEvent, SyntheticEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPeriodeSimple, getBKByPeriode, createBK, updateBK, deleteBK, createAnggotaBK, deleteAnggotaBK } from "@/features/admin/service/kepengurusanService";
import type { BadanKhusus, CreateAnggotaBKDto } from "@/features/admin/kepengurusan/kepengurusanTypes";

interface BKFormState {
  periodeId: number;
  namaBK: string;
  deskripsi: string;
}

const emptyBKForm: BKFormState = { periodeId: 0, namaBK: "", deskripsi: "" };
const emptyAnggotaForm: CreateAnggotaBKDto & { file?: File | null } = {
  bkId: 0,
  nama: "",
  jabatan: "Anggota",
  file: null,
};

export const useBKAdmin = () => {
  const queryClient = useQueryClient();

  // ── Periode filter
  const [manualPeriodeId, setManualPeriodeId] = useState<number | null>(null);

  // ── Expanded row (anggota)
  const [expandedBK, setExpandedBK] = useState<number | null>(null);

  // ── Modal BK
  const [isBKModalOpen, setIsBKModalOpen] = useState(false);
  const [isEditBK, setIsEditBK] = useState(false);
  const [editBKId, setEditBKId] = useState<number | null>(null);
  const [bkForm, setBkForm] = useState<BKFormState>(emptyBKForm);
  const [bkImgFile, setBkImgFile] = useState<File | null>(null);
  const [bkImgPreview, setBkImgPreview] = useState<string | null>(null);
  const [isBKSaving, setIsBKSaving] = useState(false);
  const bkImgRef = useRef<HTMLInputElement>(null);

  // ── Modal Anggota BK
  const [isAnggotaModalOpen, setIsAnggotaModalOpen] = useState(false);
  const [anggotaForm, setAnggotaForm] = useState(emptyAnggotaForm);
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

  const viewPeriodeId = manualPeriodeId ?? periodes.find((p) => p.status === "AKTIF")?.id ?? periodes[0]?.id ?? null;

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
    setExpandedBK((prev) => (prev === id ? null : id));
  };

  // ── BK HANDLERS
  const openBKModal = (bk?: BadanKhusus) => {
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
      setBkForm({ ...emptyBKForm, periodeId: viewPeriodeId || periodes[0]?.id || 0 });
      setBkImgPreview(null);
    }
    setBkImgFile(null);
    setIsBKModalOpen(true);
  };

  const closeBKModal = () => setIsBKModalOpen(false);

  const handleBkImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBkImgFile(file);
    setBkImgPreview(URL.createObjectURL(file));
  };

  const removeBkImg = () => {
    setBkImgFile(null);
    setBkImgPreview(null);
    if (bkImgRef.current) bkImgRef.current.value = "";
  };

  const submitBK = async (e: SyntheticEvent<HTMLFormElement>) => {
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
      closeBKModal();
      refetchCurrentView();
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan badan khusus");
    } finally {
      setIsBKSaving(false);
    }
  };

  // ── ANGGOTA HANDLERS
  const openAnggotaModal = (bkId: number) => {
    setAnggotaForm({ ...emptyAnggotaForm, bkId });
    setIsAnggotaModalOpen(true);
  };

  const closeAnggotaModal = () => setIsAnggotaModalOpen(false);

  const submitAnggota = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("bkId", String(anggotaForm.bkId));
      fd.append("nama", anggotaForm.nama);
      fd.append("jabatan", anggotaForm.jabatan);
      if (anggotaForm.file) fd.append("image", anggotaForm.file);
      await createAnggotaBK(fd);
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
  const requestDeleteBK = (id: number) => {
    setDeleteTarget({ type: "bk", id });
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
      if (deleteTarget.type === "bk") {
        await deleteBK(deleteTarget.id);
      } else {
        await deleteAnggotaBK(deleteTarget.id);
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

    bkList,
    isLoading,

    expandedBK,
    toggleBK,

    bkModal: {
      isOpen: isBKModalOpen,
      isEdit: isEditBK,
      form: bkForm,
      setForm: setBkForm,
      imgPreview: bkImgPreview,
      imgRef: bkImgRef,
      isSaving: isBKSaving,
      open: openBKModal,
      close: closeBKModal,
      handleImgChange: handleBkImgChange,
      removeImg: removeBkImg,
      submit: submitBK,
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
      requestDeleteBK,
      requestDeleteAnggota,
      confirm: confirmDeleteAction,
      cancel: cancelDelete,
    },
  };
};
