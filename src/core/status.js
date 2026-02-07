const fs = require("fs");
const path = require("path");
const { hashObject } = require("../utils/hash");

function getTreeObject(repoPath, treeHash) {
  const treePath = path.join(repoPath, "objects", treeHash);
  if (!fs.existsSync(treePath)) return {};

  const lines = fs.readFileSync(treePath, "utf8").trim().split("\n");
  const tree = {};

  for (const line of lines) {
    const [fileName, hash] = line.split(" ");
    tree[fileName] = hash;
  }

  return tree;
}

function getHeadCommit(repoPath) {
  const headContent = fs.readFileSync(path.join(repoPath, "HEAD"), "utf8").trim();

  if (headContent.startsWith("ref:")) {
    const branchPath = headContent.replace("ref: ", "");
    const commitHash = fs.readFileSync(path.join(repoPath, branchPath), "utf8").trim();
    return commitHash || null;
  }

  return headContent || null;
}

function status(repoPath) {
  const workDir = process.cwd();

  // Load ignore file
  const ignorePath = path.join(workDir, ".myvcsignore");
  let ignoreList = [];

  if (fs.existsSync(ignorePath)) {
    ignoreList = fs.readFileSync(ignorePath, "utf8")
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  const commitHash = getHeadCommit(repoPath);
  if (!commitHash) {
    console.log("No commits yet.");
    return;
  }

  // Read commit object
  const commitPath = path.join(repoPath, "commits", commitHash);
  const commitData = JSON.parse(fs.readFileSync(commitPath, "utf8"));
  const lastTreeHash = commitData.tree;

  // Read last snapshot (tree)
  const lastSnapshot = getTreeObject(repoPath, lastTreeHash);

  // Current working files (ignore .myvcs and ignored files)
  const currentFiles = fs.readdirSync(workDir)
    .filter(f =>
      f !== ".myvcs" &&
      fs.lstatSync(path.join(workDir, f)).isFile() &&
      !ignoreList.includes(f) // <-- ignore logic here
    );

  const newFiles = [];
  const modifiedFiles = [];
  const deletedFiles = [];

  // Detect new + modified
  for (const file of currentFiles) {
    const content = fs.readFileSync(path.join(workDir, file));
    const hash = hashObject(content);

    if (!lastSnapshot[file]) {
      newFiles.push(file);
    } else if (lastSnapshot[file] !== hash) {
      modifiedFiles.push(file);
    }
  }

  // Detect deleted
  for (const file in lastSnapshot) {
    if (!currentFiles.includes(file) && !ignoreList.includes(file)) {
      deletedFiles.push(file);
    }
  }

  // Print results
  console.log("Changes not committed:");

  newFiles.forEach(f => console.log("  new file:   " + f));
  modifiedFiles.forEach(f => console.log("  modified:   " + f));
  deletedFiles.forEach(f => console.log("  deleted:    " + f));

  if (newFiles.length === 0 && modifiedFiles.length === 0 && deletedFiles.length === 0) {
    console.log("  No changes.");
  }
}

module.exports = { status };
