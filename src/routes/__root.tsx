/// <reference types="vite/client" />
import {
  HeadContent,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import type { ReactNode } from "react";
import appCss from "~/styles/globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kushal Meghani | Systems Programmer" },
      {
        name: "description",
        content:
          "Systems programmer & Rust enthusiast specializing in low-level development, bare-metal programming, OS development, and hardware security.",
      },
      { name: "robots", content: "index, follow" },
      { name: "author", content: "Kushal Meghani" },
      { name: "theme-color", content: "#1a1612" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "canonical", href: "https://kushalmeghani.dev" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased min-h-screen">
        {children}
        <Analytics />
        <SpeedInsights />
        <Scripts />
      </body>
    </html>
  );
}
