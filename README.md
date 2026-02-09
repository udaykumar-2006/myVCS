:file_folder:***myVCS — A Lightweight Git-Like Version Control System (Built From Scratch)***

myVCS is a custom version-control system built using Node.js, replicating the core internals of Git:

Blob objects

Tree snapshots

Commit objects

Staging area

Branch tracking

Checkout

Diff engine

File deletions

Status

Symbolic HEAD

:bulb:***Features***

:arrow_right: Repository Initialization
```
myvcs init
```

Creates:
```
.myvcs/
 ├── HEAD
 ├── index
 ├── objects/
 ├── commits/
 └── refs/
      └── heads/
          └── main
```
:arrow_right: Staging Files
```
myvcs add <file>
```

Computes blob hash

Saves blob under .myvcs/objects/

Adds entry to staging area (index)

Example entry:
```
test1.txt 8b787bd92...
```
:arrow_right: Commit System
```
myvcs commit -m "message"
```

Creates commit object:
```
{
  "tree": "<tree-hash>",
  "parent": "<previous-hash>",
  "message": "message",
  "timestamp": 1717941111
}
```

Stored under:
```
.myvcs/commits/<hash>
```
:arrow_right: Tree Objects (Snapshots)

Represent the current staged state:
```
file1.txt <blob-hash>
file2.txt <blob-hash>
```

Stored under:
```
.myvcs/objects/<tree-hash>
```
:arrow_right:Status
```
myvcs status
```
Detects:

modified files

deleted files

new untracked files

clean working directory

Example:
```
modified: test1.txt
new file: hello.txt
deleted: old.txt
```
:arrow_right: Diff Engine
```
myvcs diff
```
Example output:
```
--- test1.txt ---
- old line
+ new added line
+
```

Detects new files:
```
New file: hello.txt
```
:arrow_right:Branching
```
myvcs branch feature-x
```

:arrow_right:Creates:
```
.myvcs/refs/heads/feature-x
```
:arrow_right:Checkout
```
myvcs checkout feature-x
```

:arrow_right:Updates HEAD:
```
ref: refs/heads/feature-x
```
:arrow_right:Delete Feature (git rm equivalent)
```
myvcs delete <file>
```

Does:

Removes file from working directory

Removes file from staging (index)

Next commit removes file from snapshot

Example:
```
myvcs delete test1.txt
myvcs commit -m "removed test1"
```
:checkered_flag: **Internal Architecture**

:small_orange_diamond:Blob Objects

Stored at:
```
.myvcs/objects/<hash>
```

Contain raw file content.

:small_orange_diamond:Tree Objects

Contain mapping:
```
filename blobhash
```
:small_orange_diamond:Commit Objects

Stored under:
```
.myvcs/commits/<hash>
```

Each commit contains:

tree hash

parent hash

message

timestamp

:small_orange_diamond:Staging Area (index)

Stores staged entries:
```
filename blobhash
```

Commit always reads ONLY index.

:small_orange_diamond:HEAD Pointer
```
ref: refs/heads/main
```

Symbolic reference to active branch.

:small_orange_diamond:Branch Refs

Each branch stores:
```
<latest-commit-hash>
```
:hammer_and_wrench: **Commands Overview**

Initialize
```
myvcs init
```
Stage
```
myvcs add file.txt
```
Commit
```
myvcs commit -m "msg"
```
Log
```
myvcs log
```
Status
```
myvcs status
```
Diff
```
myvcs diff
```
Create Branch
```
myvcs branch <name>
```
Checkout Branch
```
myvcs checkout <branch>
```
Delete File
```
myvcs delete file.txt
```
:fire:**Full Workflow Example** 
```
myvcs init

echo "hello" > test1.txt
myvcs add test1.txt
myvcs commit -m "first commit"

echo "new line" >> test1.txt
myvcs diff
myvcs status

myvcs add test1.txt
myvcs commit -m "updated test1"

myvcs branch feature-x
myvcs checkout feature-x

echo "branch update" >> test1.txt
myvcs add test1.txt
myvcs commit -m "feature commit"

myvcs checkout main

myvcs delete test1.txt
myvcs commit -m "removed test1"
```

:jigsaw: **Tech Stack**

:computer: Node.js

:page_facing_up: Native filesystem APIs

:alien: Crypto hashing

Pure logic (no external libs)
