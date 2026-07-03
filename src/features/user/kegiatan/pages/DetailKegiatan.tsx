import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DetailPostTemplate } from "@/components/common/DetailPostTemplate";
import DetailAsideCard from "@/components/common/DetailAsideCard";
import {
    CONTENT_HEADER,
    getKegiatanById,
    getLatestKegiatan,
} from "../services/kegiatanService";
import { getLatestPengumuman } from "../../pengumuman/services/pengumumanService";
import { EmptyState, LoadingState } from "../../../../components/InfoState";
import InfoDetailKegiatan from "../components/InfoDetailKegiatan";

const toNumericId = (value?: string) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

const DetailKegiatan = () => {
    const { id: idParam } = useParams();
    const kegiatanId = toNumericId(idParam);

    const detailQuery = useQuery({
        queryKey: ["kegiatan-detail", kegiatanId],
        queryFn: () => getKegiatanById(kegiatanId as number),
        enabled: kegiatanId !== null,
        staleTime: 5 * 60 * 1000,
    });

    const asideQuery = useQuery({
        queryKey: ["detail-aside-latest"],
        queryFn: async () => {
            const [kegiatan, pengumuman] = await Promise.all([
                getLatestKegiatan(3),
                getLatestPengumuman(3),
            ]);

            return { kegiatan, pengumuman };
        },
        staleTime: 5 * 60 * 1000,
    });

    const kegiatan = detailQuery.data;
    const heroDescription = kegiatan
        ? `${kegiatan.date} | ${kegiatan.startTime} - ${kegiatan.endTime} WIB | ${kegiatan.location}`
        : CONTENT_HEADER.deskripsi;

    const aside = (
        <>
            <DetailAsideCard
                title="Kegiatan Terbaru"
                emptyText="Belum ada kegiatan terbaru."
                items={(asideQuery.data?.kegiatan ?? [])
                    .filter((item) => item.id !== kegiatanId)
                    .slice(0, 3)
                    .map((item) => ({
                        id: item.id,
                        title: item.title,
                        meta: item.date,
                        to: `/kegiatan/detail/${item.id}`,
                    }))}
            />
            <DetailAsideCard
                title="Pengumuman Terbaru"
                emptyText="Belum ada pengumuman terbaru."
                items={(asideQuery.data?.pengumuman ?? []).slice(0, 3).map((item) => ({
                    id: item.id,
                    title: item.title,
                    meta: item.fullDate,
                    to: `/pengumuman/detail/${item.id}`,
                }))}
            />
        </>
    );

    return (
        <DetailPostTemplate
            judul="Detail"
            judul2="Kegiatan"
            deskripsi={heroDescription}
            bgImage={kegiatan?.image || "/bg.webp"}
            aside={aside}
        >
            {!kegiatanId ? (
                <EmptyState title="Kegiatan tidak ditemukan" message="Pilih kegiatan dari halaman daftar kegiatan." to="/kegiatan" />
            ) : detailQuery.isLoading ? (
                <LoadingState />
            ) : detailQuery.isError || !kegiatan ? (
                <EmptyState title="Gagal memuat kegiatan" message="Data kegiatan tidak tersedia atau sudah tidak dipublikasikan." to="/kegiatan" />
            ) : (
                <InfoDetailKegiatan kegiatan={kegiatan} />

            )}
        </DetailPostTemplate>
    );
};

export default DetailKegiatan;
