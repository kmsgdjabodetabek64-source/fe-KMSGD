import type { KategoriPengumuman } from "../pengumumanTypes";

interface PengumumanTanggalKategoriFieldsProps {
    tanggal: string;
    kategoriId: string;
    kategoriList: KategoriPengumuman[];
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function PengumumanTanggalKategoriFields({
    tanggal,
    kategoriId,
    kategoriList,
    onChange,
}: PengumumanTanggalKategoriFieldsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Tanggal *</label>
                <input
                    type="datetime-local"
                    name="tanggal"
                    value={tanggal}
                    onChange={onChange}
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700"
                />
            </div>
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Kategori *</label>
                <select
                    name="kategoriId"
                    value={kategoriId}
                    onChange={onChange}
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700"
                >
                    <option value="">Pilih kategori</option>
                    {kategoriList.map((k) => (
                        <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}