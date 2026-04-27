"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        },
      );
    } finally {
      router.push("/login");
      router.refresh();
      setIsLoading(false);
    }
  }

  return (
    <button className="button button--ghost" onClick={handleLogout} type="button">
      {isLoading ? "Signing out..." : "Log out"}
    </button>
  );
}
