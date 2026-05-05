import {
  CodeIcon,
  GithubIcon,
  GitlabIcon,
  HashIcon,
  MailIcon,
  TrophyIcon,
  XIcon,
} from "./icons"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const footerLinks = [
  {
    name: "X",
    href: "https://x.com/Kushal1644",
    icon: XIcon,
  },
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
  {
    name: "Email",
    href: "mailto:kushalmeghani108@gmail.com",
    icon: MailIcon,
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-primary">Get in touch</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Always happy to talk Rust, firmware, boot flows, and security
              research.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <a href="mailto:kushalmeghani108@gmail.com">Email me</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://github.com/KushalMeghani1644"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow on GitHub
                </a>
              </Button>
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Elsewhere
            </p>
            <div className="grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
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
                    <span className="text-xs">{link.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <span>© 2025 Kushal Meghani</span>
          <span className="font-mono tracking-widest">
            Built with TanStack Start
          </span>
        </div>
      </div>
    </footer>
  )
}
