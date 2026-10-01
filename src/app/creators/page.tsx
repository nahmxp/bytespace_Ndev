import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getCreators } from "@/lib/courses";

export const metadata: Metadata = { title: "Creators", description: "Meet the creators teaching on ByteSpace." };
export const dynamic = "force-dynamic";

export default async function CreatorsPage() {
  const creators = await getCreators();
  return (
    <>
      <div className="bg-grid on-blue pb-16 text-white md:pb-[72px]">
        <Navbar />
        <div className="mx-auto max-w-page px-5 pt-6 text-center md:pt-8">
          <h1 className="text-[34px] font-semibold md:text-[40px]">Meet Our Creators</h1>
          <p className="mx-auto mt-4 max-w-[640px] text-lg font-light text-white/90">
            Learn from designers, engineers and makers who share what they know, one course at a time.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-page px-5 pb-24 pt-12 md:pt-16">
        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((c) => (
            <li key={c.slug} className="min-w-0">
              <article className="relative h-full rounded-3xl border border-line bg-white p-6 transition-shadow focus-within:ring-2 focus-within:ring-brand hover:shadow-float">
                <div className="flex items-center gap-4">
                  <Image src={c.avatar} alt="" width={128} height={128} className="h-16 w-16 rounded-2xl object-cover" />
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-xl font-semibold">
                      <Link href={`/creators/${c.slug}`} className="outline-none after:absolute after:inset-0 after:rounded-3xl after:content-['']">
                        {c.name}
                      </Link>
                    </h2>
                    <p className="text-sm text-mute">Professional Creator</p>
                  </div>
                </div>
                <p className="mt-4 text-base leading-relaxed text-[#4b4c53]">{c.headline}</p>
                <p className="mt-5 flex gap-2 text-sm">
                  <span className="rounded-full bg-pill px-3.5 py-1.5">
                    <b className="font-medium text-brand">{c.products}</b> {c.products === 1 ? "Product" : "Products"}
                  </span>
                  <span className="rounded-full bg-pill px-3.5 py-1.5">
                    <b className="font-medium text-brand">{c.followers}</b> Followers
                  </span>
                </p>
              </article>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
