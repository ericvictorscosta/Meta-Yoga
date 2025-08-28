"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("Validando link...");

  useEffect(() => {
    async function run() {
      try {
        if (isSignInWithEmailLink(auth, window.location.href)) {
          let email = window.localStorage.getItem("emailForSignIn") || "";
          if (!email) {
            email = window.prompt("Confirme o e-mail da compra:") || "";
          }
          const cred = await signInWithEmailLink(auth, email, window.location.href);
          window.localStorage.removeItem("emailForSignIn");
          // TODO: aqui depois verificaremos se este email tem compra válida no Firestore
          setMsg("Login concluído! Redirecionando...");
          router.replace("/app");
        } else {
          setMsg("Link inválido ou expirado.");
        }
      } catch (e:any) {
        setMsg(e?.message ?? "Falha ao autenticar.");
      }
    }
    run();
  }, [router]);

  return <main className="p-6">{msg}</main>;
}
