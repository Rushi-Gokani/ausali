import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const publicDir = process.argv[2] || 'public';
const b64 = readFileSync(join(publicDir, 'icon-512.png')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <title>AUSALI Solutions</title>
  <image href="data:image/png;base64,${b64}" width="512" height="512"/>
</svg>
`;

writeFileSync(join(publicDir, 'favicon.svg'), svg, 'utf8');
console.log('favicon.svg successfully written, length:', svg.length);
