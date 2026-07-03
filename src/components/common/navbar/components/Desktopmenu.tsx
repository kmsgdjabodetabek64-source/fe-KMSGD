import { Link, useLocation } from 'react-router-dom';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { MENU_ITEMS } from '../constants';
import { navLinkClass, dropdownItemClass } from '../classnames';

interface Props {
    lightMode: boolean;
    activeDropdown: string | null;
    closeMenus: () => void;
    toggleDropdown: (label: string) => void;
}

export function DesktopMenu({ lightMode, activeDropdown, closeMenus, toggleDropdown }: Props) {
    const { pathname } = useLocation();

    return (
        <div className="hidden md:flex items-center gap-8">
            {MENU_ITEMS.map((item) => {
                const isActive = item.path
                    ? pathname === item.path
                    : item.subItems?.some(sub => pathname === sub.path) ?? false;
                const isOpen = activeDropdown === item.label;

                return (
                    <div key={item.label} className="relative py-2">
                        {item.path ? (
                            <Link to={item.path} onClick={closeMenus} className={navLinkClass(isActive, lightMode)}>
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                onClick={() => toggleDropdown(item.label)}
                                className={`cursor-pointer gap-1 ${navLinkClass(isActive, lightMode)}`}
                            >
                                {item.label}
                                {isOpen ? <MdKeyboardArrowUp className="text-lg" /> : <MdKeyboardArrowDown className="text-lg" />}
                            </span>
                        )}

                        {item.subItems && (
                            <div className={`absolute top-full left-0 mt-0 w-48 border border-[#FACC15] shadow-lg flex flex-col overflow-hidden z-50 transition-all duration-200
                                ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}
                                ${lightMode ? 'bg-white' : 'bg-[#141414]'}`}
                            >
                                {item.subItems.map(sub => (
                                    <Link
                                        key={sub.label}
                                        to={sub.path}
                                        onClick={closeMenus}
                                        className={dropdownItemClass(pathname === sub.path, lightMode)}
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
    );
}