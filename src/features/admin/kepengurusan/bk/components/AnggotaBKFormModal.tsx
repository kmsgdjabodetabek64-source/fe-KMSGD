import { FaTimes } from "react-icons/fa";
import type { Dispatch, SetStateAction, SyntheticEvent } from "react";
import type { CreateAnggotaBKDto } from "../../kepengurusanTypes";

interface AnggotaBKModalSlice {
    isOpen: boolean;
    form: CreateAnggotaBKDto & { file?: File | null };
    setForm: Dispatch<SetStateAction<CreateAnggotaBKDto & { file?: File | null }>>;
    isUploading: boolean;
    close: () => void;
    submit: (e: SyntheticEvent<HTMLFormElement>) => void;
}

interface Props {
    modal: AnggotaBKModalSlice;
}

const AnggotaBKFormModal = ({ modal }: Props) => {
    if (!modal.isOpen) return null;

    const { form, setForm, isUploading, close, submit } = modal;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg text-white font-bold">Tambah Anggota BK</h3>
                    <button onClick={close} className="text-neutral-400 hover:text-white transition-colors p-1">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Nama Lengkap</label>
                        <input
                            type="text"
                            required
                            placeholder="Nama anggota..."
                            value={form.nama}
                            onChange={(e) => setForm({ ...form, nama: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-yellow-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Jabatan</label>
                        <input
                            type="text"
                            required
                            placeholder="contoh: Ketua / Wakil Ketua / Anggota"
                            value={form.jabatan}
                            onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-yellow-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">
                            Foto <span className="text-neutral-600">(opsional)</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })}
                            className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm file:mr-3 file:py-1 file:px-3 file:border-0 file:bg-neutral-700 file:text-neutral-300 hover:file:bg-neutral-600 cursor-pointer"
                        />
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2 pt-4 border-t border-neutral-800">
                        <button
                            type="button"
                            onClick={close}
                            disabled={isUploading}
                            className="px-4 py-2 border border-neutral-700 text-neutral-300 text-sm hover:border-neutral-500 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="px-4 py-2 bg-yellow-400 text-black font-semibold text-sm hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    Mengunggah...
                                </>
                            ) : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnggotaBKFormModal;