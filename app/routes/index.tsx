import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { ProjectsSection } from "@/components/projects-section";
import { QuoteSection } from "@/components/quote-section";
import { Footer } from "@/components/footer";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <QuoteSection />
      </main>
      <Footer />
    </>
  );
}
