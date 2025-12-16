import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12 space-y-2">
          <p className="font-mono text-xs text-primary tracking-widest uppercase">
            Get to know me
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            About Me
          </h2>
        </div>

        {/* About card */}
        <Card>
          <CardHeader className="border-b border-primary/20">
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
              I&apos;m a{" "}
              <strong className="text-foreground">Fedora Linux</strong> daily driver
              and <strong className="text-foreground">Gentoo</strong> (in VM)
              tinkerer who has compiled an operating system from source. Currently
              mastering <strong className="text-foreground">VIM</strong> and{" "}
              <strong className="text-foreground">Neovim</strong>, and learning{" "}
              <strong className="text-foreground">Zig</strong>.
            </p>
            <p>
              I&apos;m an active{" "}
              <strong className="text-foreground">open-source contributor</strong>. I
              contribute to the{" "}
              <a
                href="https://github.com/rust-embedded/riscv"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-4"
              >
                rust-embedded/riscv
              </a>{" "}
              project, helping improve Rust&apos;s embedded ecosystem for RISC-V
              architectures. I also contribute to{" "}
              <a
                href="https://github.com/tauri-apps/tauri"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline underline-offset-4"
              >
                Tauri
              </a>
              , the Rust-based framework for building lightweight, secure desktop
              applications.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
