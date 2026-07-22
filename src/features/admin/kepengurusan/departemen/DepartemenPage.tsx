import ConfirmDeleteModal from "../../kegiatan/components/adminKegiatan/ConfirmDeleteModal";
import DepartemenTable from "./components/DepartemenTable";
import DepartemenHeader from "@/features/admin/kepengurusan/departemen/components/DepartemenHeader";
import DepartemenFormModal from "@/features/admin/kepengurusan/departemen/components/DepartemenFormModal";
import AnggotaFormModal from "@/features/admin/kepengurusan/departemen/components/AnggotaFormModal";
import { useDepartemenAdmin } from "@/hooks/useDepartemenAdmin";

const DepartemenPage = () => {
    const {
        periodes,
        viewPeriodeId,
        setManualPeriodeId,
        departemenList,
        isLoading,
        expandedDept,
        toggleDept,
        deptModal,
        anggotaModal,
        deleteModal,
    } = useDepartemenAdmin();

    const totalAnggota = departemenList.reduce((acc, d) => acc + (d.anggota?.length ?? 0), 0);

    return (
        <div className="w-full">
            <DepartemenHeader
                periodes={periodes}
                viewPeriodeId={viewPeriodeId}
                onPeriodeChange={setManualPeriodeId}
                onAddClick={() => deptModal.open()}
            />

            <DepartemenTable
                data={departemenList}
                loading={isLoading}
                expandedDept={expandedDept}
                onToggleExpand={toggleDept}
                onEditClick={deptModal.open}
                onDeleteClick={deleteModal.requestDeleteDept}
                onAddAnggotaClick={anggotaModal.open}
                onDeleteAnggotaClick={deleteModal.requestDeleteAnggota}
            />

            {!isLoading && departemenList.length > 0 && (
                <p className="text-neutral-600 text-xs mt-3">
                    Total <span className="text-neutral-400 font-medium">{departemenList.length}</span> departemen
                    · <span className="text-neutral-400 font-medium">{totalAnggota}</span> anggota
                </p>
            )}

            <DepartemenFormModal modal={deptModal} periodes={periodes} />
            <AnggotaFormModal modal={anggotaModal} />

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

export default DepartemenPage;