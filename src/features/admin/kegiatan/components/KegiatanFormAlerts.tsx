interface KegiatanFormAlertsProps {
    error: string | null;
    success: boolean;
    isEditMode: boolean;
}

export default function KegiatanFormAlerts({ error, success, isEditMode }: KegiatanFormAlertsProps) {
    return (
        <>
            {error && (
                <div className="bg-red-950 border border-red-800 text-red-300 px-4 py-3 text-sm mb-5">{error}</div>
            )}
            {success && (
                <div className="bg-green-950 border border-green-800 text-green-400 px-4 py-3 text-sm mb-5">
                    {isEditMode ? "Kegiatan berhasil diperbarui!" : "Kegiatan berhasil disimpan!"} Mengalihkan...
                </div>
            )}
        </>
    );
}