import { useState } from "react";
import type { PengumumanTimeline } from "../pengumumanTypes";

interface PengumumanTimelineFieldProps {
    timeline: PengumumanTimeline[];
    onAdd: (agenda: string, tanggal: string) => void;
    onRemove: (index: number) => void;
}

const formatTanggal = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate.includes("T") ? isoDate : `${isoDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) return isoDate;
    const dateStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const timeStr = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
    return `${dateStr}, ${timeStr}`;
};

export default function PengumumanTimelineField({ timeline, onAdd, onRemove }: PengumumanTimelineFieldProps) {
    const [agenda, setAgenda] = useState("");
    const [tanggal, setTanggal] = useState("");

    const handleAdd = () => {
        const trimmedAgenda = agenda.trim();
        const trimmedTanggal = tanggal.trim();

        if (!trimmedAgenda || !trimmedTanggal) {
            alert("Harap isi bagian Agenda dan Tanggal!");
            return;
        }

        onAdd(trimmedAgenda, trimmedTanggal);
        setAgenda("");
        setTanggal("");
    };

    return (
        <div>
            <label className="block text-yellow-600 text-xs font-bold tracking-widest uppercase mb-2">Timeline</label>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2">
                <input
                    type="text"
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                    placeholder="Agenda (cth: Pendaftaran)"
                    className="bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700 placeholder:text-neutral-700"
                />
                <input
                    type="datetime-local"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleAdd();
                        }
                    }}
                    className="bg-neutral-900 border border-neutral-800 text-[#ffd700] px-3 py-2 text-sm outline-none focus:border-yellow-700"
                />
                <button
                    type="button"
                    onClick={handleAdd}
                    className="px-4 py-2 text-sm border border-yellow-700 text-[#ffd700] hover:bg-yellow-700 hover:text-black transition-colors cursor-pointer"
                >
                    Tambah
                </button>
            </div>
            {timeline.length > 0 && (
                <div className="space-y-1.5">
                    {timeline.map((t, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between gap-3 px-3 py-2 bg-neutral-900 border border-neutral-700 text-sm"
                        >
                            <div className="flex flex-col">
                                <span className="text-[#ffd700]">{t.agenda}</span>
                                <span className="text-neutral-500 text-xs">{formatTanggal(t.tanggal)}</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => onRemove(i)}
                                className="text-red-400 hover:text-red-300 cursor-pointer shrink-0"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}