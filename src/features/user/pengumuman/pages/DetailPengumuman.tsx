import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DetailPostTemplate } from "../../../../components/common/DetailPostTemplate";
import DetailAsideCard from "../../../../components/common/DetailAsideCard";
import { getLatestKegiatan } from "../../kegiatan/services/kegiatanService";
import {
    CONTENT_HEADER,
    getLatestPengumuman,
    getPengumumanById,
} from "../services/pengumumanService";
import { EmptyState, LoadingState } from "@/components/InfoState";
import InfoDetailPengumuman from "../components/InfoDetailPengumuman";

const toNumericId = (value?: string) => {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : null;
};

const DetailPengumuman = () => {
    const { id: idParam } = useParams();
    const pengumumanId = toNumericId(idParam);

    const detailQuery = useQuery({
        queryKey: ["pengumuman-detail", pengumumanId],
        queryFn: () => getPengumumanById(pengumumanId as number),
        enabled: pengumumanId !== null,
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

    const pengumuman = detailQuery.data;
    const heroDescription = pengumuman
        ? `${pengumuman.fullDate} | ${pengumuman.category} | Oleh ${pengumuman.author}`
        : CONTENT_HEADER.deskripsi;

    const aside = (
        <>
            <DetailAsideCard
                title="Kegiatan Terbaru"
                emptyText="Belum ada kegiatan terbaru."
                items={(asideQuery.data?.kegiatan ?? []).slice(0, 3).map((item) => ({
                    id: item.id,
                    title: item.title,
                    meta: item.date,
                    to: `/kegiatan/detail/${item.id}`,
                }))}
            />
            <DetailAsideCard
                title="Pengumuman Terbaru"
                emptyText="Belum ada pengumuman terbaru."
                items={(asideQuery.data?.pengumuman ?? [])
                    .filter((item) => item.id !== pengumumanId)
                    .slice(0, 3)
                    .map((item) => ({
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
            judul2="Pengumuman"
            deskripsi={heroDescription}
            bgImage={pengumuman?.image || "/bg.webp"}
            aside={aside}
        >
            {!pengumumanId ? (
                <EmptyState title="Pengumuman tidak ditemukan" message="Pilih pengumuman dari halaman daftar pengumuman." to="/pengumuman" />
            ) : detailQuery.isLoading ? (
                <LoadingState />
            ) : detailQuery.isError || !pengumuman ? (
                <EmptyState title="Gagal memuat pengumuman" message="Data pengumuman tidak tersedia atau sudah tidak dipublikasikan." to="/pengumuman" />
            ) : (
                <InfoDetailPengumuman pengumuman={pengumuman} />
            )}
        </DetailPostTemplate>
    );
};

export default DetailPengumuman;
