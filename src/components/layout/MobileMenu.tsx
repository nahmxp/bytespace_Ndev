"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "./NavLinks";
import { LogoutButton } from "./LogoutButton";
import type { SessionUser } from "@/lib/types";

export function MobileMenu({ user }: { user: SessionUser | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const item = "block rounded-xl px-4 py-3 text-lg text-white hover:bg-white/10";

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="on-blue grid h-11 w-11 place-items-center rounded-full text-white hover:bg-white/10"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="on-blue absolute inset-x-4 top-[88px] z-50 rounded-3xl bg-brand-dark/95 p-3 shadow-float ring-1 ring-white/20 backdrop-blur"
        >
          {NAV_ITEMS.map((n) => (
            <Link key={n.label} href={n.href} className={item}>
              {n.label}
            </Link>
          ))}
          <div className="my-2 h-px bg-white/15" />
          {user ? (
            <>
              <p className="px-4 py-2 text-sm text-white/70">Signed in as {user.name}</p>
              <LogoutButton className={`${item} w-full text-left`} />
            </>
          ) : (
            <>
              <Link href="/login" className={item}>
                Sign In
              </Link>
              <Link href="/signup" className="mt-1 block rounded-full bg-lime px-4 py-3 text-center text-lg text-ink">
                Join Us
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
