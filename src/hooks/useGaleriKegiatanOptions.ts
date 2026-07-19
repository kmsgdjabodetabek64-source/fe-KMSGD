import { useState, useEffect } from "react";
import { getKegiatanAdmin } from "@/features/admin/service/kegiatanService";
import type { Kegiatan } from "@/features/admin/kegiatan/kegiatanTypes";

export function useKegiatanOptions() {
    const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchKegiatan = async () => {
            try {
                const items = await getKegiatanAdmin();
                if (isMounted) {
                    setKegiatanList(Array.isArray(items) ? items : []);
                }
            } catch {
                if (isMounted) setKegiatanList([]);
            }
        };

        fetchKegiatan();

        return () => {
            isMounted = false;
        };
    }, []);

    return kegiatanList;
}