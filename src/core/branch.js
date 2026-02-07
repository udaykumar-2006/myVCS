const fs = require("fs");
const path = require("path");

function createBranch(repoPath, name) {
  const headContent = fs.readFileSync(path.join(repoPath, "HEAD"), "utf8").trim();

  const branchPath = path.join(repoPath, "refs", "heads", name);
  if (fs.existsSync(branchPath)) {
    console.log(`Branch '${name}' already exists.`);
    return;
  }

  // get current commit hash from current branch
  const currentBranchRef = headContent.replace("ref: ", "");
  const currentBranchPath = path.join(repoPath, currentBranchRef);

  const currentCommit = fs.existsSync(currentBranchPath)
    ? fs.readFileSync(currentBranchPath, "utf8").trim()
    : "";

  fs.writeFileSync(branchPath, currentCommit);
  console.log(`Branch '${name}' created.`);
}

module.exports = { createBranch };
