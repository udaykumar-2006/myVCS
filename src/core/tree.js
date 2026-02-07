const fs = require("fs");
const path = require("path");
const { hashObject } = require("../utils/hash");
const { writeObject } = require("../utils/fileOps");

function createTree(repoPath) {
  const workDir = process.cwd(); // current working folder
  const files = fs.readdirSync(workDir);

  // Load ignore file (.myvcsignore)
const ignoreFilePath = path.join(workDir, ".myvcsignore");
let ignoreList = [];

if (fs.existsSync(ignoreFilePath)) {
  ignoreList = fs.readFileSync(ignoreFilePath, "utf8")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
}


  let entries = [];

  for (const file of files) {
    const filePath = path.join(workDir, file);

    // skip files from .myvcsignore
if (ignoreList.includes(file)) continue;


    // skip .myvcs folder and node_modules etc.
    if (file === ".myvcs" || file === "node_modules") continue;

    // skip folders for now (we’ll add recursive trees later)
    if (fs.lstatSync(filePath).isDirectory()) continue;

    // read file content
    const content = fs.readFileSync(filePath);

    // generate blob hash
    const blobHash = hashObject(content);

    // save blob to objects folder
    writeObject(repoPath, blobHash, content);

    // add entry to tree format
    entries.push(`${file} ${blobHash}`);
  }

  // create tree object content
  const treeContent = entries.join("\n");

  // hash tree
  const treeHash = hashObject(treeContent);

  // save tree object
  writeObject(repoPath, treeHash, treeContent);

  return treeHash;
}

module.exports = { createTree };
