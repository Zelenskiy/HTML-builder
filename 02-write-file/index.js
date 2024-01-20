const fs = require('fs').promises;
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, './output.txt');

const farewellMessage = 'Thank for use program. Good by!';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function askForInput() {
  try {
    const input = await new Promise((resolve) => {
      rl.question('Type text or "exit" for quit): ', resolve);
    });

    if (input.toLowerCase() === 'exit') {
      console.log(farewellMessage);
      rl.close();
      process.exit();
    }

    await fs.appendFile(filePath, input + '\n', 'utf8');
    console.log('The text is written to the file.');
    askForInput();
  } catch (err) {
    console.error('An error occurred:', err);
    rl.close();
    process.exit(1);
  }
}

(async () => {
  try {
    await fs.access(filePath, fs.constants.F_OK);
  } catch (err) {
    console.log('Create a new file:', filePath);
    await fs.writeFile(filePath, '', 'utf8');
  }

  console.log('Hello! Enter the text.');
  askForInput();
})();

rl.on('close', () => {
  console.log(farewellMessage);
  process.exit();
});
