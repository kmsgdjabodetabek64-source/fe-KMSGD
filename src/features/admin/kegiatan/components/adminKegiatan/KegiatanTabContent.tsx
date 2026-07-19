import { useState } from "react";
import KegiatanTable from "./KegiatanTable";
import Pagination from "../../../../../components/common/admin/Pagination";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import KegiatanToolbar from "./KegiatanToolbar";
import KegiatanErrorBanner from "./KegiatanErrorBanner";
import { useKegiatanAdminList } from "@/hooks/useKegiatanAdminList";

export default function KegiatanTabContent() {
    const {
        data,
        totalItems,
        totalPages,
        loading,
        error,
        search,
        page,
        perPage,
        setPage,
        handleSearchChange,
        handlePerPageChange,
        remove,
        setError,
    } = useKegiatanAdminList();

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await remove(deleteId);
        } catch {
            setError("Gagal menghapus kegiatan.");
        } finally {
            setConfirmDelete(false);
            setDeleteId(null);
        }
    };

    return (
        <>
            <KegiatanToolbar search={search} onSearchChange={handleSearchChange} />

            {error && <KegiatanErrorBanner message={error} />}

            <KegiatanTable
                data={data}
                loading={loading}
                page={page}
                perPage={perPage}
                onDeleteClick={(id) => {
                    setDeleteId(id);
                    setConfirmDelete(true);
                }}
            />

            {!loading && (
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    perPage={perPage}
                    totalItems={totalItems}
                    onPageChange={setPage}
                    onPerPageChange={handlePerPageChange}
                />
            )}

            <ConfirmDeleteModal
                open={confirmDelete}
                onCancel={() => {
                    setConfirmDelete(false);
                    setDeleteId(null);
                }}
                onConfirm={handleDelete}
                title="Hapus Kegiatan"
                description="Yakin ingin menghapus kegiatan ini? Tindakan ini tidak bisa dibatalkan."
            />
        </>
    );
}