const fs = require('fs');

const iconsStr = fs.readFileSync('icons.json', 'utf8');
const iconsRaw = JSON.parse(iconsStr);

const getIcon = (name) => {
  const line = iconsRaw.split('\n').find(l => l.startsWith(name + ':'));
  if (line) {
    return line.substring(line.indexOf('`') + 1, line.lastIndexOf('`'));
  }
  return '';
};

const go = getIcon('go');
const rust = getIcon('rust');
const linux = getIcon('linux');
const typescript = getIcon('typescript');
const react = getIcon('react');
const tanstack = getIcon('tanstack');
const ai = `<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`;

const stackCode = `  ],
  stack: [
    { name: "Go", icon: ${go} },
    { name: "Rust", icon: ${rust} },
    { name: "AI", icon: ${ai} },
    { name: "Linux", icon: ${linux} },
    { name: "Tanstack", icon: ${tanstack} },
    { name: "TypeScript", icon: ${typescript} },
    { name: "React", icon: ${react} }
  ]
};`;

let data = fs.readFileSync('src/data.tsx', 'utf8');
data = data.replace(/  \]\n\};\n?$/, stackCode + '\n');
fs.writeFileSync('src/data.tsx', data);
