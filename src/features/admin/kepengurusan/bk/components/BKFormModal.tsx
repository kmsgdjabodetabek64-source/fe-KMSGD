import { FaTimes, FaImage } from "react-icons/fa";
import type { Dispatch, SetStateAction, ChangeEvent, SyntheticEvent, RefObject } from "react";
import type { PeriodeOrganisasi } from "../../kepengurusanTypes";

interface BKFormState {
    periodeId: number;
    namaBK: string;
    deskripsi: string;
}

interface BKModalSlice {
    isOpen: boolean;
    isEdit: boolean;
    form: BKFormState;
    setForm: Dispatch<SetStateAction<BKFormState>>;
    imgPreview: string | null;
    imgRef: RefObject<HTMLInputElement | null>;
    isSaving: boolean;
    close: () => void;
    handleImgChange: (e: ChangeEvent<HTMLInputElement>) => void;
    removeImg: () => void;
    submit: (e: SyntheticEvent<HTMLFormElement>) => void;
}

type PeriodeOption = Pick<PeriodeOrganisasi, "id" | "periode" | "status">;

interface Props {
    modal: BKModalSlice;
    periodes: PeriodeOption[];
}

const BKFormModal = ({ modal, periodes }: Props) => {
    if (!modal.isOpen) return null;

    const { form, setForm, imgPreview, imgRef, isSaving, isEdit, close, handleImgChange, removeImg, submit } = modal;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg text-white font-bold">
                        {isEdit ? "Edit Badan Khusus" : "Tambah Badan Khusus"}
                    </h3>
                    <button onClick={close} className="text-neutral-400 hover:text-white transition-colors p-1">
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col gap-4">
                    {/* Foto Bersama */}
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">
                            Foto Bersama Badan Khusus
                            <span className="text-neutral-600 ml-1">(opsional)</span>
                        </label>
                        <div
                            className="w-full h-40 bg-neutral-800 border-2 border-dashed border-neutral-700 hover:border-yellow-400/50 flex items-center justify-center cursor-pointer transition-colors overflow-hidden mb-2 relative group"
                            onClick={() => imgRef.current?.click()}
                        >
                            {imgPreview ? (
                                <>
                                    <img src={imgPreview} alt="preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white text-xs font-medium flex items-center gap-1">
                                            <FaImage /> Ganti foto
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <FaImage className="text-neutral-600 text-2xl mx-auto mb-1" />
                                    <p className="text-neutral-500 text-xs">Klik untuk upload foto</p>
                                </div>
                            )}
                        </div>
                        <input ref={imgRef} type="file" accept="image/*" onChange={handleImgChange} className="hidden" />
                        {imgPreview && (
                            <button
                                type="button"
                                onClick={removeImg}
                                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                            >
                                <FaTimes className="text-[10px]" /> Hapus foto
                            </button>
                        )}
                    </div>

                    {/* Periode */}
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Periode</label>
                        <select
                            required
                            value={form.periodeId || ""}
                            onChange={(e) => setForm({ ...form, periodeId: Number(e.target.value) })}
                            className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-400"
                        >
                            <option value="" disabled>Pilih Periode</option>
                            {periodes.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.periode} — {p.status}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Nama BK */}
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Nama Badan Khusus</label>
                        <input
                            type="text"
                            required
                            placeholder="contoh: Badan Khusus Media & Komunikasi"
                            value={form.namaBK}
                            onChange={(e) => setForm({ ...form, namaBK: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-yellow-400"
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Deskripsi</label>
                        <textarea
                            placeholder="Deskripsi singkat badan khusus..."
                            value={form.deskripsi}
                            onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-yellow-400 resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-2 pt-4 border-t border-neutral-800">
                        <button
                            type="button"
                            onClick={close}
                            disabled={isSaving}
                            className="px-4 py-2 border border-neutral-700 text-neutral-300 text-sm hover:border-neutral-500 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 bg-yellow-400 text-black font-semibold text-sm hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    Menyimpan...
                                </>
                            ) : "Simpan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BKFormModal;