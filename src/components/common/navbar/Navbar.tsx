import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdMenu,
    MdClose
} from "react-icons/md";

interface NavItem {
    label: string;
    path?: string;
    subItems?: { label: string; path: string }[];
}

const menuItems: NavItem[] = [
    { label: 'Beranda', path: '/' },
    {
        label: 'Tentang',
        subItems: [
            { label: 'Profil', path: '/profil' },
            { label: 'Struktur Organisasi', path: '/kepengurusan/struktur' },
            { label: 'Departemen', path: '/kepengurusan/departemen' },
            { label: 'Badan Khusus', path: '/kepengurusan/badan-khusus' },
            { label: 'Demisoner', path: '/kepengurusan/demisoner' }
        ]
    },
    { label: 'Kegiatan', path: '/kegiatan' },
    { label: 'Pengumuman', path: '/pengumuman' },
    { label: 'Galeri', path: '/galeri' },
    { label: 'Kontak', path: '/kontak' },
];

export const Navbar: React.FC = () => {
    const location = useLocation();
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const closeMenus = () => {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="w-full fixed top-0 z-50 border-b-[3px] border-[#FACC15] select-none bg-[#141414] text-white">
            {/* Header */}
            <div className="px-6 py-4 md:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    onClick={closeMenus}
                    className="flex items-center gap-3 cursor-pointer font-['Montserrat']"
                >
                    <img
                        src="/logo.webp"
                        alt="Logo KMSGD Jabodetabek"
                        className="w-10 h-10 lg:w-12 lg:h-12 object-contain rounded-full bg-white shadow-sm"
                    />
                    <span className="text-[#FACC15] font-bold text-lg lg:text-xl tracking-wider uppercase">
                        <span className="text-white">KMSGD</span> JABODETABEK
                    </span>
                </Link>

                {/* Hamburger (mobile only) */}
                <button
                    className="lg:hidden p-1 transition-colors duration-200 text-[#FACC15]"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
                </button>

                {/* MENU (unified: column+accordion di mobile, row+dropdown di desktop) */}
                <div
                    className={`absolute lg:static top-full left-0 w-full lg:w-auto
                    bg-[#141414] lg:bg-transparent border-t lg:border-t-0 border-[#FACC15]/20
                    px-6 py-4 lg:p-0 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8
                    font-['Montserrat'] overflow-hidden transition-all duration-300 ease-in-out
                    ${isMobileMenuOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}
                    lg:max-h-none lg:opacity-100 lg:overflow-visible`}
                >
                    {menuItems.map((item) => {
                        const isActive = item.path
                            ? location.pathname === item.path
                            : item.subItems?.some((sub) => location.pathname === sub.path);

                        const isCurrentDropdownOpen = activeDropdown === item.label;

                        return (
                            <div key={item.label} className="relative lg:py-2">
                                {item.path ? (
                                    <Link
                                        to={item.path}
                                        onClick={closeMenus}
                                        className={`inline-flex items-center text-sm font-medium tracking-wide transition-all duration-200 pb-1 border-b-2 ${isActive
                                            ? 'text-[#FACC15] border-[#FACC15]'
                                            : 'text-gray-300 border-transparent hover:text-[#FACC15]'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() =>
                                            setActiveDropdown(isCurrentDropdownOpen ? null : item.label)
                                        }
                                        className={`flex items-center justify-between lg:justify-start gap-1 w-full lg:w-auto text-left text-sm font-medium tracking-wide transition-all duration-200 pb-1 border-b-2 ${isActive
                                            ? 'text-[#FACC15] border-[#FACC15]'
                                            : 'text-gray-300 border-transparent hover:text-[#FACC15]'
                                            }`}
                                    >
                                        {item.label}
                                        {isCurrentDropdownOpen ? (
                                            <MdKeyboardArrowUp className="text-lg" />
                                        ) : (
                                            <MdKeyboardArrowDown className="text-lg" />
                                        )}
                                    </button>
                                )}

                                {/* SUBMENU: accordion inline di mobile, absolute dropdown di desktop */}
                                {item.subItems && (
                                    <div
                                        className={`flex flex-col overflow-hidden transition-all duration-300
                                        pl-4 lg:pl-0 mt-2 lg:mt-0
                                        lg:absolute lg:top-full lg:left-0 lg:w-48 lg:border lg:border-[#FACC15] lg:bg-[#141414] lg:shadow-lg lg:z-50
                                        ${isCurrentDropdownOpen
                                                ? 'max-h-72 opacity-100 lg:visible lg:translate-y-0'
                                                : 'max-h-0 opacity-0 lg:invisible lg:-translate-y-2'
                                            }`}
                                    >
                                        {item.subItems.map((sub) => (
                                            <Link
                                                key={sub.label}
                                                to={sub.path}
                                                onClick={closeMenus}
                                                className={`px-0 lg:px-4 py-2 lg:py-3 text-sm transition-colors duration-200 ${location.pathname === sub.path
                                                    ? 'text-[#FACC15] font-bold lg:bg-[#FACC15] lg:text-[#141414]'
                                                    : 'text-gray-400 hover:text-white lg:text-gray-300 lg:hover:bg-[#FACC15] lg:hover:text-[#141414]'
                                                    }`}
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;