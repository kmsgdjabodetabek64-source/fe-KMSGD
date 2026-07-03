import React from "react";

type PaginationItem = number | "dots";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number;
    variant?: "default" | "compact";
}

function getRange(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPaginationItems(
    current: number,
    total: number,
    siblings: number
): PaginationItem[] {
    const totalShown = 2 * siblings + 5;
    if (total <= totalShown) return getRange(1, total);

    const leftSibling = Math.max(current - siblings, 1);
    const rightSibling = Math.min(current + siblings, total);
    const showLeft = leftSibling > 2;
    const showRight = rightSibling < total - 1;

    if (!showLeft && showRight) {
        const leftCount = 3 + 2 * siblings;
        return [...getRange(1, leftCount), "dots", total];
    }
    if (showLeft && !showRight) {
        const rightCount = 3 + 2 * siblings;
        return [1, "dots", ...getRange(total - rightCount + 1, total)];
    }
    return [1, "dots", ...getRange(leftSibling, rightSibling), "dots", total];
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
    variant = "default",
}) => {
    const items = getPaginationItems(currentPage, totalPages, siblingCount);

    const baseBtn =
        "min-w-[36px] h-9 px-2 flex items-center justify-center rounded-lg border border-[#2a2a2a] bg-[#20201f] text-sm text-[#d0c6ab] transition-all duration-150 cursor-pointer select-none hover:border-[#ffd700] hover:text-[#ffd700] hover:bg-[#ffd700]/5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#2a2a2a] disabled:hover:text-[#d0c6ab] disabled:hover:bg-[#20201f]";

    if (variant === "compact") {
        return (
            <div className="flex items-center gap-3">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="h-9 px-4 flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#20201f] text-sm text-[#d0c6ab] transition-all duration-150 hover:border-[#ffd700] hover:text-[#ffd700] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#2a2a2a] disabled:hover:text-[#d0c6ab]"
                >
                    ← Sebelumnya
                </button>

                <span className="text-sm text-[#999077] min-w-22.5 text-center">
                    Hal. {currentPage} / {totalPages}
                </span>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="h-9 px-4 flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#20201f] text-sm text-[#d0c6ab] transition-all duration-150 hover:border-[#ffd700] hover:text-[#ffd700] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#2a2a2a] disabled:hover:text-[#d0c6ab]"
                >
                    Berikutnya →
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1 flex-wrap">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                aria-label="Halaman sebelumnya"
                className={baseBtn}
            >
                ‹
            </button>

            {items.map((item, index) =>
                item === "dots" ? (
                    <span
                        key={`dots-${index}`}
                        className="min-w-9 h-9 flex items-center justify-center text-sm text-[#555]"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        onClick={() => onPageChange(item)}
                        aria-current={item === currentPage ? "page" : undefined}
                        className={
                            item === currentPage
                                ? "min-w-9 h-9 px-2 flex items-center justify-center rounded-lg border border-[#ffd700] bg-[#ffd700] text-sm text-[#131313] font-semibold cursor-default select-none"
                                : baseBtn
                        }
                    >
                        {item}
                    </button>
                )
            )}

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                aria-label="Halaman berikutnya"
                className={baseBtn}
            >
                ›
            </button>
        </div>
    );
};