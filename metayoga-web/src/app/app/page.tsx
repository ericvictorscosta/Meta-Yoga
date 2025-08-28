"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";

export default function AppHome() {
  const [email, setEmail] = useState<string|null>(null);

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      setEmail(u?.email ?? null);
    });
    return () => unsub();
  }, []);

  if (!email) {
    return (
      <main className="p-6">
        <p>Você não está logado.</p>
        <Link className="underline" href="/login">Ir para login</Link>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Meta Yoga</h1>
      <p>Bem-vindo, {email}.</p>
      <button
        onClick={()=>signOut(auth)}
        className="rounded bg-black text-white px-3 py-2"
      >
        Sair
      </button>
    </main>
  );
}
