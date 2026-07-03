import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getKegiatanById, updateKegiatan, getKategori, getDepartemenAktif } from "../../service/kegiatanService";
import { getPeriodeAktif } from "../../service/kepengurusanService";
import type { CreateKegiatanPayload, Departemen, KategoriKegiatan } from "../kegiatanTypes";

const KegiatanEditForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [kategoriList, setKategoriList] = useState<KategoriKegiatan[]>([]);
    const [departemenList, setDepartemenList] = useState<Departemen[]>([]);

    const [speakers, setSpeakers] = useState<string[]>([]);
    const [speakerInput, setSpeakerInput] = useState("");

    const [form, setForm] = useState({
        periodeId: 0,
        startTime: "",
        endTime: "",
        kategoriId: "",
        title: "",
        desc: "",
        location: "",
        price: "",
        registrationLink: "",
        departemenId: "",
        organizerCustom: "",
        contactPerson: "",
        isPublished: true,
    });

    useEffect(() => {
        (async () => {
            try {
                if (!id) return;

                const [existingData, periode, kategori, departemen] = await Promise.all([
                    getKegiatanById(Number(id)),
                    getPeriodeAktif(),
                    getKategori(),
                    getDepartemenAktif(),
                ]);

                if (periode) {
                    setForm((prev) => ({ ...prev, periodeId: periode.id }));
                }
                setKategoriList(kategori);
                setDepartemenList(departemen);

                setForm(prev => ({
                    ...prev,
                    startTime: new Date(existingData.startTime).toISOString().slice(0, 16),
                    endTime: existingData.endTime ? new Date(existingData.endTime).toISOString().slice(0, 16) : "",
                    kategoriId: String(existingData.kategoriId),
                    title: existingData.title,
                    desc: existingData.desc,
                    location: existingData.location,
                    price: existingData.price.toString(),
                    registrationLink: existingData.registrationLink || "",
                    departemenId: existingData.departemenId ? String(existingData.departemenId) : "",
                    organizerCustom: existingData.organizerCustom || "",
                    contactPerson: existingData.contactPerson || "",
                    isPublished: existingData.isPublished,
                }));

                if (existingData.speakers) {
                    setSpeakers(existingData.speakers);
                }

                if (existingData.image) {
                    setImagePreview(existingData.image);
                }

                setFetching(false);
            } catch (err) {
                console.error("Gagal memuat data:", err);
                setError("Gagal memuat data kegiatan.");
                setFetching(false);
            }
        })();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
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
            ...(form.contactPerson && { contactPerson: form.contactPerson }),
            isPublished: form.isPublished,
            speakers,
            file: imageFile,
        };

        setLoading(true);
        try {
            await updateKegiatan(Number(id), payload);
            setSuccess(true);
            setTimeout(() => { navigate("/admin/kegiatan"); }, 1200);
        } catch {
            setError("Gagal memperbarui kegiatan. Periksa kembali data yang diisi.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-[#ffd700]">Memuat data...</div>;
    }

    return (
        <section className="p-8 font-sans text-[#ffd700] max-w-3xl">
            <div className="mb-8 pb-4 border-b border-yellow-700">
                <button onClick={() => navigate("/admin/kegiatan")} className="bg-transparent border-none text-yellow-600 text-xs tracking-widest hover:text-[#ffd700] transition-colors cursor-pointer p-0">
                    ← Kembali
                </button>
                <h1 className="text-3xl font-bold text-[#ffd700] mt-2 mb-1">Edit Kegiatan</h1>
                <p className="text-yellow-600 text-sm">Perbarui informasi kegiatan</p>
            </div>

            {error && (
                <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 text-sm mb-5">{error}</div>
            )}
            {success && (
                <div className="bg-green-950 border border-green-800 text-green-400 px-4 py-3 text-sm mb-5">
                    Kegiatan berhasil diperbarui! Mengalihkan...
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
                    {imageFile && (
                        <div className="mt-1.5 flex items-center justify-between">
                            <p className="text-xs text-neutral-600 truncate">{imageFile.name}</p>
                            <button
                                type="button"
                                onClick={() => { setImageFile(null); setImagePreview(null); }}
                                className="text-xs text-red-400 hover:text-red-300 ml-2 shrink-0"
                            >
                                Hapus
                            </button>
                        </div>
                    )}
                </div>

                {/* Kategori */}
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

                {/* Jam Mulai + Jam Selesai */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Jam Mulai *</label>
                        <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} required
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700" />
                    </div>
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Jam Selesai</label>
                        <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange}
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700" />
                    </div>
                </div>

                {/* Judul */}
                <div>
                    <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Judul *</label>
                    <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Judul kegiatan" required
                        className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700" />
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Deskripsi *</label>
                    <textarea name="desc" value={form.desc} onChange={handleChange} placeholder="Deskripsi kegiatan..." required rows={4}
                        className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700 resize-y" />
                </div>

                {/* Lokasi */}
                <div>
                    <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Lokasi *</label>
                    <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Nama tempat / alamat" required
                        className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700" />
                </div>

                {/* Harga + Link Registrasi */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">
                            Harga (Rp) <span className="text-neutral-600 normal-case font-normal">— 0 = Gratis</span>
                        </label>
                        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0" min={0}
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700" />
                    </div>
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Link Registrasi</label>
                        <input type="url" name="registrationLink" value={form.registrationLink} onChange={handleChange} placeholder="https://..."
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700" />
                    </div>
                </div>

                {/* Departemen + Contact Person */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">
                            Departemen <span className="text-neutral-600 normal-case font-normal">— periode aktif</span>
                        </label>
                        <select name="departemenId" value={form.departemenId} onChange={handleChange}
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700">
                            <option value="">— Tidak ada / Umum —</option>
                            {departemenList.map((d) => (
                                <option key={d.id} value={d.id}>{d.namaDepartemen}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Contact Person</label>
                        <input type="text" name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="081234567890"
                            className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700" />
                    </div>
                </div>

                {/* Organizer Custom */}
                <div>
                    <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">
                        Penyelenggara Custom <span className="text-neutral-600 normal-case font-normal">— jika bukan departemen internal</span>
                    </label>
                    <input type="text" name="organizerCustom" value={form.organizerCustom} onChange={handleChange} placeholder="Nama penyelenggara lain"
                        className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700" />
                </div>

                {/* Status */}
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

                {/* Speakers */}
                <div>
                    <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Speakers</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={speakerInput}
                            onChange={(e) => setSpeakerInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSpeaker(); } }}
                            placeholder="Nama speaker"
                            className="flex-1 bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                        />
                        <button type="button" onClick={addSpeaker}
                            className="px-4 py-2 text-sm border border-yellow-700 text-[#ffd700] hover:bg-yellow-700 hover:text-black transition-colors cursor-pointer">
                            Tambah
                        </button>
                    </div>
                    {speakers.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {speakers.map((s, i) => (
                                <span key={i} className="flex items-center gap-1.5 px-3 py-1 text-xs bg-neutral-900 border border-neutral-700 text-[#ffd700]">
                                    {s}
                                    <button type="button" onClick={() => removeSpeaker(i)} className="text-red-400 hover:text-red-300 cursor-pointer">×</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4 border-t border-neutral-900">
                    <button type="button" onClick={() => navigate("/admin/kegiatan")}
                        className="border border-neutral-700 bg-transparent text-neutral-500 px-6 py-2.5 text-sm hover:border-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer">
                        Batal
                    </button>
                    <button type="submit" disabled={loading || !form.periodeId}
                        className={`px-8 py-2.5 text-sm font-bold tracking-widest transition-colors border-none ${loading || !form.periodeId
                            ? "bg-yellow-900 text-yellow-700 cursor-not-allowed"
                            : "bg-yellow-600 text-black cursor-pointer hover:bg-yellow-500"
                            }`}>
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default KegiatanEditForm;