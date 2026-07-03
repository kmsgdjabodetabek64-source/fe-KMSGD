import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePaginatedFilter } from "../../../../hooks/usePaginatedFilter";
import { CONTENT_HEADER, getKegiatan, getKegiatanFilters } from "../services/kegiatanService";
import type { Kegiatan } from "../types/kegiatan.types";
import EventCard from "../components/EventCard";
import SearchBar from "../../../../components/SearchBar";
import { Pagination } from "../../../../components/Pagination";
import Header from "../../../../components/Header";
import UserLayout from "../../../../layouts/UserLayout";
import RevealItem from "@/components/RevealItem";


const ITEMS_PER_PAGE = 6;
const EMPTY_KEGIATAN: Kegiatan[] = [];

export default function KegiatanPage() {
    const kegiatanQuery = useQuery({
        queryKey: ["kegiatan-list"],
        queryFn: ({ signal }) => getKegiatan(signal),
        staleTime: 5 * 60 * 1000,
    });
    const kegiatanList = kegiatanQuery.data ?? EMPTY_KEGIATAN;
    const kegiatanFilters = useMemo(() => getKegiatanFilters(kegiatanList), [kegiatanList]);
    const filterKegiatan = useCallback(
        (item: Kegiatan, filter: string) => item.category === filter.toUpperCase(),
        []
    );
    const searchKegiatan = useCallback(
        (item: Kegiatan, q: string) =>
            item.title.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            item.location.toLowerCase().includes(q),
        []
    );

    const {
        paginatedList,
        filteredList,
        page,
        totalPages,
        activeFilter,
        searchQuery,
        handleFilterChange,
        handleSearchChange,
        setPage,
    } = usePaginatedFilter<Kegiatan>({
        data: kegiatanList,
        itemsPerPage: ITEMS_PER_PAGE,
        filterFn: filterKegiatan,
        searchFn: searchKegiatan,
    });

    return (
        <UserLayout>
            <Header judul={CONTENT_HEADER.judul} judul2={CONTENT_HEADER.judul2} deskripsi={CONTENT_HEADER.deskripsi} />
            <SearchBar
                filters={kegiatanFilters}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                onSearchChange={handleSearchChange}
                placeholder="Cari kegiatan..."
            />

            {kegiatanQuery.isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-[#999077] text-lg mb-2">Memuat kegiatan...</p>
                </div>
            ) : kegiatanQuery.isError ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-[#999077] text-lg mb-2">Gagal memuat data kegiatan.</p>
                    <p className="text-[#555] text-sm">Silakan coba beberapa saat lagi.</p>
                </div>
            ) : paginatedList.length > 0 ? (
                <RevealItem animation="animate-fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-6">
                        {paginatedList.map((ev) => (
                                <EventCard event={ev} />
                        ))}
                    </div>
                </RevealItem>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <p className="text-[#999077] text-lg mb-2">Tidak ada hasil</p>
                    <p className="text-[#555] text-sm">
                        {searchQuery
                            ? `Tidak ditemukan hasil untuk "${searchQuery}".`
                            : `Tidak ada kegiatan untuk kategori "${activeFilter}".`}
                    </p>
                </div>
            )}

            {totalPages > 1 && (
                <section className="mt-10 flex flex-col items-center gap-3">
                    <p className="text-sm text-[#999077]">
                        Menampilkan{" "}
                        <span className="text-[#e5e2e1]">
                            {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filteredList.length)}
                        </span>{" "}
                        dari{" "}
                        <span className="text-[#e5e2e1]">{filteredList.length}</span>{" "}
                        kegiatan
                    </p>
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        siblingCount={1}
                    />
                </section>
            )}

        </UserLayout>
    );
}
