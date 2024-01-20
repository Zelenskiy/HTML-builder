const fs = require('fs/promises');
const path = require('path');

async function copyDir(sourceFolder, destinationFolder) {
  try {
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

async function buildCSSBundle(stylesFolder, outputFolder, outputFile) {
  try {
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

async function buildPage() {
  const stylesFolder = path.join(__dirname, 'styles');
  const outputFolder = path.join(__dirname, 'project-dist');
  const outputFile = path.join(outputFolder, 'style.css');

  try {
    await fs.mkdir(outputFolder, { recursive: true });
    const templateFilePath = path.join(__dirname, 'template.html');
    let templateContent = await fs.readFile(templateFilePath, 'utf-8');
    const componentTags = templateContent.match(/{{(.*?)}}/g) || [];
    for (const tag of componentTags) {
      const componentName = tag.slice(2, -2).trim();
      const componentFilePath = path.join(
        __dirname,
        'components',
        `${componentName}.html`,
      );
      const componentFileStat = await fs.stat(componentFilePath);
      if (componentFileStat.isFile() && componentFilePath.endsWith('.html')) {
        const componentContent = await fs.readFile(componentFilePath, 'utf-8');
        templateContent = templateContent.replace(tag, componentContent);
      } else {
        console.error(
          `Error: Component file "${componentName}.html" not found or is not an HTML file.`,
        );
      }
    }

    const outputFilePath = path.join(outputFolder, 'index.html');
    await fs.writeFile(outputFilePath, templateContent);

    console.log('index.html created successfully!');

    await buildCSSBundle(stylesFolder, outputFolder, outputFile);

    const assetsSource = path.join(__dirname, 'assets');
    const assetsDestination = path.join(outputFolder, 'assets');

    await copyDir(assetsSource, assetsDestination);

    console.log('Assets and style.css copied successfully!');
  } catch (err) {
    console.error('Error building the page:', err);
  }
}

buildPage();
