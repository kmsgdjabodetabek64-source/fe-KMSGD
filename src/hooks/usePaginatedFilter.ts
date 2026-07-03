import { useState, useMemo } from "react";

interface FilterOptions<T> {
    data: T[];
    itemsPerPage?: number;
    filterFn?: (item: T, activeFilter: string) => boolean;
    searchFn?: (item: T, query: string) => boolean;
}

interface UsePaginatedFilterReturn<T> {
    paginatedList: T[];
    filteredList: T[];
    page: number;
    totalPages: number;
    activeFilter: string;
    searchQuery: string;
    handleFilterChange: (filter: string) => void;
    handleSearchChange: (query: string) => void;
    setPage: (page: number) => void;
}

export function usePaginatedFilter<T>({
    data,
    itemsPerPage = 6,
    filterFn,
    searchFn,
}: FilterOptions<T>): UsePaginatedFilterReturn<T> {
    const [activeFilter, setActiveFilter] = useState("Semua");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const filteredList = useMemo(() => {
        let list = data;

        if (filterFn && activeFilter !== "Semua") {
            list = list.filter((item) => filterFn(item, activeFilter));
        }

        if (searchFn && searchQuery.trim()) {
            list = list.filter((item) => searchFn(item, searchQuery.toLowerCase()));
        }

        return list;
    }, [data, activeFilter, searchQuery, filterFn, searchFn]);

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    const paginatedList = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return filteredList.slice(start, start + itemsPerPage);
    }, [filteredList, page, itemsPerPage]);

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
        setPage(1);
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setPage(1);
    };

    return {
        paginatedList,
        filteredList,
        page,
        totalPages,
        activeFilter,
        searchQuery,
        handleFilterChange,
        handleSearchChange,
        setPage,
    };
}