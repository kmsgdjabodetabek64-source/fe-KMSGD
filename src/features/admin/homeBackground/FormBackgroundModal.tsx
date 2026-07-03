import { useCallback, useState } from "react";
import { FaImage } from "react-icons/fa";
import { updateHomeBackground, createHomeBackground } from "../service/homeBackgroundService";

interface FormBackgroundModalProps {
    editId: number | null;
    isActive: boolean;
    setIsActive: (active: boolean) => void;
    file: File | null;
    setFile: (file: File | null) => void;
    preview: string;
    setPreview: (preview: string) => void;
    onClose: () => void;
    onSuccess: () => Promise<unknown> | void;
}

export default function FormBackgroundModal({
    editId,
    isActive,
    setIsActive,
    file,
    setFile,
    preview,
    setPreview,
    onClose,
    onSuccess,
}: FormBackgroundModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    }, [setFile, setPreview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (editId) {
                await updateHomeBackground(editId, file || undefined, isActive);
            } else {
                if (!file) return alert("Foto wajib diisi untuk data baru.");
                await createHomeBackground(file, isActive);
            }
            await onSuccess();
            onClose();
        } catch (error) {
            console.error("Gagal menyimpan data:", error);
            alert("Gagal menyimpan data");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-[#333] w-full max-w-lg shadow-2xl relative">
                <div className="border-b border-[#222] p-5">
                    <h3 className="text-xl font-bold text-[#ffd700] tracking-wider">
                        {editId ? "Edit Background" : "Tambah Background Baru"}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-zinc-400 text-sm mb-2 uppercase tracking-widest font-bold">
                                FOTO BACKGROUND
                            </label>
                            <div className="border-2 border-dashed border-[#333] bg-[#0a0a0a] hover:border-[#b8982a]/50 transition-colors relative h-48 flex flex-col items-center justify-center cursor-pointer group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    {...(!editId && !file ? { required: true } : {})}
                                />
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="text-center">
                                        <FaImage className="text-4xl text-[#333] mb-3 mx-auto group-hover:text-[#b8982a] transition-colors" />
                                        <p className="text-zinc-500 text-sm">Klik atau seret gambar ke sini</p>
                                        <p className="text-[#333] text-xs mt-1">(Maks 2MB, Rasio 16:9 disarankan)</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border border-[#222] p-4 bg-[#0a0a0a]">
                            <div>
                                <label className="block text-zinc-300 font-medium">Aktif di Beranda?</label>
                                <p className="text-xs text-zinc-600 mt-1">Jika dimatikan, gambar tidak akan ditampilkan di slideshow</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isActive}
                                    onChange={(e) => setIsActive(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-[#222] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b8982a]"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-[#222]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-[#333] text-zinc-400 font-medium hover:bg-[#222] hover:text-white transition-colors uppercase tracking-wider text-sm cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-[#b8982a] text-[#1a1500] font-bold hover:bg-[#ffd700] transition-colors uppercase tracking-wider text-sm disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}