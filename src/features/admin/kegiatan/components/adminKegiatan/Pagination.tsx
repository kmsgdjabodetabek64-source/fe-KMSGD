interface Props {
    page: number;
    totalPages: number;
    perPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
}

const PER_PAGE_OPTIONS = [5, 10, 15];

const Pagination = ({ page, totalPages, perPage, totalItems, onPageChange, onPerPageChange }: Props) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce<(number | "...")[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
            acc.push(p);
            return acc;
        }, []);

    const btnClass = (active: boolean, disabled?: boolean) =>
        `px-2.5 py-1 text-xs border transition-colors ${disabled
            ? "border-zinc-800 text-zinc-600 opacity-40 cursor-not-allowed"
            : active
                ? "bg-[#1a1500] border-[#b8982a] text-[#ffd700] cursor-pointer"
                : "bg-transparent border-[#2a2a2a] text-zinc-400 hover:bg-zinc-800 cursor-pointer"
        }`;

    return (
        <div className="mt-4 flex justify-between items-center flex-wrap gap-4">
            <div className="text-zinc-500 text-[0.8rem]">
                Menampilkan {totalItems === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, totalItems)} dari {totalItems} kegiatan
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[0.8rem] text-zinc-500">
                    <span>Tampilkan</span>
                    {PER_PAGE_OPTIONS.map((n) => (
                        <button key={n} onClick={() => onPerPageChange(n)} className={btnClass(perPage === n)}>
                            {n}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1">
                    <button onClick={() => onPageChange(1)} disabled={page === 1} className={btnClass(false, page === 1)}>«</button>
                    <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className={btnClass(false, page === 1)}>‹</button>

                    {pages.map((p, idx) =>
                        p === "..." ? (
                            <span key={`ellipsis-${idx}`} className="text-zinc-600 px-1.5 py-1 text-xs">…</span>
                        ) : (
                            <button key={p} onClick={() => onPageChange(p)} className={btnClass(page === p)}>
                                {p}
                            </button>
                        )
                    )}

                    <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages || totalPages === 0} className={btnClass(false, page === totalPages || totalPages === 0)}>›</button>
                    <button onClick={() => onPageChange(totalPages)} disabled={page === totalPages || totalPages === 0} className={btnClass(false, page === totalPages || totalPages === 0)}>»</button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;