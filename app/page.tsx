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
      <AboutSection />
      <ProjectsSection />
      <QuoteSection />
      <Footer />
    </main>
  );
}