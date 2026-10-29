import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}
const files = walk('dist').filter((f) => f.endsWith('.html'));
const broken = [];
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    const url = match[1];
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    const path = join('dist', decodeURI(url.split('?')[0]));
    if (!existsSync(path) && !existsSync(join(path, 'index.html')))
      broken.push(`${file} -> ${url}`);
  }
}
if (broken.length) {
  console.error(broken.join('\n'));
  process.exit(1);
}
console.log(`PASS: local asset and page links in ${files.length} HTML files.`);
