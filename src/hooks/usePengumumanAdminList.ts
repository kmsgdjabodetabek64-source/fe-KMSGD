import { useEffect, useState, useCallback, useRef } from "react";
import { getPengumuman, deletePengumuman } from "../features/admin/service/pengumumanService";
import type { Pengumuman } from "../features/admin/pengumuman/pengumumanTypes";

export function usePengumumanAdminList() {
  const [data, setData] = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const currentRequestId = ++requestIdRef.current;

    setLoading(true);
    setError(null);
    try {
      const result = await getPengumuman({ signal: controller.signal });
      if (currentRequestId !== requestIdRef.current) return;
      setData(result);
    } catch (err: unknown) {
      const isAbort = err instanceof Error && (err.name === "AbortError" || err.name === "CanceledError");
      if (isAbort) return;

      if (currentRequestId === requestIdRef.current) {
        setError("Gagal memuat data pengumuman.");
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  // Reset page langsung di handler saat search/perPage berubah,
  // bukan lewat effect terpisah — menghindari pola "adjusting state on prop change".
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  const remove = async (id: number) => {
    await deletePengumuman(id);
    setData((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = data.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.kategori.nama.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return {
    paginated,
    totalItems: filtered.length,
    totalPages,
    loading,
    error,
    search,
    handleSearchChange,
    page,
    setPage,
    perPage,
    handlePerPageChange,
    remove,
    setError,
  };
}
