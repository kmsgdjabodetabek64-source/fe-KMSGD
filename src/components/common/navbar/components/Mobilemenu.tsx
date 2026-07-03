import { Link, useLocation } from 'react-router-dom';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { MENU_ITEMS } from '../constants';
import { mobileLinkClass, mobileSubLinkClass } from '../classnames';

interface Props {
    lightMode: boolean;
    isOpen: boolean;
    activeDropdown: string | null;
    closeMenus: () => void;
    toggleDropdown: (label: string) => void;
}

export function MobileMenu({ lightMode, isOpen, activeDropdown, closeMenus, toggleDropdown }: Props) {
    const { pathname } = useLocation();

    return (
        <div className={`md:hidden w-full border-t border-[#FACC15]/20 transition-all duration-300 ease-in-out overflow-hidden
            ${isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}
            ${lightMode ? 'bg-white' : 'bg-[#141414]'}`}
        >
            <div className="flex flex-col px-6 py-4 space-y-4">
                {MENU_ITEMS.map((item) => {
                    const isActive = item.path
                        ? pathname === item.path
                        : item.subItems?.some(sub => pathname === sub.path) ?? false;
                    const isDropOpen = activeDropdown === item.label;

                    return (
                        <div key={item.label} className="flex flex-col">
                            {item.path ? (
                                <Link to={item.path} onClick={closeMenus} className={mobileLinkClass(isActive, lightMode)}>
                                    {item.label}
                                </Link>
                            ) : (
                                <>
                                    <button
                                        onClick={() => toggleDropdown(item.label)}
                                        className={`flex items-center justify-between w-full text-left ${mobileLinkClass(isActive, lightMode)}`}
                                    >
                                        {item.label}
                                        {isDropOpen ? <MdKeyboardArrowUp size={24} /> : <MdKeyboardArrowDown size={24} />}
                                    </button>

                                    <div className={`flex flex-col pl-4 mt-2 space-y-3 overflow-hidden transition-all duration-300
                                        ${isDropOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        {item.subItems?.map(sub => (
                                            <Link
                                                key={sub.label}
                                                to={sub.path}
                                                onClick={closeMenus}
                                                className={mobileSubLinkClass(pathname === sub.path, lightMode)}
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}