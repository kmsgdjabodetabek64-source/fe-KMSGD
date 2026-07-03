import { MdTrendingUp } from "react-icons/md";

export type MemberTrend = {
    periode: string;
    total: number;
};

interface TrenAnggotaProps {
    isLoading: boolean;
    memberTrend: MemberTrend[];
    maxTrendValue: number;
}

const formatNumber = (value: number) => new Intl.NumberFormat("id-ID").format(value);

export default function TrenAnggota({ isLoading, memberTrend, maxTrendValue }: TrenAnggotaProps) {
    return (
        <section className="border border-neutral-800 bg-neutral-900 p-3 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                <div>
                    <h2 className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest">
                        Tren Anggota
                    </h2>
                    <p className="text-neutral-500 text-[10px] sm:text-xs mt-1">
                        Berdasarkan BPI dan anggota tercatat.
                    </p>
                </div>
                <MdTrendingUp className="text-[#FACC15] text-xl sm:text-2xl" />
            </div>

            <div className="flex min-h-48 sm:min-h-64 items-end gap-2 sm:gap-4 overflow-x-auto pb-2">
                {isLoading ? (
                    <p className="self-center text-xs sm:text-sm text-neutral-500 w-full text-center">Memuat tren...</p>
                ) : memberTrend.length > 0 ? (
                    memberTrend.map((item) => (
                        <div key={item.periode} className="flex min-w-72px sm:min-w-24 flex-1 flex-col items-center gap-2 sm:gap-3">
                            <div className="flex h-32 sm:h-44 w-full items-end border-b border-neutral-800">
                                <div
                                    className="w-full bg-[#FACC15] transition-all"
                                    style={{
                                        height: `${Math.max((item.total / maxTrendValue) * 100, 8)}%`,
                                    }}
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-white text-xs sm:text-sm font-bold tabular-nums">
                                    {formatNumber(item.total)}
                                </p>
                                <p className="text-neutral-500 text-[9px] sm:text-xs line-clamp-1">
                                    {item.periode}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="self-center text-xs sm:text-sm text-neutral-500 w-full text-center">Belum ada data.</p>
                )}
            </div>
        </section>
    );
}