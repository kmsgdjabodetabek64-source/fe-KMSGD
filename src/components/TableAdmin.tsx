import React from "react";

// Struktur untuk mendefinisikan kolom secara dinamis
export interface Column<T> {
    header: string;
    headerClassName?: string;
    cellClassName?: string;
    // Fungsi render memberikan kontrol penuh untuk isi cell di halaman konsumen
    render: (item: T, globalIndex: number) => React.ReactNode;
}

interface GenericTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading: boolean;
    page?: number;
    perPage?: number;
    emptyMessage?: string;
    loadingMessage?: string;
    rowKey: (item: T) => string | number; // Menjamin performa rekonsiliasi DOM React
}

// Komponen Row yang di-memoize untuk menghindari re-render yang tidak perlu
const TableRow = React.memo(function TableRow<T>({
    item,
    columns,
    globalIndex,
}: {
    item: T;
    columns: Column<T>[];
    globalIndex: number;
}) {
    return (
        <tr className="border-b border-[#2a2a2a] bg-transparent hover:bg-[#111] transition-colors duration-150">
            {columns.map((col, columnIndex) => (
                <td
                    key={columnIndex}
                    className={`py-6 px-3 ${col.cellClassName || ""}`}
                >
                    {col.render(item, globalIndex)}
                </td>
            ))}
        </tr>
    );
}) as <T>(props: { item: T; columns: Column<T>[]; globalIndex: number }) => React.JSX.Element;

// Komponen Tabel Utama
const TableAdmin = <T,>({
    data,
    columns,
    loading,
    page = 1,
    perPage = 10,
    emptyMessage = "Tidak ada data ditemukan.",
    loadingMessage = "Memuat data...",
    rowKey,
}: GenericTableProps<T>) => {
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-b-2 border-[#ffd700]">
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`text-left py-5 px-3 text-[#ffd700] font-bold text-xs tracking-[0.08em] uppercase whitespace-nowrap ${col.headerClassName || ""
                                    }`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className="p-24 text-center text-[#ffd700]">
                                {loadingMessage}
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="p-24 text-center text-zinc-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, index) => {
                            const globalIndex = (page - 1) * perPage + index + 1;
                            return (
                                <TableRow
                                    key={rowKey(item)}
                                    item={item}
                                    columns={columns}
                                    globalIndex={globalIndex}
                                />
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableAdmin;