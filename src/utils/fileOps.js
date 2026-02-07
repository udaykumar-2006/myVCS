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

// NEW — STAGING AREA SUPPORT
function stageFile(repoPath, filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist");
  }

  // Read file content
  const content = fs.readFileSync(filePath);
  
  // Hash blob content
  const hash = hashObject(content);

  // Save blob to objects/ (like Git does for staging)
  writeObject(repoPath, hash, content);

  // Add entry to index
  const indexPath = path.join(repoPath, "index");
  const fileName = path.basename(filePath);

  // Format: filename hash
  const indexEntry = `${fileName} ${hash}\n`;
  fs.appendFileSync(indexPath, indexEntry);

  console.log(`Staged: ${fileName}`);
}

module.exports = { writeObject, stageFile };
