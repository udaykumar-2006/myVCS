#!/usr/bin/env node

const path = require("path");
const initRepo = require("../core/initRepo");
const { stageFile,deleteFile } = require("../utils/fileOps"); 
const { commit } = require("../core/commit");
const { logCommits } = require("../core/log");
const { createBranch } = require("../core/branch");
const { checkout } = require("../core/checkout");
const { status } = require("../core/status");
const { diff } = require("../core/diff");


const args = process.argv.slice(2);
const command = args[0];

const repoPath = path.join(process.cwd(), ".myvcs");

if (command === "init") {
  initRepo();

} else if (command === "add") {
  const filePath = args[1];
  if (!filePath) {
    console.log("Usage: myvcs add <file>");
    process.exit(1);
  }

  // staging
  stageFile(repoPath, filePath);

} else if (command === "commit") {
  const mIndex = args.indexOf("-m");

  if (mIndex === -1 || !args[mIndex + 1]) {
    console.log('Error: Missing commit message. Use: myvcs commit -m "message"');
    process.exit(1);
  }

  const message = args[mIndex + 1];
  commit(repoPath, message);

} else if (command === "log") {
  logCommits(repoPath);

} else if (command === "branch") {
  const name = args[1];
  if (!name) {
    console.log("Usage: myvcs branch <branchName>");
    return;
  }
  createBranch(repoPath, name);

} else if (command === "checkout") {
  const name = args[1];
  if (!name) {
    console.log("Usage: myvcs checkout <branchName>");
    return;
  }
  checkout(repoPath, name);

} else if (command === "status") {
  status(repoPath);
} else if (command === "diff") {
  diff(repoPath);

} else if(command === "delete") { 
  const filePath = args[1];
  if (!filePath) {
    console.log("Usage: myvcs delete <file>");
    process.exit(1);
  }

  // staging
  deleteFile(repoPath, filePath);
}

else {
  console.log("Unknown command");
  console.log("");
  console.log("Commands:");
  console.log("  myvcs init");
  console.log("  myvcs add <file>");
  console.log('  myvcs commit -m "message"');
  console.log("  myvcs log");
  console.log("  myvcs branch <name>");
  console.log("  myvcs checkout <branch>");
  console.log("  myvcs status");
  console.log("  myvcs diff");
  console.log("  myvcs delete <file>"); 
}
