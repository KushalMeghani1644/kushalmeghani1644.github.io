import {
  CodeIcon,
  GithubIcon,
  GitlabIcon,
  HashIcon,
  MailIcon,
  TrophyIcon,
} from "./icons"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const skills = [
  "Rust",
  "C/C++",
  "UEFI",
  "RISC-V",
  "Bare-Metal",
  "OS Dev",
  "Memory Safety",
  "Hardware Security",
]

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/KushalMeghani1644",
    icon: GithubIcon,
  },
  {
    name: "GitLab",
    href: "https://gitlab.com/KushalMeghani1644",
    icon: GitlabIcon,
  },
  {
    name: "Email",
    href: "mailto:kushalmeghani108@gmail.com",
    icon: MailIcon,
  },
  {
    name: "Dev.to",
    href: "https://dev.to/kushalmeghani1644",
    icon: CodeIcon,
  },
  {
    name: "Hashnode",
    href: "https://hashnode.com/@kushalmeghani",
    icon: HashIcon,
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/KushalMeghani1644/",
    icon: TrophyIcon,
  },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -top-24 right-[-120px] h-[360px] w-[360px] rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-[1fr_320px]">
        <div className="relative space-y-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/35 text-primary">
              <span className="mr-2 size-2 rounded-full bg-primary animate-pulse" />
              Hello, I&apos;m
            </Badge>
            <Badge variant="secondary" className="font-mono">
              available for collaboration
            </Badge>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Kushal Meghani
          </h1>

          <p className="text-xl font-medium text-muted-foreground sm:text-2xl">
            Systems Programmer <span className="text-primary">&amp;</span> Rust
            Enthusiast
          </p>

          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            I specialize in{" "}
            <strong className="text-foreground">low-level development</strong>,{" "}
            <strong className="text-foreground">bare-metal programming</strong>,{" "}
            <strong className="text-foreground">OS development</strong>, and{" "}
            <strong className="text-foreground">hardware security</strong>. I
            build memory-safe tools, UEFI bootloaders, and security research
            utilities, contributing actively to open-source ecosystems.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <a href="#projects">View Projects</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="mailto:kushalmeghani108@gmail.com">Let&apos;s Talk</a>
            </Button>
          </div>

          <div className="pt-4">
            <p className="mb-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Stack & focus
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="font-mono text-xs"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <Card className="sticky top-24">
            <CardHeader className="border-b">
              <CardTitle className="text-primary">Links</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-2">
                {socialLinks.map((link) => (
                  <Button
                    key={link.name}
                    variant="outline"
                    size="sm"
                    asChild
                    className="justify-start"
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <link.icon className="size-4" />
                      <span>{link.name}</span>
                    </a>
                  </Button>
                ))}
              </div>

              <div className="mt-4 rounded-none border border-border bg-background/60 p-3">
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Current interests
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  UEFI boot flows, RISC-V kernels, memory safety, fuzzing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
