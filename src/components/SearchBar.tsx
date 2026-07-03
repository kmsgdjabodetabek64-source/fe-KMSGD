import { useState, useEffect } from "react";

interface Props {
    filters: string[];
    activeFilter: string;
    onFilterChange: (filter: string) => void;
    onSearchChange?: (query: string) => void;
    placeholder?: string;
}

const SearchBar = ({
    filters,
    activeFilter,
    onFilterChange,
    onSearchChange,
    placeholder = "Cari...",
}: Props) => {
    const [search, setSearch] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        onSearchChange?.(value);
    };

    const handleClear = () => {
        setSearch("");
        onSearchChange?.("");
    };

    return (
        <div
            className={`flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8 pb-6 border-b border-[#2a2a2a] transition-all duration-700 ease-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
        >
            <div className="relative w-full md:w-80">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d0c6ab] text-sm pointer-events-none">
                    🔍
                </span>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={search}
                    onChange={handleSearch}
                    className="bg-[#131313] border border-[#999077] text-[#e5e2e1] text-sm px-4 py-2.5 pl-10 pr-8 focus:border-[#ffd700] focus:outline-none focus:ring-1 focus:ring-[#ffd700]/30 transition-all duration-300 w-full"
                />
                {search && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999077] hover:text-[#e5e2e1] hover:scale-110 active:scale-90 transition-all duration-200 text-lg leading-none"
                        aria-label="Hapus pencarian"
                    >
                        ×
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => onFilterChange(filter)}
                        className={
                            activeFilter === filter
                                ? "bg-[#ffd700] text-[#131313] font-bold text-sm px-5 py-2.5 transition-all duration-200 hover:scale-105 active:scale-95"
                                : "bg-[#20201f] border border-[#4d4732] text-[#d0c6ab] hover:border-[#ffd700] hover:text-[#ffd700] hover:scale-105 active:scale-95 font-medium text-sm px-5 py-2.5 transition-all duration-200"
                        }
                    >
                        {filter}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;