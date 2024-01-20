const fs = require('fs/promises');
const path = require('path');

async function buildCSSBundle() {
  try {
    const stylesFolder = path.join(__dirname, 'styles');
    const outputFolder = path.join(__dirname, 'project-dist');
    const outputFile = path.join(outputFolder, 'bundle.css');
    const files = await fs.readdir(stylesFolder);
    const cssFiles = files.filter((file) => file.endsWith('.css'));
    const cssContents = [];
    for (const cssFile of cssFiles) {
      const filePath = path.join(stylesFolder, cssFile);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      cssContents.push(fileContent);
    }
    const combinedCSS = cssContents.join('\n');
    await fs.mkdir(outputFolder, { recursive: true });
    await fs.writeFile(outputFile, combinedCSS);

    console.log('CSS bundle created successfully!');
  } catch (err) {
    console.error('Error building CSS bundle:', err);
  }
}

buildCSSBundle();
