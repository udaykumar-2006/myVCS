const fs = require("fs");
const path = require("path");
const { hashObject } = require("../utils/hash");

// Load ignore list
function loadIgnoreList(workDir) {
  const ignorePath = path.join(workDir, ".myvcsignore");
  if (!fs.existsSync(ignorePath)) return [];

  return fs.readFileSync(ignorePath, "utf8")
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

// Read tree snapshot
function readTree(repoPath, treeHash) {
  const treePath = path.join(repoPath, "objects", treeHash);
  const snapshot = {};

  if (!fs.existsSync(treePath)) return snapshot;

  const lines = fs.readFileSync(treePath, "utf8").trim().split("\n");

  for (const line of lines) {
    const [file, hash] = line.split(" ");
    snapshot[file] = hash;
  }

  return snapshot;
}

// Get last commit hash
function getHeadCommit(repoPath) {
  const headContent = fs.readFileSync(path.join(repoPath, "HEAD"), "utf8").trim();

  if (headContent.startsWith("ref:")) {
    const branchPath = headContent.replace("ref: ", "");
    const commitHash = fs.readFileSync(path.join(repoPath, branchPath), "utf8").trim();
    return commitHash || null;
  }

  return headContent;
}

// Simple line-by-line diff
function diffLines(oldLines, newLines) {
  let i = 0, j = 0;
  const output = [];

  while (i < oldLines.length || j < newLines.length) {
    if (i < oldLines.length && j < newLines.length) {
      if (oldLines[i] === newLines[j]) {
        i++; 
        j++;
        continue;
      } else {
        output.push(`- ${oldLines[i]}`);
        output.push(`+ ${newLines[j]}`);
        i++;
        j++;
      }
    } else if (i < oldLines.length) {
      output.push(`- ${oldLines[i]}`);
      i++;
    } else if (j < newLines.length) {
      output.push(`+ ${newLines[j]}`);
      j++;
    }
  }

  return output;
}

function diff(repoPath) {
  const workDir = process.cwd();
  const ignoreList = loadIgnoreList(workDir);

  const commitHash = getHeadCommit(repoPath);
  if (!commitHash) {
    console.log("No commits yet.");
    return;
  }

  const commitPath = path.join(repoPath, "commits", commitHash);
  const commitData = JSON.parse(fs.readFileSync(commitPath, "utf8"));
  const treeHash = commitData.tree;

  const snapshot = readTree(repoPath, treeHash);

  console.log("Differences (working directory vs last commit):\n");

  // DIFF FOR EXISTING FILES
  for (const file in snapshot) {
    if (ignoreList.includes(file)) continue; //  IGNORE HERE

    const blobHash = snapshot[file];
    const blobPath = path.join(repoPath, "objects", blobHash);

    const committedContent = fs.readFileSync(blobPath, "utf8").split("\n");
    const currentPath = path.join(workDir, file);

    if (!fs.existsSync(currentPath)) {
      console.log(`File deleted: ${file}`);
      continue;
    }

    const workingContent = fs.readFileSync(currentPath, "utf8").split("\n");
    const diffs = diffLines(committedContent, workingContent);

    if (diffs.length > 0) {
      console.log(`--- ${file} ---`);
      diffs.forEach(line => console.log(line));
      console.log();
    }
  }

  // CHECK NEW FILES
  const currentFiles = fs.readdirSync(workDir)
    .filter(f =>
      fs.lstatSync(path.join(workDir, f)).isFile() &&
      f !== ".myvcs" &&
      !ignoreList.includes(f) // IGNORE NEW FILES TOO
    );

  for (const f of currentFiles) {
    if (!snapshot[f]) {
      console.log(`New file (not in last commit): ${f}`);
    }
  }
}

module.exports = { diff };
