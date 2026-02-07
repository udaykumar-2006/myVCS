📦 myVCS — A Lightweight Git-Like Version Control System

A custom version-control system implemented from scratch using Node.js, designed to mimic the internal workings of Git.
This project implements objects, commits, trees, staging, branching, checkout, diff, status, and symbolic HEAD references — exactly like real Git does internally.

⭐ Features Implemented
🔹 1. Repository Initialization (myvcs init)

Creates a .myvcs/ folder with the following structure:

.myvcs/
 ├── HEAD
 ├── commits/
 ├── objects/
 ├── index               (staging area)
 └── refs/
     └── heads/
         └── main

🔹 2. Staging Area (myvcs add <file>)

Implements a Git-like INDEX file.

When you add a file:

Hash → Blob object created in .myvcs/objects

File entry added to .myvcs/index

🔹 3. Commit System (myvcs commit -m "msg")

Creates a commit object containing:

{
  "tree": "<tree-hash>",
  "parent": "<parent-commit>",
  "message": "your commit message",
  "timestamp": 123456789
}


Then writes the commit to .myvcs/commits/<hash>,
and updates refs/heads/<currentBranch>.

🔹 4. Tree Objects (Snapshots)

Your system builds tree objects like Git.

A tree object lists all files + their hash:

file1.txt <blob-hash>
file2.txt <blob-hash>


Tree hash stored in .myvcs/objects/.

🔹 5. Log System (myvcs log)

Prints commit history from HEAD backwards:

commit <hash>
message: ...
tree: ...
parent: ...
time: ...

🔹 6. Branching (myvcs branch <name>)

Creates:

.myvcs/refs/heads/<branchName>


Containing the commit hash of the current branch.

🔹 7. Checkout (myvcs checkout <branch>)

Updates HEAD:

ref: refs/heads/<branch>


Now all commits will belong to that branch.

🔹 8. Diff (myvcs diff)

Shows difference between working directory and last commit:

--- file.txt ---
- old line
+ new line


Also detects new files:

New file: test.txt

🔹 9. Status (myvcs status)

Shows:

modified files

new files

empty working tree

staged but uncommitted files

⚙ Internal Architecture Explained

This section makes you look GOD-LEVEL in interviews 😎🔥

🔥 BLOB OBJECTS (File snapshots)

Every file is stored as a BLOB inside .myvcs/objects/.

Created using:

hashObject(content)
writeObject(repo, hash, content)

🌳 TREE OBJECTS (Folder snapshots)

A tree object maps filename → blob hash.

Every commit has a unique tree representing the entire repo snapshot.

🧠 COMMIT OBJECTS (Version history)

Stored in .myvcs/commits/<hash>.

Contains:

tree hash

parent commit hash

message

timestamp

This exactly mirrors Git’s internal commit structure.

🎯 HEAD (Symbolic reference)

HEAD contains:

ref: refs/heads/main


Meaning HEAD points to a branch,
and the branch file contains the latest commit hash.

🌿 Branching

When you do:

myvcs branch feature-x


Creates:

.myvcs/refs/heads/feature-x


with content:

<current commit hash>


Checkout switches HEAD to that branch.

🗂 INDEX (Staging area)

.myvcs/index contains:

filename blobhash
filename2 blobhash


Commit reads only staged files.

🧪 Usage Guide
Initialize repo
myvcs init

Create file
echo "hello" > test1.txt

Stage file
myvcs add test1.txt

Commit
myvcs commit -m "initial commit"

See history
myvcs log

Modify a file
echo "new line" >> test1.txt

Check diff
myvcs diff

Check status
myvcs status

Create branch
myvcs branch feature-x

Switch branch
myvcs checkout feature-x

Commit on new branch
myvcs add test1.txt
myvcs commit -m "changes on feature-x"

👨‍💻 Folder Structure
myVCS/
 ├── src/
 │   ├── cli/index.js
 │   ├── core/
 │   │     ├── initRepo.js
 │   │     ├── commit.js
 │   │     ├── diff.js
 │   │     ├── log.js
 │   │     ├── tree.js
 │   │     ├── branch.js
 │   │     ├── checkout.js
 │   │     └── status.js
 │   └── utils/
 │         ├── hash.js
 │         └── fileOps.js
 ├── .myvcsignore
 └── package.json
