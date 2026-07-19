import { useState } from "react";
import PengumumanTable from "./PengumumanTable";
import Pagination from "@/components/common/admin/Pagination";
import ConfirmDeleteModal from "@/components/common/admin/ConfirmDeleteModal";
import AdminListToolbar from "@/components/common/admin/AdminListToolbar";
import AdminListErrorBanner from "@/components/common/admin/AdminListErrorBanner";
import { usePengumumanAdminList } from "@/hooks/usePengumumanAdminList";

export default function PengumumanTabContent() {
    const {
        paginated,
        totalItems,
        totalPages,
        loading,
        error,
        search,
        handleSearchChange,
        page,
        setPage,
        perPage,
        handlePerPageChange,
        remove,
        setError,
    } = usePengumumanAdminList();

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await remove(deleteId);
        } catch {
            setError("Gagal menghapus pengumuman.");
        } finally {
            setConfirmDelete(false);
            setDeleteId(null);
        }
    };

    return (
        <>
            <AdminListToolbar
                search={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Cari judul, kategori, author..."
                addHref="/admin/pengumuman/tambah"
                addLabel="Tambah Pengumuman"
            />

            {error && <AdminListErrorBanner message={error} />}

            <PengumumanTable
                data={paginated}
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
                title="Hapus Pengumuman"
                description="Yakin ingin menghapus pengumuman ini? Tindakan ini tidak bisa dibatalkan."
            />
        </>
    );
}