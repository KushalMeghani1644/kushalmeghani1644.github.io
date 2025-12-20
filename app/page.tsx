import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { QuoteSection } from "@/components/quote-section";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px w-full bg-border/60" />
      </div>

      <AboutSection />

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px w-full bg-border/60" />
      </div>

      <ProjectsSection />
      <QuoteSection />
      <Footer />
    </main>
  );
}
