import { ArrowRightIcon, CircuitIcon, CpuIcon, LayersIcon } from "./icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
]

export function ProjectsSection() {
  return (
    <section id="projects" className="relative py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-220px] top-10 h-[440px] w-[440px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="space-y-2">
            <p className="font-mono text-xs tracking-widest text-primary uppercase">
              My Work
            </p>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Featured Projects
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              A few focused builds around boot flows, embedded targets, and
              low-level Rust.
            </p>
          </div>

          <div className="hidden sm:block">
            <Button asChild variant="outline" size="sm">
              <a
                href="https://github.com/KushalMeghani1644"
                target="_blank"
                rel="noopener noreferrer"
              >
                More on GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <a
              key={project.title}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <Card className="h-full transition-all hover:ring-2 hover:ring-primary/40 hover:-translate-y-0.5">
                <CardHeader>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex size-10 items-center justify-center border border-border bg-background/50">
                      <project.icon className="size-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      featured
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="font-mono text-[10px]"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <span className="text-xs text-muted-foreground">
                    Case study
                  </span>
                  <span className="flex items-center gap-1 text-xs text-primary font-medium">
                    View
                    <ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardFooter>
              </Card>
            </a>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Button asChild variant="outline" size="sm" className="w-full">
            <a
              href="https://github.com/KushalMeghani1644"
              target="_blank"
              rel="noopener noreferrer"
            >
              More on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
