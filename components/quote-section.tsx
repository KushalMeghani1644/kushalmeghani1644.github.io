import { Card, CardContent } from "@/components/ui/card";

export function QuoteSection() {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto px-6">
        <Card>
          <CardContent className="py-10 px-8 text-center">
            <blockquote className="text-lg sm:text-xl font-medium text-foreground mb-4">
              &ldquo;I turn low-level complexity into reliable, safe, and efficient Rust
              solutions.&rdquo;
            </blockquote>
            <cite className="text-sm text-primary font-medium not-italic">
              — Kushal Meghani
            </cite>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
