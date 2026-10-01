import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <div className="bg-grid on-blue overflow-hidden text-white">
        <Navbar />
        <div className="mx-auto max-w-page px-5 pb-24 text-center md:pb-[110px]">
          <p
            aria-hidden="true"
            className="select-none bg-gradient-to-b from-lime from-30% to-lime/0 bg-clip-text font-display text-[clamp(150px,29vw,420px)] font-semibold leading-[0.85] text-transparent"
          >
            404
          </p>
          <h1 className="relative -mt-[clamp(40px,9vw,120px)] text-[34px] font-semibold leading-[1.15] md:text-[56px]">
            The page you are looking
            <br />
            for doesn&rsquo;t exist
          </h1>
          <p className="mt-8 text-base font-light text-white/90 md:text-lg">
            Try to use a correct url or go back to homepage to start again
          </p>
          <ButtonLink href="/" size="lg" className="mt-10">
            Back to Home
          </ButtonLink>
        </div>
      </div>
      <Footer />
    </>
  );
}
