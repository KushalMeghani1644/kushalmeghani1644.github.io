"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MenuIcon } from "./icons";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
];

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="#" className="flex items-center gap-2">
          <span className="inline-flex size-9 items-center justify-center border border-border bg-card font-mono text-xs font-semibold tracking-wider text-primary">
            KM
          </span>
          <span className="hidden sm:block text-xs font-medium text-muted-foreground">
            systems programmer
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <Link
                href={item.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            </Button>
          ))}

          <Badge variant="outline" className="border-primary/30 text-primary">
            open-source
          </Badge>

          <Button asChild size="sm" className="ml-2">
            <a href="mailto:kushalmeghani108@gmail.com">Contact</a>
          </Button>
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon-sm" aria-label="Open menu">
                <MenuIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="mailto:kushalmeghani108@gmail.com">Contact</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
