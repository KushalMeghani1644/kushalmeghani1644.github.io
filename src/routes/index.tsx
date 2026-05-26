import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { DATA } from "../data";

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
    <>
      <nav className="fixed top-0 w-full flex justify-center items-center py-4 px-6 bg-black/80 backdrop-blur-md border-b border-white/10 z-50 text-xs uppercase tracking-widest text-white/60 font-mono">
        <ul className="flex gap-6 sm:gap-10">
          <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
          <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
          <li><a href="#focus" className="hover:text-white transition-colors">Focus</a></li>
          <li><a href="#stack" className="hover:text-white transition-colors">Stack</a></li>
          <li><a href="#socials" className="hover:text-white transition-colors">Socials</a></li>
        </ul>
      </nav>

      <div className="min-h-screen bg-black text-white flex justify-center p-6 pt-24 md:pt-32 font-mono">
        <div className="w-full max-w-xl flex flex-col gap-12 animate-fade-up pb-20">
          
          <header className="flex flex-col gap-4">
          <h1 
            className="text-3xl font-normal tracking-wide flex items-end gap-3 leading-none"
            style={{ fontFamily: "'VT323', monospace" }}
          >
            <span>{displayedName}</span> <span className="text-[0.8em] mb-1">█</span>
          </h1>
          <div className="h-px bg-white/20 w-full" />
          <p className="text-sm text-white/60 leading-relaxed text-left">
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
                  <span className="opacity-50 transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
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
                <span className="opacity-50 transition-transform duration-300 group-hover:translate-x-1">-&gt;</span>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
    </>
  );
}
