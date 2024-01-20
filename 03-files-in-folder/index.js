const fs = require('fs/promises');
const path = require('path');
async function readFolderContent(folderPath) {
  try {
    const files = await fs.readdir(folderPath, { withFileTypes: true });
    // console.log(`Список файлів у папці ${folderPath}:`);
    for (const file of files) {
      const filePath = path.join(folderPath, file.name);
      const stats = await fs.stat(filePath);

      if (file.isFile()) {
        const fileName = path.parse(file.name).name;
        const fileExtension = path.extname(file.name).slice(1);
        const fileSize = stats.size;
        console.log(`${fileName} - ${fileExtension} - ${fileSize} byte`);
      }
    }
  } catch (err) {
    console.error(`Помилка при читанні папки ${folderPath}:`, err);
  }
}

const folderPath = path.join(__dirname, './secret-folder');
readFolderContent(folderPath);
