import { Badge } from "@/components/ui/badge";

const mainFocus = [
  {
    title: "Bare metal",
    description: "I love understanding how computers work under the hood.",
  },
  {
    title: "Rust",
    description: "My primary language in which I can code well.",
  },
  {
    title: "Linux",
    description: "I like having control of my OS and do fun experiments on Linux.",
  },
  {
    title: "AI",
    description: "I am an AI nerd learning how it works under the hood!",
  },
];

const stack = [
  "Rust",
  "QEMU",
  "Linux (Fedora)",
  "TypeScript",
  "Bun",
  "Vercel",
  "AI",
];

export function AboutSection() {
  return (
    <section id="main-focus" className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            My Main Focus
          </h2>
        </div>

        <div className="mt-8 space-y-5">
          {mainFocus.map((item) => (
            <div key={item.title} className="space-y-2">
              <p className="font-mono text-[10px] tracking-widest text-primary uppercase">
                {item.title}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border/60 pt-6">
          <h3 className="text-sm font-medium text-primary">My Stack</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {stack.map((item) => (
              <Badge key={item} variant="secondary" className="font-mono text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
