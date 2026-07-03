import { useState, useEffect, useCallback } from "react";

export function useNavbar() {
  const [lightMode, setLightMode] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !lightMode);
  }, [lightMode]);

  const toggleTheme = useCallback(() => setLightMode((prev) => !prev), []);

  const closeMenus = useCallback(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, []);

  const toggleDropdown = useCallback((label: string) => {
    setActiveDropdown((prev) => (prev === label ? null : label));
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return {
    lightMode,
    activeDropdown,
    isMobileMenuOpen,
    toggleTheme,
    closeMenus,
    toggleDropdown,
    toggleMobileMenu,
  };
}
