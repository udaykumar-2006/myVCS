const fs = require("fs");
const path = require("path");
const { hashObject } = require("../utils/hash");
const { writeObject } = require("../utils/fileOps");

function createTree(repoPath) {
  const indexPath = path.join(repoPath, "index");

  // No staged files means empty tree
  if (!fs.existsSync(indexPath)) {
    const emptyTreeHash = hashObject("");
    writeObject(repoPath, emptyTreeHash, "");
    return emptyTreeHash;
  }

  const lines = fs.readFileSync(indexPath, "utf8").trim().split("\n");

  let entries = [];

  for (const line of lines) {
    if (!line.trim()) continue;

    const [fileName, blobHash] = line.split(" ");

    const workPath = path.join(process.cwd(), fileName);

    // FILE EXISTS in working directory → include in tree
    if (fs.existsSync(workPath)) {
      const content = fs.readFileSync(workPath);
      const actualBlobHash = hashObject(content);

      // Write blob if not saved yet
      writeObject(repoPath, actualBlobHash, content);

      // Use latest hash
      entries.push(`${fileName} ${actualBlobHash}`);
    }
    // FILE DOES NOT EXIST → was deleted → do NOT include in tree
  }

  const treeContent = entries.join("\n");
  const treeHash = hashObject(treeContent);

  writeObject(repoPath, treeHash, treeContent);

  return treeHash;
}

module.exports = { createTree };
