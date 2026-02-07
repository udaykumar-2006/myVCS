const fs = require("fs");
const path = require("path");

function logCommits(repoPath) {
  const headPath = path.join(repoPath, "HEAD");
  let headContent = fs.readFileSync(headPath, "utf8").trim();

  // If HEAD is symbolic (ref: refs/heads/main)
  if (headContent.startsWith("ref:")) {
    const branchRef = headContent.replace("ref: ", "");
    headContent = fs.readFileSync(path.join(repoPath, branchRef), "utf8").trim();
  }

  let commitHash = headContent;

  if (!commitHash) {
    console.log("No commits found.");
    return;
  }

  const commitsDir = path.join(repoPath, "commits");

  while (commitHash) {
    const commitPath = path.join(commitsDir, commitHash);

    if (!fs.existsSync(commitPath)) {
      console.log(`Missing commit object for hash: ${commitHash}`);
      break;
    }

    const commitData = JSON.parse(fs.readFileSync(commitPath, "utf8"));

    console.log("--------------------------------------------------");
    console.log(`commit:   ${commitHash}`);
    console.log(`message:  ${commitData.message}`);
    console.log(`tree:     ${commitData.tree}`);
    console.log(`parent:   ${commitData.parent}`);
    console.log(`time:     ${new Date(commitData.timestamp).toLocaleString()}`);
    console.log("");

    commitHash = commitData.parent;
  }

  console.log("--------------------------------------------------");
}

module.exports = { logCommits };
