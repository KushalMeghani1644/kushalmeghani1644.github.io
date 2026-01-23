import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  CodeIcon,
  GithubIcon,
  GitlabIcon,
  HashIcon,
  MailIcon,
  TrophyIcon,
} from "./icons";

const footerLinks = [
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
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto max-w-5xl px-6">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-primary">Get in touch</CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Always happy to talk Rust, firmware, boot flows, and security research.
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
              <span className="font-mono tracking-widest">built with tanstack start</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </footer>
  );
}
