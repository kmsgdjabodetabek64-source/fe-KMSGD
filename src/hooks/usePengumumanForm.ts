import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPengumuman, updatePengumuman, getPengumumanById, getKategoriPengumuman } from "../features/admin/service/pengumumanService";
import type { KategoriPengumuman, CreatePengumumanPayload, PengumumanTimeline } from "../features/admin/pengumuman/pengumumanTypes";

export function usePengumumanForm(id?: string) {
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImageFlag, setRemoveImageFlag] = useState(false);

  const [kategoriList, setKategoriList] = useState<KategoriPengumuman[]>([]);

  const [persyaratan, setPersyaratan] = useState<string[]>([]);
  const [berkas, setBerkas] = useState<string[]>([]);

  const [timeline, setTimeline] = useState<PengumumanTimeline[]>([]);

  const [form, setForm] = useState({
    tanggal: "",
    kategoriId: "",
    title: "",
    desc: "",
    author: "",
    isPenting: false,
    isPublished: true,
    linkPendaftaran: "",
    contactPerson: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const kategori = await getKategoriPengumuman();
        setKategoriList(kategori);

        if (isEdit && id) {
          const data = await getPengumumanById(Number(id));
          setForm({
            tanggal: data.tanggal ? data.tanggal.slice(0, 16) : "",
            kategoriId: String(data.kategoriId),
            title: data.title,
            desc: data.desc,
            author: data.author,
            isPenting: data.isPenting,
            isPublished: data.isPublished,
            linkPendaftaran: data.linkPendaftaran ?? "",
            contactPerson: data.contactPerson ?? "",
          });
          setPersyaratan(data.persyaratan ?? []);
          setBerkas(data.berkas ?? []);
          setTimeline((data.timeline ?? []).map((t) => ({ agenda: t.agenda, tanggal: t.tanggal })));
          if (data.image) setImagePreview(data.image);
        }
      } catch (err) {
        console.error("Gagal memuat data form:", err);
        setError("Gagal memuat data form. Periksa koneksi server.");
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactPersonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
    setForm((prev) => ({ ...prev, contactPerson: onlyNumbers }));
  };

  const handleStatusChange = (isPublished: boolean) => {
    setForm((prev) => ({ ...prev, isPublished }));
  };

  const handlePentingChange = (isPenting: boolean) => {
    setForm((prev) => ({ ...prev, isPenting }));
  };

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveImageFlag(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (isEdit) setRemoveImageFlag(true);
  };

  const addTimeline = (agenda: string, tanggal: string) => {
    setTimeline((prev) => [...prev, { agenda, tanggal }]);
  };

  const removeTimeline = (index: number) => {
    setTimeline((prev) => prev.filter((_, i) => i !== index));
  };

  const goBack = () => navigate("/admin/pengumuman");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.kategoriId) {
      setError("Kategori wajib dipilih.");
      return;
    }

    const payload: CreatePengumumanPayload = {
      tanggal: form.tanggal,
      kategoriId: Number(form.kategoriId),
      title: form.title,
      desc: form.desc,
      author: form.author,
      isPenting: form.isPenting,
      isPublished: form.isPublished,
      persyaratan,
      berkas,
      timeline,
      ...(form.linkPendaftaran && { linkPendaftaran: form.linkPendaftaran }),
      ...(form.contactPerson && { contactPerson: form.contactPerson }),
      file: imageFile,
    };

    setLoading(true);
    try {
      if (isEdit && id) {
        await updatePengumuman(Number(id), { ...payload, removeImage: removeImageFlag });
      } else {
        await createPengumuman(payload);
      }
      setSuccess(true);
      setTimeout(goBack, 1200);
    } catch (err: unknown) {
      const errorObj = err as Record<string, Record<string, unknown>>;
      console.error("Save error:", errorObj.response?.data);
      setError(`Gagal ${isEdit ? "memperbarui" : "menyimpan"} pengumuman. Periksa kembali data yang diisi.`);
    } finally {
      setLoading(false);
    }
  };

  return {
    isEdit,
    loading,
    initialLoading,
    error,
    success,
    imagePreview,
    imageFile,
    kategoriList,
    persyaratan,
    setPersyaratan,
    berkas,
    setBerkas,
    timeline,
    form,
    handleChange,
    handleContactPersonChange,
    handleStatusChange,
    handlePentingChange,
    handleImageChange,
    handleRemoveImage,
    addTimeline,
    removeTimeline,
    handleSubmit,
    goBack,
  };
}
