const fs = require('fs');
const files = fs.readdirSync('icons').filter(f => f.endsWith('.svg'));
let out = '';
for (const f of files) {
  let content = fs.readFileSync('icons/' + f, 'utf8');
  content = content.replace(/fill="[^"]*"/g, 'fill="currentColor"');
  content = content.replace(/xmlns="[^"]*"/g, '');
  content = content.replace(/<title>.*?<\/title>/g, '');
  content = content.replace(/role="img" /g, '');
  content = content.replace(/<svg /, '<svg className="w-4 h-4" ');
  out += `${f.replace('.svg', '')}: \`${content.trim()}\`\n`;
}
fs.writeFileSync('icons.json', JSON.stringify(out));
