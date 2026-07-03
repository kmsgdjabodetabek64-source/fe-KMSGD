import {
    MdAccessTime,
    MdCategory,
    MdGroups,
    MdLocationOn,
    MdPaid,
    MdPerson,
} from "react-icons/md";
import { InfoItem } from "../../../../components/InfoState";
import type { Kegiatan } from "../types/kegiatan.types";
import RevealItem from "@/components/RevealItem";

interface InfoDetailKegiatanProps {
    kegiatan: Kegiatan;
}

function InfoDetailKegiatan({ kegiatan }: InfoDetailKegiatanProps) {
    return (
        <article className="flex flex-col gap-8">
            <RevealItem animation="animate-fade-in-up">
                <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="border border-[#4d4732] bg-[#171717] px-3 py-1 text-xs font-bold uppercase tracking-[2px] text-[#ffd700]">
                            {kegiatan.category}
                        </span>
                        <span className="text-xs uppercase tracking-[2px] text-[#777]">
                            {kegiatan.date}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold font-['Montserrat'] text-white leading-tight mb-4">
                        {kegiatan.title}
                    </h2>
                    <p className="text-[#d0c6ab] leading-7 whitespace-pre-line">
                        {kegiatan.desc}
                    </p>
                </div>
            </RevealItem>

            <RevealItem animation="animate-fade-in-up" delay={80}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InfoItem icon={<MdAccessTime />} label="Waktu" value={`${kegiatan.startTime} - ${kegiatan.endTime} WIB`} />
                    <InfoItem icon={<MdLocationOn />} label="Lokasi" value={kegiatan.location} />
                    <InfoItem icon={<MdCategory />} label="Kategori" value={kegiatan.category} />
                    <InfoItem icon={<MdPaid />} label="Biaya" value={kegiatan.priceLabel} />
                    <InfoItem icon={<MdGroups />} label="Penyelenggara" value={kegiatan.organizer || "KMSGD Jabodetabek"} />
                    <InfoItem icon={<MdPerson />} label="Kontak" value={kegiatan.contactPerson || "-"} />
                </div>
            </RevealItem>

            {kegiatan.speakers.length > 0 && (
                <RevealItem animation="animate-fade-in-up" delay={140}>
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-[2px] text-[#ffd700] mb-3">
                            Pembicara
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {kegiatan.speakers.map((speaker) => (
                                <span key={speaker} className="border border-[#2a2a2a] bg-[#171717] px-3 py-2 text-sm text-[#d0c6ab]">
                                    {speaker}
                                </span>
                            ))}
                        </div>
                    </section>
                </RevealItem>
            )}

            <RevealItem animation="animate-fade-in-up" delay={160}>
                <div className="border-t border-[#1f1f1f] pt-6">
                    {kegiatan.registrationLink ? (
                        <a
                            href={kegiatan.registrationLink}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex bg-[#ffd700] px-6 py-3 text-sm font-bold uppercase tracking-[2px] text-black hover:bg-[#e9c400] transition-colors"
                        >
                            Daftar Kegiatan
                        </a>
                    ) : (
                        <p className="text-sm text-[#777]">
                            Link pendaftaran belum tersedia.
                        </p>
                    )}
                </div>
            </RevealItem>
        </article>
    )
}

export default InfoDetailKegiatan;