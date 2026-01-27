# Project: Conflict Resolution based on JsonDiff/Patch

## 🎯 Objective
Improve EntglDb's conflict resolution strategy by moving beyond the "Last-Write-Wins" (LWW) model to support smart merging of concurrent edits on complex JSON documents.

## 🧠 Concept
Currently, if two nodes modify a document simultaneously, the last modification wins based on the timestamp (LWW), potentially overwriting data.
The goal is to use **JsonDiff** and **JsonPatch** (RFC 6902) to:
1. Calculate the delta of changes.
2. Merge non-conflicting changes (e.g., Node A modifies `name`, Node B modifies `surname`).
3. Handle actual conflicts with definable strategies.

## 🛠️ Technical Specifications

### 1. `EntglDb.ConflictResolution` Library
- Development of an isolated .NET component.
- Dependencies: `System.Text.Json`, `JsonPatch` (e.g., `GrapeCity.Documents.Json` or custom implementation).

### 2. Merge Algorithm
- Input: `BaseDocument`, `VersionA`, `VersionB`.
- Output: `MergedDocument` or `ConflictException`.
- Logic:
  - Calculate `Diff(Base, A)` and `Diff(Base, B)`.
  - Detection of path collisions.
  - Sequential patch application if paths are disjoint.

### 3. Integration with EntglDb
- Define how to hook this logic into the EntglDb Core.
- Probable extension of the Oplog application phase:
  - Instead of `Put(Doc)`, support `Patch` operations.
  - Or during replication, detect forks and attempt automatic merge.

### 4. Array and List Handling
- Specific strategies for array merging (e.g., append, insert at index).

## 📦 Expected Output
- NuGet Package `EntglDb.ConflictResolution`.
- Demo Project simulating concurrent writes and demonstrating correct merge.
- Documentation of supported merge strategies.
