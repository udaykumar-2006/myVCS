const fs = require("fs");
const path = require("path");

function checkout(repoPath, branchName) {
  const branchPath = path.join(repoPath, "refs", "heads", branchName);

  if (!fs.existsSync(branchPath)) {
    console.log(`Branch '${branchName}' does not exist.`);
    return;
  }

  // HEAD now points to the branch
  fs.writeFileSync(
    path.join(repoPath, "HEAD"),
    `ref: refs/heads/${branchName}`
  );

  console.log(`Switched to branch '${branchName}'`);
}

module.exports = { checkout };
