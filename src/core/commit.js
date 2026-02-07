const fs = require("fs");
const path = require("path");
const { hashObject } = require("../utils/hash");
const { writeObject } = require("../utils/fileOps");

// Read staged files from index
function readIndex(repoPath) {
  const indexPath = path.join(repoPath, "index");

  if (!fs.existsSync(indexPath)) return [];

  const lines = fs.readFileSync(indexPath, "utf8")
    .trim()
    .split("\n")
    .filter(line => line.length > 0);

  return lines.map(line => {
    const [file, hash] = line.split(" ");
    return { file, hash };
  });
}

function commit(repoPath, message) {
  const headPath = path.join(repoPath, "HEAD");
  const headContent = fs.readFileSync(headPath, "utf8").trim();

  // HEAD -> symbolic ref
  if (!headContent.startsWith("ref:")) {
    throw new Error("HEAD is not a symbolic reference!");
  }

  const branchRefPath = headContent.replace("ref: ", "");
  const fullBranchPath = path.join(repoPath, branchRefPath);

  // parent commit
  let parent = fs.existsSync(fullBranchPath)
    ? fs.readFileSync(fullBranchPath, "utf8").trim() || null
    : null;

  // Read staged entries
  const staged = readIndex(repoPath);

  if (staged.length === 0) {
    console.log("Nothing to commit.");
    return;
  }

  // Build tree object from staged entries
  let entries = staged.map(entry => `${entry.file} ${entry.hash}`);
  const treeContent = entries.join("\n");

  const treeHash = hashObject(treeContent);

  // save tree object
  writeObject(repoPath, treeHash, treeContent);

  // Create commit object
  const commitObj = {
    tree: treeHash,
    parent,
    message,
    timestamp: Date.now()
  };

  const commitStr = JSON.stringify(commitObj, null, 2);
  const commitHash = hashObject(commitStr);

  // save commit into commits/
  const commitDir = path.join(repoPath, "commits");
  fs.writeFileSync(path.join(commitDir, commitHash), commitStr);

  // update branch pointer
  fs.writeFileSync(fullBranchPath, commitHash);

  // Clear staging area after commit
  fs.writeFileSync(path.join(repoPath, "index"), "");

  console.log(`Commit created on branch ${branchRefPath}: ${commitHash}`);
  return commitHash;
}

module.exports = { commit };
