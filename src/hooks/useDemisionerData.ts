import { useEffect, useState } from "react";
import { getSemuaPeriode } from "@/features/user/tentang/Kepengurusan/services/kepengurusan";
import type { DemisionerDataGroup } from "@/features/user/tentang/Kepengurusan/types/demisionerTypes";

export function useDemisionerData() {
  const [demisionerData, setDemisionerData] = useState<DemisionerDataGroup[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSemuaPeriode()
      .then((data) => {
        const demisioners = data.filter((p) => p.status === "DEMISIONER");
        const mapped: DemisionerDataGroup[] = demisioners.map((d) => {
          const depts = d.departemen
            ? d.departemen.map((dept) => ({
                namaDepartemen: dept.namaDepartemen,
                img: dept.img ?? null,
                anggota: dept.anggota
                  ? dept.anggota.map((a) => ({
                      jabatan: a.jabatan,
                      nama: a.nama,
                      image: a.image,
                    }))
                  : [],
              }))
            : [];

          return {
            periode: d.periode,
            pengurusInti: d.pengurusInti || [],
            departemen: depts,
          };
        });
        setDemisionerData(mapped);
        if (mapped.length > 0) {
          setSelectedPeriode(mapped[0].periode);
        }
      })
      .catch(() => setError("Gagal memuat data demisioner."))
      .finally(() => setLoading(false));
  }, []);

  return { demisionerData, selectedPeriode, setSelectedPeriode, loading, error };
}
