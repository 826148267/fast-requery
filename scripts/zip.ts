import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import archiver from 'archiver';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const output = fs.createWriteStream(path.join(__dirname, '../dist.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  process.stdout.write('Extension has been zipped successfully!\n');
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory('dist/', false);
archive.finalize();
