import { useContactForm } from "../../../../hooks/useContactForm";
import { SuccessBanner } from "./SuccessBanner";
import { ErrorBanner } from "./ErrorBanner";
import { FormField } from "./FormField";
import { SubmitButton } from "./SubmitButton";

export default function FormUser() {
    const { form, status, errorMsg, handleChange, handleSubmit } = useContactForm();

    return (
        <section className="lg:col-span-5 bg-[#20201f] border border-[#ffd700] p-5 sm:p-8 static lg:sticky lg:top-24 transform transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]">
            <h2 className="text-lg sm:text-xl font-bold font-['Montserrat'] text-[#e5e2e1] mb-4 sm:mb-6 flex items-center gap-2">
                Kirim Pesan
            </h2>
            <div className="flex flex-col gap-3 sm:gap-4">
                {status === "success" && <SuccessBanner />}
                {status === "error" && <ErrorBanner message={errorMsg} />}

                <FormField
                    label="Nama Lengkap"
                    name="nama"
                    placeholder="Masukkan nama Anda"
                    value={form.nama}
                    disabled={status === "loading"}
                    onChange={handleChange}
                />

                <FormField
                    label="Alamat Email"
                    name="email"
                    type="email"
                    placeholder="contoh@email.com"
                    value={form.email}
                    disabled={status === "loading"}
                    onChange={handleChange}
                />

                <FormField
                    label="Subjek"
                    name="subjek"
                    placeholder="Tujuan pesan"
                    value={form.subjek}
                    disabled={status === "loading"}
                    onChange={handleChange}
                />

                <FormField
                    label="Pesan"
                    name="pesan"
                    placeholder="Tuliskan pesan Anda di sini..."
                    value={form.pesan}
                    disabled={status === "loading"}
                    onChange={handleChange}
                    multiline
                    rows={5}
                />

                <SubmitButton loading={status === "loading"} onClick={handleSubmit} />
            </div>
        </section>
    );
}