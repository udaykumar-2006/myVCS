const fs = require("fs");
const path = require("path");

function initRepo() {
  const root = process.cwd();
  const vcsDir = path.join(root, ".myvcs");

  if (fs.existsSync(vcsDir)) {
    console.log("Repository already initialized");
    return;
  }

  // Create directories
  fs.mkdirSync(vcsDir);
  fs.mkdirSync(path.join(vcsDir, "objects"));
  fs.mkdirSync(path.join(vcsDir, "commits"));
  fs.mkdirSync(path.join(vcsDir, "refs"));
  fs.mkdirSync(path.join(vcsDir, "refs", "heads"));

  // Create main branch (default)
  const mainBranch = path.join(vcsDir, "refs", "heads", "main");
  fs.writeFileSync(mainBranch, ""); // empty commit hash for now

  // HEAD now points to main (symbolic ref)
  fs.writeFileSync(path.join(vcsDir, "HEAD"), "ref: refs/heads/main");

//  Create INDEX for staging area
  fs.writeFileSync(path.join(vcsDir, "index"), "");

  console.log("Initialized empty myVCS repository (main branch created)");
}

module.exports = initRepo;
