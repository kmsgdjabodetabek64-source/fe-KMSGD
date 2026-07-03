import {
    MdAnnouncement,
    MdCalendarMonth,
    MdChecklist,
    MdContactPhone,
    MdDescription,
    MdPerson,
} from "react-icons/md";
import { InfoItem, ListSection } from "@/components/InfoState";
import type { Pengumuman } from "../types/pengumuman.types";
import RevealItem from "@/components/RevealItem";

interface InfoDetailPengumumanProps {
    pengumuman: Pengumuman;
}

function InfoDetailPengumuman({ pengumuman }: InfoDetailPengumumanProps) {

    const formatTimelineDate = (value: string) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;

        const dateStr = new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);

        const timeStr = new Intl.DateTimeFormat("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date).replace(":", ".");

        return `${dateStr}, ${timeStr}`;
    };

    return (
        <article className="flex flex-col gap-8">
            <RevealItem animation="animate-fade-in-up">
                <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="border border-[#4d4732] bg-[#171717] px-3 py-1 text-xs font-bold uppercase tracking-[2px] text-[#ffd700]">
                            {pengumuman.category}
                        </span>
                        {pengumuman.isPenting && (
                            <span className="bg-[#e67e22] px-3 py-1 text-xs font-bold uppercase tracking-[2px] text-white">
                                Penting
                            </span>
                        )}
                        <span className="text-xs uppercase tracking-[2px] text-[#777]">
                            {pengumuman.fullDate}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-white leading-tight mb-4">
                        {pengumuman.title}
                    </h2>
                    <p className="text-[#d0c6ab] leading-7 whitespace-pre-line wrap-break-word overflow-hidden">
                        {pengumuman.desc}
                    </p>
                </div>
            </RevealItem>

            {/* Meta info grid */}
            <RevealItem animation="animate-fade-in-up" delay={80}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem icon={<MdCalendarMonth />} label="Tanggal" value={pengumuman.fullDate} />
                    <InfoItem icon={<MdAnnouncement />} label="Kategori" value={pengumuman.category} />
                    <InfoItem icon={<MdPerson />} label="Penulis" value={pengumuman.author} />
                    <InfoItem icon={<MdContactPhone />} label="Kontak" value={pengumuman.contactPerson || "-"} />
                </div>
            </RevealItem>

            {/* Timeline */}
            {pengumuman.timeline.length > 0 && (
                <RevealItem animation="animate-fade-in-up" delay={140}>
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-[2px] text-[#ffd700] mb-4">
                            Timeline
                        </h3>
                        <div className="flex flex-col gap-3">
                            {pengumuman.timeline.map((item) => (
                                <div key={`${item.agenda}-${item.tanggal}`} className="border border-[#1f1f1f] bg-[#171717] p-4">
                                    <p className="text-xs uppercase tracking-[2px] text-[#777] mb-1">
                                        {formatTimelineDate(item.tanggal)}
                                    </p>
                                    <p className="text-sm font-semibold text-[#e5e2e1]">{item.agenda}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </RevealItem>
            )}

            {/* Persyaratan & Berkas */}
            <RevealItem animation="animate-fade-in-up" delay={160}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ListSection title="Persyaratan" icon={<MdChecklist />} items={pengumuman.persyaratan} emptyText="Tidak ada persyaratan khusus." />
                    <ListSection title="Berkas" icon={<MdDescription />} items={pengumuman.berkas} emptyText="Tidak ada berkas yang perlu disiapkan." />
                </div>
            </RevealItem>

            {/* Registration link */}
            <RevealItem animation="animate-fade-in-up" delay={200}>
                <div className="border-t border-[#1f1f1f] pt-6">
                    {pengumuman.linkPendaftaran ? (
                        <a
                            href={pengumuman.linkPendaftaran}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex bg-[#ffd700] px-6 py-3 text-sm font-bold uppercase tracking-[2px] text-black hover:bg-[#e9c400] transition-colors"
                        >
                            Buka Pendaftaran
                        </a>
                    ) : (
                        <p className="text-sm text-[#777]">
                            Link pendaftaran belum tersedia.
                        </p>
                    )}
                </div>
            </RevealItem>
        </article>
    );
}

export default InfoDetailPengumuman;