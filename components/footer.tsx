import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { GithubIcon, GitlabIcon, CodeIcon, HashIcon, TrophyIcon, MailIcon } from "./icons";

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
    <footer className="py-10 border-t border-border">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
          {/* Brand */}
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span>🦀</span>
            Built with passion for systems programming
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-2">
            {footerLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
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
                  <span className="text-xs">{link.name}</span>
                </a>
              </Button>
            ))}
          </div>

          <Separator className="max-w-xs" />

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © 2025 Kushal Meghani
          </p>
        </div>
      </div>
    </footer>
  );
}
