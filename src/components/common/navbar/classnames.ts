export const cx = (...classes: (string | false | undefined | null)[]) => classes.filter(Boolean).join(" ");

export const navLinkClass = (isActive: boolean, lightMode: boolean) =>
  cx(
    "inline-flex items-center text-sm font-medium tracking-wide transition-all duration-200 pb-1 border-b-2",
    isActive ? "text-[#FACC15] border-[#FACC15]" : cx("border-transparent hover:text-[#FACC15]", lightMode ? "text-gray-600" : "text-gray-300"),
  );

export const dropdownItemClass = (isActive: boolean, lightMode: boolean) =>
  cx("px-4 py-3 text-sm transition-colors duration-200", isActive ? "bg-[#FACC15] text-[#141414] font-bold" : cx("hover:bg-[#FACC15] hover:text-[#141414]", lightMode ? "text-gray-700" : "text-gray-300"));

export const mobileLinkClass = (isActive: boolean, lightMode: boolean) =>
  cx("text-base font-medium transition-colors duration-200", isActive ? "text-[#FACC15]" : lightMode ? "text-gray-700 hover:text-[#FACC15]" : "text-gray-300 hover:text-[#FACC15]");

export const mobileSubLinkClass = (isActive: boolean, lightMode: boolean) =>
  cx("text-sm transition-colors duration-200", isActive ? "text-[#FACC15] font-bold" : lightMode ? "text-gray-500 hover:text-black" : "text-gray-400 hover:text-white");
