import { useState, useEffect } from "react";
import type { Galeri, CreateGaleriPayload } from "../galeriType";
import { getKegiatanAdmin } from "../../service/kegiatanService";
import type { Kegiatan } from "../../kegiatan/kegiatanTypes";

interface Props {
    open: boolean;
    editing: Galeri | null;
    onClose: () => void;
    onSubmit: (payload: CreateGaleriPayload) => Promise<void>;
}

const GaleriFormModal = ({ open, editing, onClose, onSubmit }: Props) => {
    if (!open) return null;

    return (
        <GaleriFormModalContent
            key={editing?.id ?? "create"}
            editing={editing}
            onClose={onClose}
            onSubmit={onSubmit}
        />
    );
};

type ContentProps = Omit<Props, "open">;

const GaleriFormModalContent = ({ editing, onClose, onSubmit }: ContentProps) => {
    const [judul, setJudul] = useState(editing?.judul ?? "");
    const [kegiatanId, setKegiatanId] = useState(editing?.kegiatanId ? String(editing.kegiatanId) : "");
    const [isPublished, setIsPublished] = useState(editing?.isPublished ?? true);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(editing?.url ?? null);
    const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchKegiatan = async () => {
            try {
                const items = await getKegiatanAdmin();
                if (isMounted) {
                    setKegiatanList(Array.isArray(items) ? items : []);
                }
            } catch {
                if (isMounted) setKegiatanList([]);
            }
        };

        fetchKegiatan();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!editing && !file) {
            setError("Gambar wajib diunggah.");
            return;
        }

        setLoading(true);
        try {
            await onSubmit({
                judul: judul || undefined,
                tipe: "FOTO",
                kegiatanId: kegiatanId ? Number(kegiatanId) : undefined,
                isPublished,
                file,
            });
            onClose();
        } catch {
            setError("Gagal menyimpan galeri. Periksa kembali data yang diisi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0f0f0f] border border-[#b8982a] p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h3 className="text-[#ffd700] m-0 mb-4 text-base font-bold">
                    {editing ? "Edit Galeri" : "Tambah Galeri"}
                </h3>

                {error && (
                    <div className="bg-[#2a0a0a] border border-[#7a1a1a] text-[#f09595] py-2 px-3 mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Gambar */}
                    <div>
                        <label className="block text-[#a89040] text-xs font-bold uppercase mb-2">
                            Gambar {!editing && "*"}
                        </label>
                        <div
                            className="border border-dashed border-neutral-700 bg-neutral-900 p-4 text-center cursor-pointer hover:border-[#b8982a] transition-colors"
                            onClick={() => document.getElementById("galeriImageInput")?.click()}
                        >
                            {preview ? (
                                <img src={preview} alt="preview" className="max-h-32 max-w-full object-cover mx-auto" />
                            ) : (
                                <p className="text-neutral-600 text-sm">Klik untuk pilih gambar</p>
                            )}
                        </div>
                        <input
                            id="galeriImageInput"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>

                    {/* Judul */}
                    <div>
                        <label className="block text-[#a89040] text-xs font-bold uppercase mb-2">Judul</label>
                        <input
                            type="text"
                            value={judul}
                            onChange={(e) => setJudul(e.target.value)}
                            placeholder="Judul foto (opsional)"
                            className="w-full bg-[#1a1a1a] border border-[#b8982a] text-[#ffd700] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#b8982a] placeholder:text-neutral-600"
                        />
                    </div>

                    {/* Kegiatan */}
                    <div>
                        <label className="block text-[#a89040] text-xs font-bold uppercase mb-2">
                            Kegiatan <span className="text-neutral-600 normal-case font-normal">— opsional</span>
                        </label>
                        <select
                            value={kegiatanId}
                            onChange={(e) => setKegiatanId(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-[#b8982a] text-[#ffd700] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#b8982a]"
                        >
                            <option value="">— Tidak terkait kegiatan —</option>
                            {kegiatanList.map((k) => (
                                <option key={k.id} value={k.id}>{k.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-[#a89040] text-xs font-bold uppercase mb-2">Status</label>
                        <select
                            value={isPublished ? "true" : "false"}
                            onChange={(e) => setIsPublished(e.target.value === "true")}
                            className="w-full bg-[#1a1a1a] border border-[#b8982a] text-[#ffd700] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#b8982a]"
                        >
                            <option value="true">Publik</option>
                            <option value="false">Draft</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-transparent border border-zinc-700 text-zinc-400 py-2 px-5 cursor-pointer text-sm hover:bg-zinc-900 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`py-2 px-5 text-sm font-bold tracking-wider transition-colors ${loading
                                ? "bg-yellow-900 text-yellow-700 cursor-not-allowed"
                                : "bg-[#b8982a] text-black hover:bg-[#b8982a]/90 cursor-pointer"
                                }`}
                        >
                            {loading ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GaleriFormModal;
