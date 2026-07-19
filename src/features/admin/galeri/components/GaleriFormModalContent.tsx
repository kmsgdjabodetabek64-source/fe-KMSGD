import { useState } from "react";
import type { Galeri, CreateGaleriPayload } from "../galeriType";
import { useKegiatanOptions } from "@/hooks/useGaleriKegiatanOptions";
import GaleriImageUpload from "./GaleriImageUpload";
import GaleriJudulInput from "./GaleriJudulInput";
import GaleriKegiatanSelect from "./GaleriKegiatanSelect";
import GaleriStatusSelect from "./GaleriStatusSelect";
import GaleriFormActions from "./GaleriFormActions";
import GaleriFormError from "./GaleriFormError";

type ContentProps = {
    editing: Galeri | null;
    onClose: () => void;
    onSubmit: (payload: CreateGaleriPayload) => Promise<void>;
};

export default function GaleriFormModalContent({ editing, onClose, onSubmit }: ContentProps) {
    const [judul, setJudul] = useState(editing?.judul ?? "");
    const [kegiatanId, setKegiatanId] = useState(editing?.kegiatanId ? String(editing.kegiatanId) : "");
    const [isPublished, setIsPublished] = useState(editing?.isPublished ?? true);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(editing?.url ?? null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const kegiatanList = useKegiatanOptions();

    const handleFileChange = (f: File) => {
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

                {error && <GaleriFormError message={error} />}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <GaleriImageUpload
                        preview={preview}
                        required={!editing}
                        onFileChange={handleFileChange}
                    />

                    <GaleriJudulInput value={judul} onChange={setJudul} />

                    <GaleriKegiatanSelect
                        value={kegiatanId}
                        options={kegiatanList}
                        onChange={setKegiatanId}
                    />

                    <GaleriStatusSelect isPublished={isPublished} onChange={setIsPublished} />

                    <GaleriFormActions loading={loading} onCancel={onClose} />
                </form>
            </div>
        </div>
    );
}