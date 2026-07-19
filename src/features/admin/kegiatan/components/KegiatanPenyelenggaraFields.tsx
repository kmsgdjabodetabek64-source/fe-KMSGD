import type { Departemen } from "../kegiatanTypes";

interface KegiatanPenyelenggaraFieldsProps {
    departemenId: string;
    departemenList: Departemen[];
    organizerCustom: string;
    contactPerson: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function KegiatanPenyelenggaraFields({
    departemenId,
    departemenList,
    organizerCustom,
    contactPerson,
    onChange,
}: KegiatanPenyelenggaraFieldsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">
                    Departemen <span className="text-neutral-600 normal-case font-normal">— periode aktif</span>
                </label>
                <select
                    name="departemenId"
                    value={departemenId}
                    onChange={onChange}
                    disabled={!!organizerCustom}
                    className={`w-full bg-neutral-900 border px-3 py-2 text-sm outline-none focus:border-yellow-700 transition-opacity ${organizerCustom
                        ? "border-neutral-800 text-neutral-600 opacity-40 cursor-not-allowed"
                        : "border-neutral-800 text-[#ffd700]"
                        }`}
                >
                    <option value="">— Tidak ada / Umum —</option>
                    {departemenList.map((d) => (
                        <option key={d.id} value={d.id}>{d.namaDepartemen}</option>
                    ))}
                </select>
                {organizerCustom && (
                    <p className="text-xs text-neutral-600 mt-1">Nonaktif karena penyelenggara custom diisi</p>
                )}
            </div>
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Contact Person</label>
                <input
                    type="text"
                    name="contactPerson"
                    value={contactPerson}
                    onChange={onChange}
                    placeholder="812345678"
                    inputMode="numeric"
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                />
            </div>
        </div>
    );
}