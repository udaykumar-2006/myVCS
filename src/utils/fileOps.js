const fs = require("fs");
const path = require("path");
const { hashObject } = require("./hash");

// Save any VCS object (blob OR tree OR commit)
function writeObject(repoPath, hash, content) {
  const objectsDir = path.join(repoPath, "objects");

  if (!fs.existsSync(objectsDir)) {
    fs.mkdirSync(objectsDir, { recursive: true });
  }

  const objectPath = path.join(objectsDir, hash);
  fs.writeFileSync(objectPath, content);

  return objectPath;
}

// STAGING AREA SUPPORT
function stageFile(repoPath, filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist");
  }

  const content = fs.readFileSync(filePath);
  const hash = hashObject(content);

  // Save blob
  writeObject(repoPath, hash, content);

  const indexPath = path.join(repoPath, "index");
  const fileName = path.basename(filePath);

  // Remove any previous entry for THIS file
  let index = "";
  if (fs.existsSync(indexPath)) {
    const lines = fs.readFileSync(indexPath, "utf8").split("\n");
    index = lines
      .filter((l) => !l.startsWith(fileName + " "))
      .join("\n");
  }

  const indexEntry = `${fileName} ${hash}`;
  const finalIndex = (index.trim() + "\n" + indexEntry).trim() + "\n";

  fs.writeFileSync(indexPath, finalIndex);

  console.log(`Staged: ${fileName}`);
}

// DELETE FEATURE — NEW
function deleteFile(repoPath, filePath) {
  const indexPath = path.join(repoPath, "index");
  const fileName = path.basename(filePath);

  //  Delete file from working directory
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  //  Remove file from index (staging)
  let indexEntries = {};
  if (fs.existsSync(indexPath)) {
    const lines = fs.readFileSync(indexPath, "utf8").trim().split("\n");
    for (const line of lines) {
      const [file, hash] = line.split(" ");
      indexEntries[file] = hash;
    }
  }

  // Remove this file entry
  delete indexEntries[fileName];

  // Rewrite updated index
  const newIndex = Object.entries(indexEntries)
    .map(([file, hash]) => `${file} ${hash}`)
    .join("\n");

  fs.writeFileSync(indexPath, newIndex + (newIndex ? "\n" : ""));

  console.log(`Deleted & staged: ${fileName}`);
}

module.exports = { writeObject, stageFile, deleteFile };
