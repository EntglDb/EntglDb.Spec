# Project: EntglDb — Advanced Conflict Resolution (JSON Diff/Patch)

## 🎯 Goal

Implement a standalone .NET library `EntglDb.ConflictResolution` that extends
EntglDb's conflict resolution capabilities, going beyond the already-present
**Last-Write-Wins (LWW)** strategy, towards intelligent merge based on
**JSON Diff** and **JSON Patch (RFC 6902)**.

The reference `IConflictResolver` implementation in `EntglDb.Net` is the starting
point: this project extends its contract and enriches it.

---

## 🧠 Concept

When two nodes modify the same document concurrently, LWW silently discards
the changes of the "loser". With JSON Diff/Patch it is possible to:

1. Compute the **delta** between the base version and each of the two conflicting versions.
2. **Automatically merge** changes that don’t touch the same fields.
3. Handle **true conflicts** (same field modified differently) with configurable strategies.

**Example:**
```json
// Base document
{ "name": "Mario", "surname": "Rossi", "age": 30 }

// Node A modifies "name"
{ "name": "Mario Bianchi", "surname": "Rossi", "age": 30 }

// Node B modifies "age"
{ "name": "Mario", "surname": "Rossi", "age": 31 }

// Automatic merge → no real conflict
{ "name": "Mario Bianchi", "surname": "Rossi", "age": 31 }
```

---

## 🛠️ Technical Specifications

### 1. Library `EntglDb.ConflictResolution`

Standalone .NET 8+ library. Dependencies: `System.Text.Json` (already included in .NET).
No mandatory external dependencies — the JSON Diff/Patch implementation shall be done from scratch
(or via an open source library with a compatible MIT license).

**Public interface:**

```csharp
namespace EntglDb.ConflictResolution;

public interface IDocumentMerger
{
    MergeResult Merge(string? baseJson, string versionA, string versionB);
}

public readonly record struct MergeResult(
    bool HasConflicts,
    string MergedJson,
    IReadOnlyList<MergeConflict> Conflicts);

public readonly record struct MergeConflict(
    string Path,          // JSON Pointer RFC 6901 (e.g. "/address/city")
    JsonElement ValueA,
    JsonElement ValueB,
    MergeConflictType Type);

public enum MergeConflictType { ValueChanged, ArrayConflict, TypeMismatch }
```

### 2. Merge Algorithm — 3-way merge

```
Input:  baseJson  (snapshot at the time of the fork)
        versionA  (changes from node A)
        versionB  (changes from node B)

Step 1: diffA = JsonDiff(base, versionA)   → list of JsonPatch operations
Step 2: diffB = JsonDiff(base, versionB)   → list of JsonPatch operations
Step 3: detectCollisions(diffA, diffB)     → paths that appear in both diffs
Step 4: applyPatch(base, diffA ∪ diffB non-conflicting)  → merged document
Step 5: for each collision → configurable strategy
```

### 3. Strategies for true conflicts

| Strategy | Behaviour |
|---|---|
| `ThrowOnConflict` | Throws `MergeConflictException` (safe default) |
| `PreferA` / `PreferB` | Always applies the version from A or B |
| `PreferLatestHlc` | Applies the version with the most recent HLC (LWW per field) |
| `Custom(Func<MergeConflict, JsonElement>)` | User callback for each conflicting field |

### 4. Array handling

Arrays are the most complex case. Implement at least two strategies:

- **`ReplaceArray`**: treats the array as an atomic value (LWW on the whole array).
- **`AppendArray`**: concatenates elements added by A and B, removes elements deleted
  by both. Requires element ID tracking.

### 5. Integration with EntglDb

After developing and testing the standalone library, integrate it into `EntglDb.Net`
by implementing:

```csharp
public class JsonDiffPatchResolver : IConflictResolver
{
    private readonly MergeOptions _options;
    
    public string Resolve(string? baseJson, string local, string remote)
    {
        var result = _merger.Merge(baseJson, local, remote);
        if (result.HasConflicts)
            return _options.ConflictStrategy.Resolve(result.Conflicts);
        return result.MergedJson;
    }
}
```

---

## 📦 Expected Output

- NuGet package (optional publication) `EntglDb.ConflictResolution`
- Unit test suite with at least 30 cases:
  - Conflict-free merge (disjoint fields)
  - Merge with conflicts (same field, different strategies)
  - Merge with arrays (append, replace)
  - Edge cases: null document, empty document, nested objects
- Console demo simulating two concurrent nodes and showing merge behaviour
- Integration demonstrated in `EntglDb.Net` with `JsonDiffPatchResolver`

## 📚 References

- `EntglDb.Net/src/EntglDb.Core/sync/IConflictResolver.cs`
- `EntglDb.Net/src/EntglDb.Core/sync/RecursiveMergeResolver.cs`
- RFC 6902 — JSON Patch: https://datatracker.ietf.org/doc/html/rfc6902
- RFC 6901 — JSON Pointer: https://datatracker.ietf.org/doc/html/rfc6901
