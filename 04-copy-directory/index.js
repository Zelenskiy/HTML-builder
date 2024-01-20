const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  const sourceFolder = path.join(__dirname, 'files');
  const destinationFolder = path.join(__dirname, 'files-copy');

  try {
    // Create the destination folder if it does not exist
    await fs.mkdir(destinationFolder, { recursive: true });

    // Read the contents of the source folder
    const files = await fs.readdir(sourceFolder);

    // Copy each file from the source folder to the destination folder
    for (const file of files) {
      const sourceFilePath = path.join(sourceFolder, file);
      const destinationFilePath = path.join(destinationFolder, file);

      // Use fs.copyFile to copy individual files
      await fs.copyFile(sourceFilePath, destinationFilePath);
    }

    console.log('Directory copied successfully!');
  } catch (err) {
    console.error('Error copying directory:', err);
  }
}

copyDir();
