import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  { label: "Daily driver", value: "Fedora" },
  { label: "Editor", value: "Vim / Neovim" },
];

export function AboutSection() {
  return (
    <section id="about" className="py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-10 flex flex-col items-start gap-2">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            About Me
          </h2>
          <p className="max-w-3xl text-base text-muted-foreground leading-relaxed">
            I care about reliability, performance, and clean low-level abstractions.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <Card className="h-full">
            <CardHeader className="border-b border-border/70">
              <CardTitle className="text-primary">Background</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                I&apos;m passionate about{" "}
                <strong className="text-foreground">Rust</strong>,{" "}
                <strong className="text-foreground">systems programming</strong>, and{" "}
                <strong className="text-foreground">hardware security research</strong>.
                My expertise spans UEFI bootloaders, memory management, RowHammer
                detection, and bare-metal development.
              </p>
              <p>
                I&apos;m a <strong className="text-foreground">Fedora Linux</strong> daily
                driver who has compiled an operating system from source.
                Currently mastering <strong className="text-foreground">VIM</strong>
                and <strong className="text-foreground">Neovim</strong>.
              </p>
              <p>
                I&apos;m an active{" "}
                <strong className="text-foreground">open-source contributor</strong>. I
                contribute to projects like{" "}
                <a
                  href="https://github.com/rust-embedded/riscv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline underline-offset-4"
                >
                  rust-embedded/riscv
                </a>{" "}
                and{" "}
                <a
                  href="https://github.com/tauri-apps/tauri"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline underline-offset-4"
                >
                  Tauri
                </a>
                , helping improve Rust tooling and systems-focused developer
                experiences.
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="border-b border-border/70">
              <CardTitle className="text-primary">Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-3">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 border border-border bg-background/40 px-3 py-2"
                  >
                    <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      {item.label}
                    </span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="mt-6 border border-border bg-background/40 p-3">
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  What I build
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Memory-safe tools, firmware/boot pieces, and security research utilities.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
