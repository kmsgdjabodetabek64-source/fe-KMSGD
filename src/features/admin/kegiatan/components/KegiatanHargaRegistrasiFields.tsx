interface KegiatanHargaRegistrasiFieldsProps {
    priceDisplay: string;
    registrationLink: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function KegiatanHargaRegistrasiFields({
    priceDisplay,
    registrationLink,
    onChange,
}: KegiatanHargaRegistrasiFieldsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">
                    Harga (Rp) <span className="text-neutral-600 normal-case font-normal">— 0 = Gratis</span>
                </label>
                <input
                    type="text"
                    name="price"
                    value={priceDisplay}
                    onChange={onChange}
                    placeholder="0"
                    inputMode="numeric"
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                />
            </div>
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Link Registrasi</label>
                <input
                    type="url"
                    name="registrationLink"
                    value={registrationLink}
                    onChange={onChange}
                    placeholder="https://..."
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                />
            </div>
        </div>
    );
}