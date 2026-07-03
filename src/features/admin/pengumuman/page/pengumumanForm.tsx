import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    createPengumuman,
    updatePengumuman,
    getPengumumanById,
    getKategoriPengumuman,
} from "../../service/pengumumanService";
import type { KategoriPengumuman, CreatePengumumanPayload, PengumumanTimeline } from "../pengumumanTypes";

const PengumumanForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [removeImage, setRemoveImage] = useState(false);

    const [kategoriList, setKategoriList] = useState<KategoriPengumuman[]>([]);

    const [persyaratan, setPersyaratan] = useState<string[]>([]);
    const [persyaratanInput, setPersyaratanInput] = useState("");

    const [berkas, setBerkas] = useState<string[]>([]);
    const [berkasInput, setBerkasInput] = useState("");

    const [timeline, setTimeline] = useState<PengumumanTimeline[]>([]);
    const [timelineAgenda, setTimelineAgenda] = useState("");
    const [timelineTanggal, setTimelineTanggal] = useState("");

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
                    setTimeline(
                        (data.timeline ?? []).map((t) => ({ agenda: t.agenda, tanggal: t.tanggal }))
                    );
                    if (data.image) {
                        setImagePreview(data.image);
                    }
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

    // Contact person hanya boleh berisi angka
    const handleContactPersonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
        setForm((prev) => ({ ...prev, contactPerson: onlyNumbers }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setRemoveImage(false);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (isEdit) setRemoveImage(true);
    };

    // Persyaratan
    const addPersyaratan = () => {
        const val = persyaratanInput.trim();
        if (!val) return;
        setPersyaratan((prev) => [...prev, val]);
        setPersyaratanInput("");
    };
    const removePersyaratan = (index: number) => {
        setPersyaratan((prev) => prev.filter((_, i) => i !== index));
    };

    // Berkas
    const addBerkas = () => {
        const val = berkasInput.trim();
        if (!val) return;
        setBerkas((prev) => [...prev, val]);
        setBerkasInput("");
    };
    const removeBerkas = (index: number) => {
        setBerkas((prev) => prev.filter((_, i) => i !== index));
    };

    // Timeline
    const addTimeline = () => {
        const agenda = timelineAgenda.trim();
        const tanggal = timelineTanggal.trim();

        if (!agenda || !tanggal) {
            alert("Harap isi bagian Agenda dan Tanggal!"); // Notifikasi ditambahkan
            return;
        }

        setTimeline((prev) => [...prev, { agenda, tanggal }]);
        setTimelineAgenda("");
        setTimelineTanggal("");
    };
    const removeTimeline = (index: number) => {
        setTimeline((prev) => prev.filter((_, i) => i !== index));
    };

    // Format datetime ISO jadi "DD Bulan YYYY, HH.mm" untuk ditampilkan di daftar timeline
    const formatTanggal = (isoDate: string) => {
        if (!isoDate) return "";
        const date = new Date(isoDate.includes("T") ? isoDate : `${isoDate}T00:00:00`);
        if (Number.isNaN(date.getTime())) return isoDate;
        const dateStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
        const timeStr = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
        return `${dateStr}, ${timeStr}`;
    };

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
                await updatePengumuman(Number(id), { ...payload, removeImage });
            } else {
                await createPengumuman(payload);
            }
            setSuccess(true);
            setTimeout(() => { navigate("/admin/pengumuman"); }, 1200);
        } catch (err: unknown) {
            const errorObj = err as Record<string, Record<string, unknown>>;
            console.error("Save error:", errorObj.response?.data);
            setError(`Gagal ${isEdit ? "memperbarui" : "menyimpan"} pengumuman. Periksa kembali data yang diisi.`);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <section className="p-8 font-sans text-[#ffd700] max-w-3xl">
                <p className="text-yellow-600 text-sm">Memuat data...</p>
            </section>
        );
    }

    return (
        <section className="p-8 font-sans text-[#ffd700] max-w-3xl">
            <div className="mb-8 pb-4 border-b border-yellow-700">
                <a href="/admin/pengumuman" className="text-yellow-600 text-xs tracking-widest hover:text-[#ffd700] transition-colors">
                    ← Kembali
                </a>
                <h1 className="text-3xl font-bold text-[#ffd700] mt-2 mb-1">
                    {isEdit ? "Edit Pengumuman" : "Tambah Pengumuman"}
                </h1>
                <p className="text-yellow-600 text-sm">
                    {isEdit ? "Perbarui data pengumuman di bawah ini" : "Isi form berikut untuk menambah pengumuman baru"}
                </p>
            </div>

            {error && (
                <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 text-sm mb-5">{error}</div>
            )}
            {success && (
                <div className="bg-green-950 border border-green-800 text-green-400 px-4 py-3 text-sm mb-5">
                    Pengumuman berhasil {isEdit ? "diperbarui" : "disimpan"}! Mengalihkan...
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Gambar */}
                <div>
                    <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Gambar</label>
                    <div
                        className="border border-dashed border-neutral-700 bg-neutral-900 p-6 text-center cursor-pointer relative hover:border-yellow-700 transition-colors"
                        onClick={() => document.getElementById("imageInput")?.click()}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="preview" className="max-h-40 max-w-full object-cover mx-auto" />
                        ) : (
                            <div className="text-neutral-600 text-sm">
                                <p className="mb-1">Klik untuk pilih gambar</p>
                            </div>
                        )}
                    </div>
                    <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    {imagePreview && (
                        <div className="mt-1.5 flex items-center justify-between">
                            <p className="text-xs text-neutral-600 truncate">
                                {imageFile ? imageFile.name : "Gambar saat ini"}
                            </p>
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="text-xs text-red-400 hover:text-red-300 ml-2 shrink-0"
                            >
                                Hapus
                            </button>
                        </div>
                    )}
                </div>

                {/* Tanggal + Kategori */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Tanggal *</label>
                        <input type="datetime-local" name="tanggal" value={form.tanggal} onChange={handleChange} required
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700" />
                    </div>
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Kategori *</label>
                        <select name="kategoriId" value={form.kategoriId} onChange={handleChange} required
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700">
                            <option value="">Pilih kategori</option>
                            {kategoriList.map((k) => (
                                <option key={k.id} value={k.id}>{k.nama}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Judul */}
                <div>
                    <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Judul *</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Judul pengumuman" required
                        className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700" />
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Deskripsi *</label>
                    <textarea name="desc" value={form.desc} onChange={handleChange} placeholder="Deskripsi pengumuman..." required rows={4}
                        className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700 resize-y" />
                </div>

                {/* Author + Contact Person */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Author *</label>
                        <input type="text" name="author" value={form.author} onChange={handleChange} placeholder="Nama penulis / divisi" required
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700" />
                    </div>
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Contact Person</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            name="contactPerson"
                            value={form.contactPerson}
                            onChange={handleContactPersonChange}
                            placeholder="081234567890"
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                        />
                    </div>
                </div>

                {/* Link Pendaftaran + Status */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">
                            Link Pendaftaran <span className="normal-case text-neutral-600">(Opsional)</span>
                        </label>
                        <input type="url" name="linkPendaftaran" value={form.linkPendaftaran} onChange={handleChange} placeholder="https://..."
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700" />
                    </div>
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Status</label>
                        <select
                            value={form.isPublished ? "true" : "false"}
                            onChange={(e) => setForm((prev) => ({ ...prev, isPublished: e.target.value === "true" }))}
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700"
                        >
                            <option value="true">Publik</option>
                            <option value="false">Draft</option>
                        </select>
                    </div>
                </div>

                {/* Penting */}
                <div>
                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input
                            type="checkbox"
                            checked={form.isPenting}
                            onChange={(e) => setForm((prev) => ({ ...prev, isPenting: e.target.checked }))}
                            className="w-4 h-4 accent-yellow-600 cursor-pointer"
                        />
                        <span className="text-sm text-[#ffd700]">Tandai sebagai pengumuman penting</span>
                    </label>
                </div>

                {/* Persyaratan */}
                <div>
                    <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Persyaratan</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={persyaratanInput}
                            onChange={(e) => setPersyaratanInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPersyaratan(); } }}
                            placeholder="Contoh: Fotokopi KTP"
                            className="flex-1 bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                        />
                        <button type="button" onClick={addPersyaratan}
                            className="px-4 py-2 text-sm border border-yellow-700 text-[#ffd700] hover:bg-yellow-700 hover:text-black transition-colors cursor-pointer">
                            Tambah
                        </button>
                    </div>
                    {persyaratan.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {persyaratan.map((p, i) => (
                                <span key={i} className="flex items-center gap-1.5 px-3 py-1 text-xs bg-neutral-900 border border-neutral-700 text-[#ffd700]">
                                    {p}
                                    <button type="button" onClick={() => removePersyaratan(i)} className="text-red-400 hover:text-red-300 cursor-pointer">×</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Berkas */}
                <div>
                    <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Berkas</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={berkasInput}
                            onChange={(e) => setBerkasInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBerkas(); } }}
                            placeholder="Contoh: Formulir Pendaftaran.pdf"
                            className="flex-1 bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                        />
                        <button type="button" onClick={addBerkas}
                            className="px-4 py-2 text-sm border border-yellow-700 text-[#ffd700] hover:bg-yellow-700 hover:text-black transition-colors cursor-pointer">
                            Tambah
                        </button>
                    </div>
                    {berkas.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {berkas.map((b, i) => (
                                <span key={i} className="flex items-center gap-1.5 px-3 py-1 text-xs bg-neutral-900 border border-neutral-700 text-[#ffd700]">
                                    {b}
                                    <button type="button" onClick={() => removeBerkas(i)} className="text-red-400 hover:text-red-300 cursor-pointer">×</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Timeline */}
                <div>
                    <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Timeline</label>
                    <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2">
                        <input
                            type="text"
                            value={timelineAgenda}
                            onChange={(e) => setTimelineAgenda(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTimeline(); } }}
                            placeholder="Agenda (cth: Pendaftaran)"
                            className="bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                        />
                        <input
                            type="datetime-local"
                            value={timelineTanggal}
                            onChange={(e) => setTimelineTanggal(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTimeline(); } }}
                            className="bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700"
                        />
                        <button type="button" onClick={addTimeline}
                            className="px-4 py-2 text-sm border border-yellow-700 text-[#ffd700] hover:bg-yellow-700 hover:text-black transition-colors cursor-pointer">
                            Tambah
                        </button>
                    </div>
                    {timeline.length > 0 && (
                        <div className="space-y-1.5">
                            {timeline.map((t, i) => (
                                <div key={i} className="flex items-center justify-between gap-3 px-3 py-2 bg-neutral-900 border border-neutral-700 text-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[#ffd700]">{t.agenda}</span>
                                        <span className="text-neutral-500 text-xs">{formatTanggal(t.tanggal)}</span>
                                    </div>
                                    <button type="button" onClick={() => removeTimeline(i)} className="text-red-400 hover:text-red-300 cursor-pointer shrink-0">×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4 border-t border-neutral-900">
                    <a href="/admin/pengumuman"
                        className="border border-neutral-700 text-neutral-500 px-6 py-2.5 text-sm hover:border-neutral-500 hover:text-neutral-300 transition-colors">
                        Batal
                    </a>
                    <button type="submit" disabled={loading}
                        className={`px-8 py-2.5 text-sm font-bold tracking-widest transition-colors ${loading
                            ? "bg-yellow-900 text-yellow-700 cursor-not-allowed"
                            : "bg-yellow-600 text-black cursor-pointer hover:bg-yellow-500"
                            }`}>
                        {loading ? (isEdit ? "Memperbarui..." : "Menyimpan...") : (isEdit ? "Update Pengumuman" : "Simpan Pengumuman")}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default PengumumanForm;