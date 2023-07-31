const fs = require('fs');
const path = require('path');
const util = require('util');

const readFile = util.promisify(fs.readFile);

async function createFileDict(directory) {
  const fileDict = {};

  // loop over all items in the directory
  const items = fs.readdirSync(directory);
  for (let item of items) {
    const itemPath = path.join(directory, item);

    if (fs.lstatSync(itemPath).isFile()) {
      try {
        // try to read the file with utf8 encoding
        const content = await readFile(itemPath, { encoding: 'utf8' });
        fileDict[item] = { file: { contents: content } };
      } catch (e) {
        // if it fails, try with latin1 encoding
        const content = await readFile(itemPath, { encoding: 'latin1' });
        fileDict[item] = { file: { contents: content } };
      }
    } else if (fs.lstatSync(itemPath).isDirectory()) {
      // if the item is a directory, recursively call this function to get its contents
      fileDict[item] = { directory: await createFileDict(itemPath) };
    }
  }

  return fileDict;
}

async function main() {
  const allContent = await createFileDict('.');

  fs.writeFileSync('template.json', JSON.stringify(allContent));
}

main().catch(console.error);
