import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getSession } from "@/lib/auth";
import { Logo } from "@/components/ui/Logo";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";
import { LogoutButton } from "./LogoutButton";

/** Transparent, white-on-blue navigation. Always rendered on top of a `.bg-grid` section. */
export async function Navbar() {
  const user = await getSession().catch(() => null);
  const link = "text-base text-white/80 transition-colors hover:text-white";

  return (
    <header className="on-blue relative z-30">
      <div className="mx-auto grid h-[88px] max-w-page grid-cols-[1fr_auto] items-center px-5 md:h-[120px] md:grid-cols-[1fr_auto_1fr]">
        <Logo />
        <NavLinks className="hidden md:flex" />
        <div className="hidden items-center justify-end gap-6 md:flex">
          {user ? (
            <>
              <span className="max-w-[160px] truncate text-base text-white/90" title={user.email}>
                Hi, {user.name.split(" ")[0]}
              </span>
              <LogoutButton className={link} />
            </>
          ) : (
            <>
              <Link href="/login" className={link}>
                Sign In
              </Link>
              <Link href="/signup" className={link}>
                Join Us
              </Link>
            </>
          )}
          <Link href="/courses" aria-label="Browse courses" className="text-white transition-opacity hover:opacity-80">
            <ShoppingBag size={22} strokeWidth={1.75} />
          </Link>
        </div>
        <div className="flex justify-end md:hidden">
          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  );
}
