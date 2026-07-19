import { useState, useEffect, useRef } from "react";
import axiosPublic from "@/lib/axiosPublic";
import axios from "axios";

export type FormStatus = "idle" | "loading" | "success" | "error";

export interface ContactFormData {
  nama: string;
  email: string;
  subjek: string;
  pesan: string;
}

const initialForm: ContactFormData = {
  nama: "",
  email: "",
  subjek: "",
  pesan: "",
};

export function useContactForm() {
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-dismiss success banner setelah 6 detik
  useEffect(() => {
    if (status === "success") {
      successTimerRef.current = setTimeout(() => {
        setStatus("idle");
      }, 6000);
    }
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      await axiosPublic.post("/contact", {
        nama: form.nama.trim(),
        email: form.email.trim(),
        subjek: form.subjek.trim(),
        pesan: form.pesan.trim(),
      });

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      const msg = (axios.isAxiosError(err) && err.response?.data?.message) || "Gagal mengirim pesan. Periksa koneksi dan coba lagi.";
      setErrorMsg(msg);
      setStatus("error");
    }
  };

  return { form, status, errorMsg, handleChange, handleSubmit };
}
