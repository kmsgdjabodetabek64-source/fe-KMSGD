import { Link } from "react-router-dom";
import { footerLinks } from "./services/footerService";
import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const SosmedIcon = ({ icon }: { icon: string }) => {
    const className = "w-5 h-5";

    if (icon === "instagram") return <FaInstagram className={className} />;
    if (icon === "youtube") return <FaYoutube className={className} />;
    if (icon === "tiktok") return <FaTiktok className={className} />;

    // email
    return <MdEmail className={className} />;
};

const Footer = () => {
    return (
        <footer className="bg-[#1A1A1A] pt-12 pb-6 sm:pt-20 sm:pb-8 border-t border-[#353535]">
            <div className="max-w-300 mx-auto px-4 sm:px-6">
                {/* Footer Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-10 sm:mb-16 text-center sm:text-left">
                    {/* About */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                            <img
                                src="/logo.webp"
                                alt="Logo KMSGD Jabodetabek"
                                className="w-10 h-10 object-contain shrink-0"
                            />
                            <div className="text-left">
                                <div className="text-[#FFD700] font-bold font-['Montserrat'] text-sm leading-tight">
                                    KMSGD
                                </div>
                                <div className="text-[#d0c6ab] text-[10px] tracking-widest uppercase">
                                    Jabodetabek
                                </div>
                            </div>
                        </div>
                        <p className="text-[#d0c6ab] text-sm leading-relaxed mb-4 max-w-xs mx-auto sm:mx-0">
                            Keluarga Mahasiswa Sunan Gunung Djati Jabodetabek. Wadah
                            silaturahmi dan pengembangan diri mahasiswa.
                        </p>
                        <p className="text-[#d0c6ab] text-xs">
                            📍 Jakarta · Bogor · Depok · Tangerang · Bekasi
                        </p>
                    </div>

                    {/* Navigasi */}
                    <div>
                        <h4 className="text-[#e5e2e1] font-bold font-['Montserrat'] text-sm mb-3 sm:mb-4 uppercase tracking-wider">
                            Navigasi
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.navigasi.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-[#d0c6ab] text-sm hover:text-[#FFD700] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Organisasi */}
                    <div>
                        <h4 className="text-[#e5e2e1] font-bold font-['Montserrat'] text-sm mb-3 sm:mb-4 uppercase tracking-wider">
                            Organisasi
                        </h4>
                        <ul className="space-y-2">
                            {footerLinks.organisasi.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-[#d0c6ab] text-sm hover:text-[#FFD700] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Sosial Media & Kontak */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <h4 className="text-[#e5e2e1] font-bold font-['Montserrat'] text-sm mb-3 sm:mb-4 uppercase tracking-wider">
                            Terhubung
                        </h4>
                        <div className="flex justify-center sm:justify-start gap-3 mb-5 sm:mb-6">
                            {footerLinks.sosial.map((sosmed) => (
                                <a
                                    key={sosmed.label}
                                    href={sosmed.href}
                                    className="w-10 h-10 bg-[#20201f] flex items-center justify-center hover:bg-[#FFD700] transition-colors group text-[#d0c6ab] hover:text-[#1A1A1A]"
                                    aria-label={sosmed.label}
                                    target={sosmed.href.startsWith("mailto") ? undefined : "_blank"}
                                    rel="noopener noreferrer"
                                >
                                    <SosmedIcon icon={sosmed.icon} />
                                </a>
                            ))}
                        </div>
                        <p className="text-[#d0c6ab] text-sm mb-2 break-all sm:break-normal">
                            ✉️ kmsgd.jabodetabek@gmail.com
                        </p>
                        <a
                            href="https://wa.me/6281234567890"
                            className="text-[#d0c6ab] text-sm hover:text-[#FFD700] transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            💬 +62 812-3456-7890 (WhatsApp)
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-[#353535] pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-center">
                    <p className="text-[#d0c6ab] text-xs">
                        © 2024 KMSGD Jabodetabek. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-[#d0c6ab] text-xs hover:text-[#FFD700] transition-colors">
                            Kebijakan Privasi
                        </a>
                        <a href="#" className="text-[#d0c6ab] text-xs hover:text-[#FFD700] transition-colors">
                            Syarat & Ketentuan
                        </a>
                    </div>
                </div>
            </div >
        </footer >
    )
}

export default Footer;