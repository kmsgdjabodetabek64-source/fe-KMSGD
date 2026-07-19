import type { KategoriKegiatan } from "../kegiatanTypes";

interface KegiatanKategoriFieldProps {
    value: string;
    options: KategoriKegiatan[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function KegiatanKategoriField({ value, options, onChange }: KegiatanKategoriFieldProps) {
    return (
        <div>
            <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Kategori *</label>
            <select
                name="kategoriId"
                value={value}
                onChange={onChange}
                required
                className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700"
            >
                <option value="">Pilih kategori</option>
                {options.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
            </select>
        </div>
    );
}