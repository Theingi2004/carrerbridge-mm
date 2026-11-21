
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { isDemoMode } from "@/lib/demo-mode";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = async () => {
    setIsLoading(true);
    setErrorMessage("");

    // DEMO MODE LOGOUT
    if (isDemoMode) {
      document.cookie =
        "careerbridge_demo_session=; path=/; max-age=0; SameSite=Lax";

      document.cookie =
        "careerbridge_demo_role=; path=/; max-age=0; SameSite=Lax";

      setIsLoading(false);
      router.replace("/login");
      router.refresh();
      return;
    }

    // REAL SUPABASE LOGOUT
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.replace("/login");
    router.refresh();
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoading}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-primary/90 active:scale-95 disabled:opacity-60"
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <LogOut size={18} />
        )}

        {isLoading ? "Logging out..." : "Logout"}
      </button>

      {errorMessage && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
