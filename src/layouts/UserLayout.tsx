import React from "react";

interface UserLayoutProps {
    children: React.ReactNode;
    isHome?: boolean;
}

export default function UserLayout({ children, isHome = false }: UserLayoutProps) {
    return (
        <div className="bg-[#131313] text-[#e5e2e1] font-['Inter'] min-h-screen">
            {isHome ? (
                children
            ) : (
                <main className="w-full max-w-7xl mx-auto px-6 pt-30 pb-20">
                    {children}
                </main>
            )}
        </div>
    )
}