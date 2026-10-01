import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "./NewsletterForm";

const COLUMNS: { label: string; href: string }[][] = [
  [
    { label: "Featured Courses", href: "/courses?category=featured" },
    { label: "Featured Categories", href: "/#categories" },
    { label: "Business", href: "/courses?category=business" },
    { label: "IT", href: "/courses?category=it-software" },
    { label: "Design", href: "/courses?category=design" },
  ],
  [
    { label: "Development", href: "/courses?category=development" },
    { label: "Marketing", href: "/courses?category=marketing" },
    { label: "Photography", href: "/courses?category=photography" },
    { label: "Finance", href: "/courses?category=finance" },
    { label: "Sport", href: "/courses?category=sport" },
  ],
  [
    { label: "Become a Creator", href: "/signup" },
    { label: "Affiliate Program", href: "/#creators" },
    { label: "Contact", href: "mailto:hello@bytespace.example" },
    { label: "Help", href: "mailto:hello@bytespace.example" },
    { label: "About", href: "/#growth" },
  ],
];

export function Footer() {
  return (
    <footer className="border-t border-line/70 bg-white">
      <div className="mx-auto max-w-page px-5 pb-8 pt-14 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_620px]">
          <div>
            <Logo tone="dark" />
            <p className="mt-3.5 text-sm font-light text-ink">
              Stay up to date with our latest features and releases by joining our newsletter.
            </p>
            <NewsletterForm />
            <p className="mt-1 max-w-[460px] text-xs font-light leading-[1.6] text-ink">
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:pt-9">
            {COLUMNS.map((col, i) => (
              <ul key={i} className="space-y-3">
                {col.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm font-light text-ink hover:text-brand">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-xs font-light text-ink sm:flex-row sm:items-center sm:justify-between md:mt-24">
          <p>© {new Date().getFullYear()} ByteSpace. All rights reserved.</p>
          <ul className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookies Settings"].map((t) => (
              <li key={t}>
                <Link href="#" className="hover:text-brand">
                  {t}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
