const socialLinks = [
  {
    name: "X",
    href: "https://x.com/Kushal1644",
  },
  {
    name: "GitHub",
    href: "https://github.com/KushalMeghani1644",
  },
  {
    name: "GitLab",
    href: "https://gitlab.com/KushalMeghani1644",
  },
  {
    name: "Email",
    href: "mailto:kushalmeghani108@gmail.com",
  },
  {
    name: "Dev.to",
    href: "https://dev.to/kushalmeghani1644",
  },
  {
    name: "Hashnode",
    href: "https://hashnode.com/@kushalmeghani",
  },
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/KushalMeghani1644/",
  },
]

export function HeroSection() {
  return (
    <section className="pt-24">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Kushal Meghani
          </h1>

          <p className="text-xl text-muted-foreground sm:text-2xl">
            Systems Programmer and Rust Enthusiast
          </p>

          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
            I love coding in Rust, and making bare-metal projects! I am an AI
            nerd who loves deep-diving into modern tools. Along with that I am
            also a Linux nerd always experimenting with new tools and am still
            learning deep Linux internals.
          </p>

          <div className="pt-2">
            <p className="text-sm font-medium text-foreground">Socials</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
