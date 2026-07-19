import { useParams } from "react-router-dom";
import { usePengumumanForm } from "@/hooks/usePengumumanForm";
import PengumumanFormHeader from "../components/PengumumanFormHeader";
import PengumumanFormAlerts from "../components/PengumumanFormAlerts";
import PengumumanImageField from "../components/PengumumanImageField";
import PengumumanTanggalKategoriFields from "../components/PengumumanTanggalKategoriFields";
import PengumumanDetailFields from "../components/PengumumanDetailFields";
import PengumumanAuthorContactFields from "../components/PengumumanAuthorContactFields";
import PengumumanLinkStatusFields from "../components/PengumumanLinkStatusFields";
import PengumumanPentingCheckbox from "../components/PengumumanPentingCheckbox";
import TagListField from "@/components/common/TagListField";
import PengumumanTimelineField from "../components/PengumumanTimelineField";
import PengumumanFormActions from "../components/PengumumanFormActions";

export default function PengumumanForm() {
    const { id } = useParams<{ id: string }>();
    const {
        isEdit,
        loading,
        initialLoading,
        error,
        success,
        imagePreview,
        imageFile,
        kategoriList,
        persyaratan,
        setPersyaratan,
        berkas,
        setBerkas,
        timeline,
        form,
        handleChange,
        handleContactPersonChange,
        handleStatusChange,
        handlePentingChange,
        handleImageChange,
        handleRemoveImage,
        addTimeline,
        removeTimeline,
        handleSubmit,
    } = usePengumumanForm(id);

    if (initialLoading) {
        return (
            <section className="p-8 font-sans text-[#ffd700] max-w-3xl">
                <p className="text-yellow-600 text-sm">Memuat data...</p>
            </section>
        );
    }

    return (
        <section className="p-8 font-sans text-[#ffd700] max-w-3xl">
            <PengumumanFormHeader isEdit={isEdit} />

            <PengumumanFormAlerts error={error} success={success} isEdit={isEdit} />

            <form onSubmit={handleSubmit} className="space-y-5">
                <PengumumanImageField
                    preview={imagePreview}
                    file={imageFile}
                    onChange={handleImageChange}
                    onRemove={handleRemoveImage}
                />

                <PengumumanTanggalKategoriFields
                    tanggal={form.tanggal}
                    kategoriId={form.kategoriId}
                    kategoriList={kategoriList}
                    onChange={handleChange}
                />

                <PengumumanDetailFields title={form.title} desc={form.desc} onChange={handleChange} />

                <PengumumanAuthorContactFields
                    author={form.author}
                    contactPerson={form.contactPerson}
                    onAuthorChange={handleChange}
                    onContactPersonChange={handleContactPersonChange}
                />

                <PengumumanLinkStatusFields
                    linkPendaftaran={form.linkPendaftaran}
                    isPublished={form.isPublished}
                    onLinkChange={handleChange}
                    onStatusChange={handleStatusChange}
                />

                <PengumumanPentingCheckbox checked={form.isPenting} onChange={handlePentingChange} />

                <TagListField
                    label="Persyaratan"
                    placeholder="Contoh: Fotokopi KTP"
                    items={persyaratan}
                    onChange={setPersyaratan}
                />

                <TagListField
                    label="Berkas"
                    placeholder="Contoh: Formulir Pendaftaran.pdf"
                    items={berkas}
                    onChange={setBerkas}
                />

                <PengumumanTimelineField timeline={timeline} onAdd={addTimeline} onRemove={removeTimeline} />

                <PengumumanFormActions loading={loading} isEdit={isEdit} />
            </form>
        </section>
    );
}