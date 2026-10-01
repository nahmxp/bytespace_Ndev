import { Hero } from "@/components/home/Hero";
import { LogoStrip } from "@/components/home/LogoStrip";
import { Discover } from "@/components/home/Discover";
import { LearningPaths } from "@/components/home/LearningPaths";
import { Growth } from "@/components/home/Growth";
import { CreatorTools } from "@/components/home/CreatorTools";
import { CreatorBanner } from "@/components/home/CreatorBanner";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { getCourses, getTestimonials } from "@/lib/courses";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ courses, total }, testimonials] = await Promise.all([
    getCourses({ category: "featured", limit: 6 }),
    getTestimonials(),
  ]);

  return (
    <main>
      <Hero />
      <LogoStrip />
      <Discover courses={courses} total={total} />
      <LearningPaths />
      <div className="wash">
        <Growth />
        <CreatorTools />
      </div>
      <CreatorBanner />
      <Testimonials items={testimonials} />
      <Footer />
    </main>
  );
}
