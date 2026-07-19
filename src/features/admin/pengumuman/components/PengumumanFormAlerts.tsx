interface PengumumanFormAlertsProps {
    error: string | null;
    success: boolean;
    isEdit: boolean;
}

export default function PengumumanFormAlerts({ error, success, isEdit }: PengumumanFormAlertsProps) {
    return (
        <>
            {error && (
                <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 text-sm mb-5">{error}</div>
            )}
            {success && (
                <div className="bg-green-950 border border-green-800 text-green-400 px-4 py-3 text-sm mb-5">
                    Pengumuman berhasil {isEdit ? "diperbarui" : "disimpan"}! Mengalihkan...
                </div>
            )}
        </>
    );
}