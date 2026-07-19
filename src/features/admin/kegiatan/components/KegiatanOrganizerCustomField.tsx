interface KegiatanOrganizerCustomFieldProps {
    value: string;
    departemenId: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function KegiatanOrganizerCustomField({ value, departemenId, onChange }: KegiatanOrganizerCustomFieldProps) {
    return (
        <div>
            <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">
                Penyelenggara Custom <span className="text-neutral-600 normal-case font-normal">— jika bukan departemen internal</span>
            </label>
            <input
                type="text"
                name="organizerCustom"
                value={value}
                onChange={onChange}
                placeholder="Nama penyelenggara lain"
                disabled={!!departemenId}
                className={`w-full bg-neutral-900 border px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700 transition-opacity ${departemenId
                    ? "border-neutral-800 text-neutral-600 opacity-40 cursor-not-allowed"
                    : "border-neutral-800 text-[#ffd700]"
                    }`}
            />
            {departemenId && (
                <p className="text-xs text-neutral-600 mt-1">Nonaktif karena departemen sudah dipilih</p>
            )}
        </div>
    );
}