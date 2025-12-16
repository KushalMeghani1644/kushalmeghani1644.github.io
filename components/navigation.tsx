"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="#" className="text-lg font-bold text-primary">
          KM
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="#about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="#projects"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <Button asChild size="sm">
            <a href="mailto:kushalmeghani108@gmail.com">Contact</a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
