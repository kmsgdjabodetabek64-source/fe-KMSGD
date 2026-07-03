import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    MdDashboard,
    MdGroups,
    MdEvent,
    MdCampaign,
    MdPhotoLibrary,
    MdLogout,
    MdWallpaper,
    MdMenu,
    MdClose
} from "react-icons/md";
import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
    { label: "Dashboard", path: "/admin/dashboard", icon: MdDashboard },
    { label: "Kepengurusan", path: "/admin/kepengurusan", icon: MdGroups },
    { label: "Kegiatan", path: "/admin/kegiatan", icon: MdEvent },
    { label: "Pengumuman", path: "/admin/pengumuman", icon: MdCampaign },
    { label: "Galeri", path: "/admin/galeri", icon: MdPhotoLibrary },
    { label: "Home Bg", path: "/admin/home-background", icon: MdWallpaper },
];

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);

    const handleLogout = async () => {
        await logout();
        navigate("/portal-kmsgd/auth?access=K5GD-4dm1n-P0rt4l", { replace: true });
    };

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 right-4 z-50 p-2 bg-neutral-900 text-[#FACC15] rounded-md border border-neutral-700 shadow-lg focus:outline-none"
            >
                {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>

            {/* Overlay Gelap (Klik di luar sidebar untuk menutup) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
                    onClick={closeSidebar}
                />
            )}

            {/* Area Sidebar - fixed di semua ukuran layar, jadi tidak ikut scroll */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-60 h-screen bg-neutral-900 border-r-4 border-[#FACC15] flex flex-col shrink-0 transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0`}
            >
                {/* Brand */}
                <div className="px-5 py-5 border-b border-neutral-800 pt-16 md:pt-5 shrink-0">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-[#FACC15] mb-3">
                        <img src="/logo.webp" alt="logo" />
                    </div>
                    <h2 className="text-white font-bold text-sm tracking-wide leading-tight">
                        KMSGD
                    </h2>
                    <p className="text-neutral-500 text-[10px] tracking-widest uppercase mt-0.5">
                        Admin Panel
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            end={item.path === "/admin/dashboard"}
                            onClick={closeSidebar}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 text-sm font-medium tracking-wide transition-colors ${isActive
                                    ? "bg-[#FACC15] text-black"
                                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                                }`
                            }
                        >
                            <item.icon className="text-lg" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-neutral-800 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium tracking-wide text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                    >
                        <MdLogout className="text-lg" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;