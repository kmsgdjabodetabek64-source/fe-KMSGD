import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../../../../components/SearchBar";
import { CONTENT_HEADER, getPengumuman, getPengumumanFilters } from "../services/pengumumanService";
import { Pagination } from "../../../../components/Pagination";
import PengumumanCard from "../../../../components/PengumumanCard";
import { usePaginatedFilter } from "../../../../hooks/usePaginatedFilter";
import UserLayout from "../../../../layouts/UserLayout";
import Header from "../../../../components/Header";
import type { Pengumuman } from "../types/pengumuman.types";
import RevealItem from "@/components/RevealItem";

const ITEMS_PER_PAGE = 6;
const EMPTY_PENGUMUMAN: Pengumuman[] = [];

const PengumumanPage = () => {
    const pengumumanQuery = useQuery({
        queryKey: ["pengumuman-list"],
        queryFn: ({ signal }) => getPengumuman(signal),
        staleTime: 5 * 60 * 1000,
    });
    const pengumumanList = pengumumanQuery.data ?? EMPTY_PENGUMUMAN;
    const pengumumanFilters = useMemo(() => getPengumumanFilters(pengumumanList), [pengumumanList]);
    const filterPengumuman = useCallback(
        (item: Pengumuman, filter: string) => item.category === filter,
        []
    );
    const searchPengumuman = useCallback(
        (item: Pengumuman, q: string) =>
            item.title.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            item.author.toLowerCase().includes(q),
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
    } = usePaginatedFilter({
        data: pengumumanList,
        itemsPerPage: ITEMS_PER_PAGE,
        filterFn: filterPengumuman,
        searchFn: searchPengumuman,
    });

    return (
        <div className="bg-[#131313] text-[#e5e2e1] font-['Inter'] min-h-screen flex flex-col">
            <UserLayout>
                <Header judul={CONTENT_HEADER.judul} deskripsi={CONTENT_HEADER.deskripsi} />

                <section className="mb-20">
                    <SearchBar
                        filters={pengumumanFilters}
                        activeFilter={activeFilter}
                        onFilterChange={handleFilterChange}
                        onSearchChange={handleSearchChange}
                        placeholder="Cari berita atau pengumuman..."
                    />

                    {pengumumanQuery.isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <p className="text-[#999077] text-lg mb-2">Memuat pengumuman...</p>
                        </div>
                    ) : pengumumanQuery.isError ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <p className="text-[#999077] text-lg mb-2">Gagal memuat data pengumuman.</p>
                            <p className="text-[#555] text-sm">Silakan coba beberapa saat lagi.</p>
                        </div>
                    ) : paginatedList.length > 0 ? (
                        <RevealItem animation="animate-fade-in">
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                                {paginatedList.map((item) => (
                                        <PengumumanCard item={item} />
                                ))}
                            </div>
                        </RevealItem>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <p className="text-[#999077] text-lg mb-2">Tidak ada hasil</p>
                            <p className="text-[#555] text-sm">
                                {searchQuery
                                    ? `Tidak ditemukan hasil untuk "${searchQuery}".`
                                    : `Tidak ada pengumuman untuk kategori "${activeFilter}".`}
                            </p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="mt-10 flex flex-col items-center gap-3">
                            <p className="text-sm text-[#999077]">
                                Menampilkan{" "}
                                <span className="text-[#e5e2e1]">
                                    {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filteredList.length)}
                                </span>{" "}
                                dari{" "}
                                <span className="text-[#e5e2e1]">{filteredList.length}</span>{" "}
                                pengumuman
                            </p>
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                siblingCount={1}
                            />
                        </div>
                    )}
                </section>

            </UserLayout>
        </div>
    );
};

export default PengumumanPage;
