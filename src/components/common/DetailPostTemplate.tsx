import type { ReactNode } from "react";
import DetailLayout from "../../layouts/DetailLayout";

interface DetailTemplateProps {
    judul: string;
    judul2?: string;
    deskripsi: string;
    bgImage?: string;
    children: ReactNode;
    aside?: ReactNode;
}

export const DetailPostTemplate = ({ judul, judul2, deskripsi, bgImage, children, aside }: DetailTemplateProps) => {
    return (
        <DetailLayout
            judul={judul}
            judul2={judul2}
            deskripsi={deskripsi}
            bgImage={bgImage}
        >
            <main className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1 md:col-span-3 border-t-4 border-t-amber-500 border-x border-b border-[#1f1f1f] bg-[#111] p-5 md:p-8">
                    {children}
                </div>

                <aside className="col-span-1 flex flex-col gap-4">
                    {aside}
                </aside>
            </main>
        </DetailLayout>
    );
};
