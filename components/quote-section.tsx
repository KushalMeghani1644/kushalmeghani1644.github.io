import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function QuoteSection() {
  return (
    <section className="relative py-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[260px] w-[680px] -translate-x-1/2 bg-primary/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <Card>
          <CardContent className="px-6 py-10 text-center sm:px-10">
            <div className="mb-4 flex justify-center">
              <Badge variant="outline" className="font-mono text-[10px] tracking-widest">
                philosophy
              </Badge>
            </div>

            <blockquote className="text-lg font-medium leading-snug text-foreground sm:text-xl">
              &ldquo;I turn low-level complexity into reliable, safe, and efficient Rust
              solutions.&rdquo;
            </blockquote>
            <p className="mt-4 text-xs text-muted-foreground">
              Build for correctness. Optimize with intent.
            </p>
            <cite className="mt-4 block text-sm text-primary font-medium not-italic">
              — Kushal Meghani
            </cite>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

