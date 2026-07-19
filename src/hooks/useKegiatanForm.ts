import { useState, useEffect, useCallback } from "react";
import { createKegiatan, getKategori, getDepartemenAktif, updateKegiatan, getKegiatanById } from "../features/admin/service/kegiatanService";
import { getPeriodeAktif } from "../features/admin/service/kepengurusanService";
import type { Departemen, KategoriKegiatan, CreateKegiatanPayload } from "../features/admin/kegiatan/kegiatanTypes";
import { useNavigate } from "react-router-dom";

const emptyForm = {
    periodeId: 0,
    startTime: "",
    endTime: "",
    kategoriId: "",
    title: "",
    desc: "",
    location: "",
    price: "",
    priceDisplay: "",
    registrationLink: "",
    departemenId: "",
    organizerCustom: "",
    contactPerson: "",
    isPublished: true,
};

// Hilangkan prefix +62 kalau ada, biar input selalu tampil angka lokal saja
const stripCountryCode = (value: string) => value.replace(/^\+?62/, "");

export function useKegiatanForm(id?: string) {
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [kategoriList, setKategoriList] = useState<KategoriKegiatan[]>([]);
    const [departemenList, setDepartemenList] = useState<Departemen[]>([]);
    const [speakers, setSpeakers] = useState<string[]>([]);
    const [speakerInput, setSpeakerInput] = useState("");

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        (async () => {
            try {
                if (isEditMode && id) {
                    const [existingData, periode, kategori, departemen] = await Promise.all([
                        getKegiatanById(Number(id)),
                        getPeriodeAktif(),
                        getKategori(),
                        getDepartemenAktif(),
                    ]);

                    setKategoriList(kategori);
                    setDepartemenList(departemen);

                    const priceNumeric = existingData.price ? String(existingData.price) : "";

                    setForm({
                        periodeId: periode?.id ?? existingData.periodeId,
                        startTime: new Date(existingData.startTime).toISOString().slice(0, 16),
                        endTime: existingData.endTime
                            ? new Date(existingData.endTime).toISOString().slice(0, 16)
                            : "",
                        kategoriId: String(existingData.kategoriId),
                        title: existingData.title,
                        desc: existingData.desc,
                        location: existingData.location,
                        price: priceNumeric,
                        priceDisplay: priceNumeric ? Number(priceNumeric).toLocaleString("id-ID") : "",
                        registrationLink: existingData.registrationLink || "",
                        departemenId: existingData.departemenId ? String(existingData.departemenId) : "",
                        organizerCustom: existingData.organizerCustom || "",
                        contactPerson: stripCountryCode(existingData.contactPerson || ""),
                        isPublished: existingData.isPublished,
                    });

                    if (existingData.speakers) setSpeakers(existingData.speakers);
                    if (existingData.image) setImagePreview(existingData.image);
                } else {
                    const [periode, kategori, departemen] = await Promise.all([
                        getPeriodeAktif(),
                        getKategori(),
                        getDepartemenAktif(),
                    ]);

                    if (periode) {
                        setForm((prev) => ({ ...prev, periodeId: periode.id }));
                    }
                    setKategoriList(kategori);
                    setDepartemenList(departemen);
                }
            } catch (err) {
                console.error("Gagal memuat data form:", err);
                setError(
                    isEditMode ? "Gagal memuat data kegiatan." : "Gagal memuat data form. Periksa koneksi server."
                );
            } finally {
                if (isEditMode) setFetching(false);
            }
        })();
    }, [id, isEditMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "price") {
            const numeric = value.replace(/\D/g, "");
            const formatted = numeric ? Number(numeric).toLocaleString("id-ID") : "";
            setForm((prev) => ({ ...prev, price: numeric, priceDisplay: formatted }));
            return;
        }

        if (name === "contactPerson") {
            const numericOnly = value.replace(/\D/g, "");
            setForm((prev) => ({ ...prev, contactPerson: numericOnly }));
            return;
        }

        if (name === "departemenId") {
            setForm((prev) => ({ ...prev, departemenId: value, organizerCustom: "" }));
            return;
        }

        if (name === "organizerCustom") {
            setForm((prev) => ({ ...prev, organizerCustom: value, departemenId: value ? "" : prev.departemenId }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (isPublished: boolean) => {
        setForm((prev) => ({ ...prev, isPublished }));
    };

    const handleImageChange = (file: File) => {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const addSpeaker = () => {
        const name = speakerInput.trim();
        if (!name) return;
        setSpeakers((prev) => [...prev, name]);
        setSpeakerInput("");
    };

    const removeSpeaker = (index: number) => {
        setSpeakers((prev) => prev.filter((_, i) => i !== index));
    };

    const goBack = useCallback(() => navigate("/admin/kegiatan"), [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!form.periodeId) {
            setError("Periode aktif tidak ditemukan. Pastikan ada periode yang aktif.");
            return;
        }

        const payload: CreateKegiatanPayload = {
            periodeId: form.periodeId,
            startTime: form.startTime,
            ...(form.endTime && { endTime: form.endTime }),
            kategoriId: Number(form.kategoriId),
            title: form.title,
            desc: form.desc,
            location: form.location,
            ...(form.price && { price: Number(form.price) }),
            ...(form.registrationLink && { registrationLink: form.registrationLink }),
            departemenId: form.departemenId ? Number(form.departemenId) : undefined,
            ...(form.organizerCustom && { organizerCustom: form.organizerCustom }),
            ...(form.contactPerson && { contactPerson: "+62" + form.contactPerson }),
            isPublished: form.isPublished,
            speakers,
            file: imageFile,
        };

        setLoading(true);
        try {
            if (isEditMode && id) {
                await updateKegiatan(Number(id), payload);
            } else {
                await createKegiatan(payload);
            }
            setSuccess(true);
            setTimeout(goBack, 1200);
        } catch (err: unknown) {
            const errorObj = err as Record<string, Record<string, unknown>>;
            console.error("Submit error:", errorObj.response?.data);
            setError(
                isEditMode
                    ? "Gagal memperbarui kegiatan. Periksa kembali data yang diisi."
                    : "Gagal menyimpan kegiatan. Periksa kembali data yang diisi."
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        isEditMode,
        loading,
        fetching,
        error,
        success,
        imagePreview,
        imageFile,
        kategoriList,
        departemenList,
        speakers,
        speakerInput,
        setSpeakerInput,
        form,
        handleChange,
        handleStatusChange,
        handleImageChange,
        removeImage,
        addSpeaker,
        removeSpeaker,
        handleSubmit,
        goBack,
    };
}
