import { NavLink } from "react-router-dom";

const navItems = [
    { label: "PRIODE", path: "/admin/kepengurusan/periode" },
    { label: "DEPARTEMEN", path: "/admin/kepengurusan/departemen" },
    { label: "BADAN KHUSUS", path: "/admin/kepengurusan/bk" },
    { label: "BPI", path: "/admin/kepengurusan/pengurus" },
];

const NavbarKepengurusan = () => {
    return (
        <div className="flex gap-1 border-b border-[#2a2a2a] mb-6">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex items-center gap-2 px-6 py-3 font-bold text-sm tracking-wider transition-colors cursor-pointer border-b-2 ${isActive
                            ? "bg-[#1a1500] border-[#b8982a] text-[#ffd700]"
                            : "border-transparent text-zinc-500 hover:text-[#b8982a]"
                        }`
                    }
                >
                    {item.label}
                </NavLink>
            ))}
        </div>
    );
};

export default NavbarKepengurusan;