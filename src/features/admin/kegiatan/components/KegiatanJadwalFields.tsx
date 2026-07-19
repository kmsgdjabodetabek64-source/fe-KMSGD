interface KegiatanJadwalFieldsProps {
    startTime: string;
    endTime: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function KegiatanJadwalFields({ startTime, endTime, onChange }: KegiatanJadwalFieldsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Jam Mulai *</label>
                <input
                    type="datetime-local"
                    name="startTime"
                    value={startTime}
                    onChange={onChange}
                    required
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700"
                />
            </div>
            <div>
                <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Jam Selesai</label>
                <input
                    type="datetime-local"
                    name="endTime"
                    value={endTime}
                    onChange={onChange}
                    className="w-full bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700"
                />
            </div>
        </div>
    );
}