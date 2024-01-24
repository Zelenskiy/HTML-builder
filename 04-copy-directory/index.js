const fs = require('fs/promises');
const path = require('path');

async function removeDirContents(directory) {
  const files = await fs.readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const fileStat = await fs.stat(filePath);

    if (fileStat.isDirectory()) {
      await removeDirContents(filePath);
      await fs.rmdir(filePath);
    } else {
      await fs.unlink(filePath);
    }
  }
}

async function copyDir(sourceFolder, destinationFolder) {
  try {

    const destinationFolderExists = await fs.access(destinationFolder)
      .then(() => true)
      .catch(() => false);

    if (destinationFolderExists) {
      await removeDirContents(destinationFolder);
    }

    await fs.mkdir(destinationFolder, { recursive: true });

    const files = await fs.readdir(sourceFolder);

    for (const file of files) {
      const sourceFilePath = path.join(sourceFolder, file);
      const destinationFilePath = path.join(destinationFolder, file);

      const fileStat = await fs.stat(sourceFilePath);

      if (fileStat.isDirectory()) {
        await copyDir(sourceFilePath, destinationFilePath);
      } else {
        await fs.copyFile(sourceFilePath, destinationFilePath);
      }
    }

    console.log('Directory copied successfully!');
  } catch (err) {
    console.error('Error copying directory:', err);
  }
}

const sourceFolder = path.join(__dirname, 'files');
const destinationFolder = path.join(__dirname, 'files-copy');

copyDir(sourceFolder, destinationFolder);
