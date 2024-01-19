const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, './text.txt');

fs.promises
  .readFile(filePath, 'utf8')
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error(err);
  });
