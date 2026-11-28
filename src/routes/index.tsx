import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DATA } from "../data";
import { DitherDeathStar } from "@/components/dithercn/dither-death-star";
import { DitherStars } from "@/components/dithercn/dither-stars";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [displayedName, setDisplayedName] = useState("");
  const fullName = DATA.name;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    // Wait a brief moment for the container's fade-up animation to run
    const timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        if (i <= fullName.length) {
          setDisplayedName(fullName.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 100);
    }, 500);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [fullName]);

  return (
    <div className="relative min-h-screen bg-black text-white flex justify-center p-6 pt-14 md:pt-20 font-mono">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <DitherStars className="absolute inset-0" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(52vh,480px)] overflow-hidden"
      >
        <DitherDeathStar className="absolute inset-0" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(480px 190px at 49% 33%, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.38) 62%, transparent 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

        <div className="relative z-10 w-full max-w-xl flex flex-col gap-12 animate-fade-up pb-20">
          
          <header className="flex flex-col gap-4">
          <h1 
            className="text-3xl font-normal tracking-wide flex items-end gap-3 leading-none"
            style={{ fontFamily: "'VT323', monospace", textShadow: "0 2px 18px rgba(0,0,0,0.9)" }}
          >
            <span>{displayedName}</span> <span className="text-[0.8em] mb-1">█</span>
          </h1>
          <div className="h-px bg-white/20 w-full" />
          <p className="text-sm text-white/75 leading-relaxed text-left" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.9)" }}>
            {DATA.bio}
          </p>
        </header>

        <section id="projects" className="w-full flex flex-col gap-3 scroll-mt-24">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Projects</h2>
            <p className="text-xs text-white/50">Things I am building and maintaining</p>
          </div>
          <div className="flex flex-col border border-white/10 p-1">
            {DATA.projects.map(p => (
              <a 
                key={p.name} 
                href={p.href} 
                target="_blank" 
                rel="noreferrer" 
                className="group flex flex-col gap-2 text-xs p-3 hover:!bg-white hover:!text-black transition-colors"
              >
                <div className="flex justify-between items-center uppercase tracking-widest">
                  <span className="font-bold">{p.name}</span>
                  <span className="tracking-normal opacity-50 transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
                </div>
                <span className="text-white/60 group-hover:!text-black/70 leading-relaxed text-left normal-case tracking-normal">
                  {p.description}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section id="focus" className="w-full flex flex-col gap-3 scroll-mt-24">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Focus</h2>
            <p className="text-xs text-white/50">A few things which I love learning and working on</p>
          </div>
          <div className="flex flex-col border border-white/10 p-1">
            {DATA.focus.map(f => (
              <div 
                key={f.title} 
                className="flex flex-col gap-2 text-xs p-3"
              >
                <span className="font-bold uppercase tracking-widest text-white">{f.title}</span>
                <span className="text-white/60 leading-relaxed text-left normal-case tracking-normal">
                  {f.description}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section id="stack" className="w-full flex flex-col gap-3 scroll-mt-24">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Stack</h2>
            <p className="text-xs text-white/50">The tools and languages I love coding with</p>
          </div>
          <div className="flex flex-wrap gap-2 border border-white/10 p-2">
            {DATA.stack.map(s => (
              <a 
                key={s.name} 
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs p-2 border border-white/10 bg-white/5 hover:!bg-white hover:!text-black transition-colors uppercase tracking-widest"
              >
                {s.icon}
                <span>{s.name}</span>
              </a>
            ))}
          </div>
        </section>

        <section id="socials" className="w-full flex flex-col gap-3 scroll-mt-24">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Socials</h2>
            <p className="text-xs text-white/50">The best way to reach out to me is X and Email.</p>
          </div>
          <div className="flex flex-col border border-white/10 p-1">
            {DATA.socials.map(s => (
              <a 
                key={s.name} 
                href={s.href} 
                target="_blank" 
                rel="noreferrer" 
                className="group flex justify-between items-center text-xs p-3 hover:!bg-white hover:!text-black transition-colors uppercase tracking-widest"
              >
                <div className="flex items-center gap-2">
                  {s.icon}
                  <span>{s.name}</span>
                </div>
                <span className="tracking-normal opacity-50 transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
