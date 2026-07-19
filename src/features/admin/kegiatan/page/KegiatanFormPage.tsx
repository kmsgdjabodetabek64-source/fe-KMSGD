import { useParams } from "react-router-dom";
import { useKegiatanForm } from "@/hooks/useKegiatanForm";
import KegiatanFormHeader from "../components/KegiatanFormHeader";
import KegiatanFormAlerts from "../components/KegiatanFormAlerts";
import KegiatanImageField from "../components/KegiatanImageField";
import KegiatanKategoriField from "../components/KegiatanKategoriField";
import KegiatanJadwalFields from "../components/KegiatanJadwalFields";
import KegiatanDetailFields from "../components/KegiatanDetailFields";
import KegiatanHargaRegistrasiFields from "../components/KegiatanHargaRegistrasiFields";
import KegiatanPenyelenggaraFields from "../components/KegiatanPenyelenggaraFields";
import KegiatanOrganizerCustomField from "../components/KegiatanOrganizerCustomField";
import KegiatanStatusField from "../components/KegiatanStatusField";
import KegiatanSpeakersField from "../components/KegiatanSpeakersField";
import KegiatanFormActions from "../components/KegiatanFormActions";

export default function KegiatanFormPage() {
    const { id } = useParams<{ id: string }>();
    const {
        isEditMode,
        loading,
        fetching,
        error,
        success,
        imagePreview,
        imageFile,
        kategoriList,
        departemenList,
        speakers,
        speakerInput,
        setSpeakerInput,
        form,
        handleChange,
        handleStatusChange,
        handleImageChange,
        removeImage,
        addSpeaker,
        removeSpeaker,
        handleSubmit,
        goBack,
    } = useKegiatanForm(id);

    if (fetching) {
        return <div className="p-8 text-[#ffd700]">Memuat data...</div>;
    }

    return (
        <section className="p-8 font-sans text-[#ffd700] max-w-3xl">
            <KegiatanFormHeader isEditMode={isEditMode} onBack={goBack} />

            <KegiatanFormAlerts error={error} success={success} isEditMode={isEditMode} />

            <form onSubmit={handleSubmit} className="space-y-5">
                <KegiatanImageField
                    preview={imagePreview}
                    file={imageFile}
                    onChange={handleImageChange}
                    onRemove={removeImage}
                />

                <KegiatanKategoriField value={form.kategoriId} options={kategoriList} onChange={handleChange} />

                <KegiatanJadwalFields startTime={form.startTime} endTime={form.endTime} onChange={handleChange} />

                <KegiatanDetailFields
                    title={form.title}
                    desc={form.desc}
                    location={form.location}
                    onChange={handleChange}
                />

                <KegiatanHargaRegistrasiFields
                    priceDisplay={form.priceDisplay}
                    registrationLink={form.registrationLink}
                    onChange={handleChange}
                />

                <KegiatanPenyelenggaraFields
                    departemenId={form.departemenId}
                    departemenList={departemenList}
                    organizerCustom={form.organizerCustom}
                    contactPerson={form.contactPerson}
                    onChange={handleChange}
                />

                <KegiatanOrganizerCustomField
                    value={form.organizerCustom}
                    departemenId={form.departemenId}
                    onChange={handleChange}
                />

                <KegiatanStatusField isPublished={form.isPublished} onChange={handleStatusChange} />

                <KegiatanSpeakersField
                    speakers={speakers}
                    speakerInput={speakerInput}
                    onInputChange={setSpeakerInput}
                    onAdd={addSpeaker}
                    onRemove={removeSpeaker}
                />

                <KegiatanFormActions
                    loading={loading}
                    disabled={loading || !form.periodeId}
                    isEditMode={isEditMode}
                    onCancel={goBack}
                />
            </form>
        </section>
    );
}