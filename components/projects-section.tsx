import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LayersIcon, CircuitIcon, CpuIcon, ArrowRightIcon } from "./icons";

const projects = [
  {
    title: "RustyBoot",
    description:
      "A memory-safe, high-performance UEFI bootloader written in Rust with advanced boot features.",
    tech: ["Rust", "UEFI", "no_std"],
    href: "https://github.com/KushalMeghani1644/RustyBoot",
    icon: LayersIcon,
  },
  {
    title: "RustBerry-PI",
    description:
      "A Raspberry Pi inspired virtual hardware board implementation in Rust for embedded systems experimentation.",
    tech: ["Rust", "Embedded", "Virtual HW"],
    href: "https://github.com/KushalMeghani1644/RustBerry-PI",
    icon: CircuitIcon,
  },
  {
    title: "RustyBoot-RISCV",
    description:
      "A minimalist RISC-V bootloader written in Rust, featuring UART support and ELF kernel loading capabilities.",
    tech: ["Rust", "RISC-V", "Bootloader"],
    href: "https://github.com/KushalMeghani1644/RustyBoot-RISCV",
    icon: CpuIcon,
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12 space-y-2">
          <p className="font-mono text-xs text-primary tracking-widest uppercase">
            My Work
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Featured Projects
          </h2>
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="h-full transition-all hover:ring-primary/50 hover:ring-2">
                <CardHeader>
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center mb-3">
                    <project.icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="secondary" className="font-mono text-[10px]">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="flex items-center gap-1 text-xs text-primary font-medium">
                    View Project
                    <ArrowRightIcon className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardFooter>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
