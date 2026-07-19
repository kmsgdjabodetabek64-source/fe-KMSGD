import { useEffect, useState, useRef, useCallback } from "react";
import { getKegiatanAdmin, deleteKegiatan } from "../features/admin/service/kegiatanService";
import type { Kegiatan } from "../features/admin/kegiatan/kegiatanTypes";
import { useDebouncedValue } from "./useDebouncedValue";

export function useKegiatanAdminList() {
  const [data, setData] = useState<Kegiatan[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const debouncedSearch = useDebouncedValue(search, 400);

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
      const result = await getKegiatanAdmin({
        search: debouncedSearch,
        page,
        perPage,
        signal: controller.signal,
      });

      if (currentRequestId !== requestIdRef.current) return;

      setData(result.data);
      setTotalItems(result.total);
    } catch (err: unknown) {
      const isAbort = err instanceof Error && (err.name === "AbortError" || err.name === "CanceledError");
      if (isAbort) return;

      if (currentRequestId === requestIdRef.current) {
        setError("Gagal memuat data kegiatan.");
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [debouncedSearch, page, perPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePerPageChange = (value: number) => {
    setPerPage(value);
    setPage(1);
  };

  const remove = async (id: number) => {
    await deleteKegiatan(id);
    await fetchData();
  };

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    totalItems,
    totalPages,
    loading,
    error,
    search,
    page,
    perPage,
    setPage,
    handleSearchChange,
    handlePerPageChange,
    remove,
    setError,
  };
}
