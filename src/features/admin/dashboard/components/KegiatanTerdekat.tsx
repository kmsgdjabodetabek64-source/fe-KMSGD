import { Link } from "react-router-dom";

export type UpcomingEvent = {
    id: number;
    title: string;
    startTime: string;
    location: string;
};

interface KegiatanTerdekatProps {
    isLoading: boolean;
    events: UpcomingEvent[];
}

const formatDate = (value: string) =>
    new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));

export default function KegiatanTerdekat({ isLoading, events }: KegiatanTerdekatProps) {
    return (
        <section className="mt-4 sm:mt-6 border border-neutral-800 bg-neutral-900 p-3 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
                <div>
                    <h2 className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest">
                        Kegiatan Terdekat
                    </h2>
                    <p className="text-neutral-500 text-[10px] sm:text-xs mt-1">
                        Jadwal mendatang dalam sistem.
                    </p>
                </div>
                <Link to="/admin/kegiatan" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FACC15]">
                    Kelola
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {isLoading ? (
                    <p className="text-xs sm:text-sm text-neutral-500">Memuat kegiatan...</p>
                ) : events.length > 0 ? (
                    events.map((item) => (
                        <div key={item.id} className="border border-neutral-800 bg-[#0f0f0f] p-3 sm:p-4">
                            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#FACC15]">
                                {formatDate(item.startTime)}
                            </p>
                            <h3 className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-white line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-neutral-500 line-clamp-1">
                                {item.location}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-xs sm:text-sm text-neutral-500">Belum ada kegiatan mendatang.</p>
                )}
            </div>
        </section>
    );
}