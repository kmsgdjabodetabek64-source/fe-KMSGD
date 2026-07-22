import ConfirmDeleteModal from "../../kegiatan/components/adminKegiatan/ConfirmDeleteModal";
import BKTable from "./components/BKTable";
import BKHeader from "./components/BKHeader";
import BKFormModal from "./components/BKFormModal";
import AnggotaBKFormModal from "./components/AnggotaBKFormModal";
import { useBKAdmin } from "@/hooks/useBKAdmin";

const BKPage = () => {
    const {
        periodes,
        viewPeriodeId,
        setManualPeriodeId,
        bkList,
        isLoading,
        expandedBK,
        toggleBK,
        bkModal,
        anggotaModal,
        deleteModal,
    } = useBKAdmin();

    const totalAnggota = bkList.reduce((acc, b) => acc + (b.anggota?.length ?? 0), 0);

    return (
        <div className="w-full">
            <BKHeader
                periodes={periodes}
                viewPeriodeId={viewPeriodeId}
                onPeriodeChange={setManualPeriodeId}
                onAddClick={() => bkModal.open()}
            />

            <BKTable
                data={bkList}
                loading={isLoading}
                expandedBK={expandedBK}
                onToggleExpand={toggleBK}
                onEditClick={bkModal.open}
                onDeleteClick={deleteModal.requestDeleteBK}
                onAddAnggotaClick={anggotaModal.open}
                onDeleteAnggotaClick={deleteModal.requestDeleteAnggota}
            />

            {!isLoading && bkList.length > 0 && (
                <p className="text-neutral-600 text-xs mt-3">
                    Total <span className="text-neutral-400 font-medium">{bkList.length}</span> badan khusus
                    · <span className="text-neutral-400 font-medium">{totalAnggota}</span> anggota
                </p>
            )}

            <BKFormModal modal={bkModal} periodes={periodes} />
            <AnggotaBKFormModal modal={anggotaModal} />

            <ConfirmDeleteModal
                open={deleteModal.isOpen}
                onCancel={deleteModal.cancel}
                onConfirm={deleteModal.confirm}
                title="Hapus Data"
                description="Yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan."
            />
        </div>
    );
};

export default BKPage;