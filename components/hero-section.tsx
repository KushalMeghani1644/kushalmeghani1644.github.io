import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GithubIcon, GitlabIcon, MailIcon, CodeIcon, HashIcon, TrophyIcon } from "./icons";

const skills = [
  "Rust",
  "C/C++",
  "UEFI",
  "RISC-V",
  "Bare-Metal",
  "OS Dev",
  "Memory Safety",
  "Hardware Security",
];

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
];

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center pt-20">
      <div className="max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="space-y-6">
          {/* Greeting badge */}
          <Badge variant="outline" className="text-primary border-primary/40">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2" />
            Hello, I&apos;m
          </Badge>

          {/* Name */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Kushal Meghani
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl font-medium text-muted-foreground">
            Systems Programmer <span className="text-primary">&amp;</span> Rust Enthusiast
          </p>

          {/* Intro */}
          <p className="text-base text-muted-foreground max-w-2xl leading-relaxed">
            I specialize in <strong className="text-foreground">low-level development</strong>,{" "}
            <strong className="text-foreground">bare-metal programming</strong>,{" "}
            <strong className="text-foreground">OS development</strong>, and{" "}
            <strong className="text-foreground">hardware security</strong>. I build memory-safe
            tools, UEFI bootloaders, and security research utilities, contributing
            actively to open-source ecosystems.
          </p>

          {/* Social links */}
          <div className="flex flex-wrap gap-2 pt-2">
            {socialLinks.map((link) => (
              <Button
                key={link.name}
                variant="outline"
                size="sm"
                asChild
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </a>
              </Button>
            ))}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="font-mono text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
