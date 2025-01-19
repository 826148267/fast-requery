const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, '../dist.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  console.log('Extension has been zipped successfully!');
});

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory('dist/', false);
archive.finalize(); 