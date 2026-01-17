"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 text-slate-500 hover:text-red-400 transition-colors text-sm font-bold w-full px-4 py-2"
    >
      <LogOut size={18} />
      {loading ? "Saindo..." : "Sair"}
    </button>
  );
}