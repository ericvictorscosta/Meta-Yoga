"use client";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { sendSignInLinkToEmail, ActionCodeSettings } from "firebase/auth";

const actionCodeSettings: ActionCodeSettings = {
  url: typeof window !== "undefined" ? `${window.location.origin}/auth` : "https://metayoga.site/auth",
  handleCodeInApp: true,
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErr("");
    try {
      await sendSignInLinkToEmail(auth, email.trim(), actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email.trim());
      setStatus("sent");
    } catch (e:any) {
      setStatus("error");
      setErr(e?.message ?? "Erro ao enviar link");
    }
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold mb-3">Entrar com e-mail da compra</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="seuemail@exemplo.com"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <button
          disabled={status==="sending"}
          className="w-full rounded bg-black text-white py-2"
        >
          {status==="sending" ? "Enviando..." : "Enviar link de acesso"}
        </button>
      </form>
      {status==="sent" && <p className="mt-3">Link enviado! Veja seu e-mail e clique para entrar.</p>}
      {status==="error" && <p className="mt-3 text-red-600">{err}</p>}
    </main>
  );
}
