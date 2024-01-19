const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './text.txt');

const stream = new fs.ReadStream(filePath, { encoding: 'utf8' });

let data = '';

stream.on('data', (chunk) => {
  data += chunk;
});

stream.on('end', () => {
  console.log(data);
});

stream.on('error', (err) => {
  console.error(err);
});
