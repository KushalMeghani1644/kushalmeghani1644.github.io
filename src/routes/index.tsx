import { createFileRoute } from "@tanstack/react-router";
import { DATA } from "../data";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [displayedName, setDisplayedName] = useState("");
  const fullName = DATA.name;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    // Wait a brief moment for the container's fade-up animation to run
    timeout = setTimeout(() => {
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-mono">
      <div className="w-full max-w-[380px] flex flex-col gap-10 animate-fade-up">
        
        <header className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold uppercase tracking-widest flex items-center gap-3">
            {displayedName} <span>█</span>
          </h1>
          <div className="h-px bg-white/20 w-full" />
          <p className="text-xs text-white/60 leading-relaxed text-justify">
            {DATA.bio}
          </p>
        </header>

        <section className="w-full flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Socials</h2>
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

        <section className="w-full flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Projects</h2>
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
                <span className="text-white/60 group-hover:!text-black/70 leading-relaxed text-justify normal-case tracking-normal">
                  {p.description}
                </span>
              </a>
            ))}
          </div>
        </section>
        <section className="w-full flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Stack</h2>
          <div className="flex flex-wrap gap-2 border border-white/10 p-2">
            {DATA.stack.map(s => (
              <div 
                key={s.name} 
                className="flex items-center gap-2 text-xs p-2 border border-white/10 bg-white/5 hover:!bg-white hover:!text-black transition-colors uppercase tracking-widest cursor-default"
              >
                {s.icon}
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
