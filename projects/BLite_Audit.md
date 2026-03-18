# Project: BLite — Audit & Performance Monitoring

## 🎯 Goal

Implement the **audit and performance monitoring** system for BLite,
as described in the detailed technical specification in `BLite/AUDIT_IMPLEMENTATION.md`.

BLite is a high-performance embedded .NET database (ACID, BSON, zero-allocation).
This project adds internal visibility to the engine: every important operation
emits an event that can be intercepted by the host application for logging,
metrics, slow-query alerts, and OpenTelemetry integration.

---

## 🧠 Audit system architecture

The system consists of three orthogonal elements:

```
┌───────────────────────────────────────────────────────────────┐
│  BLiteAuditOptions  (configured in the engine constructor)    │
│  ├── IBLiteAuditSink?         (user callback)                 │
│  ├── BLiteMetrics?            (in-memory counters)            │
│  ├── SlowQueryThreshold       (TimeSpan)                      │
│  └── EnableDiagnosticSource   (bool — OpenTelemetry)          │
├───────────────────────────────────────────────────────────────┤
│  Hook 1: StorageEngine.CommitTransaction                      │
│  Hook 2: DocumentCollection.InsertDataCore                    │
│  Hook 3: BTreeQueryProvider.Execute<TResult>                  │
└───────────────────────────────────────────────────────────────┘
```

**Zero-overhead principle:** all hooks are guarded. With unconfigured options,
the JIT eliminates the branches (dead-code elimination). The database is as fast
as before if audit is not enabled.

---

## 🛠️ Technical Specifications

The detailed specification is in `BLite/AUDIT_IMPLEMENTATION.md`. Below is a summary
of the two implementation phases.

### PHASE 1 — Sink + In-process Metrics

**Files to create** in `src/BLite.Core/Audit/`:

#### `AuditEvents.cs` — Event record types
```csharp
public readonly record struct CommitAuditEvent(
    ulong TransactionId, string CollectionName,
    int PagesWritten, int WalSizeBytes, TimeSpan Elapsed);

public readonly record struct InsertAuditEvent(
    ulong TransactionId, string CollectionName,
    int DocumentSizeBytes, TimeSpan Elapsed);

public readonly record struct QueryAuditEvent(
    string CollectionName, QueryStrategy Strategy,
    string? IndexName, int ResultCount, TimeSpan Elapsed);
```

#### `IBLiteAuditSink.cs` — User interface
```csharp
public interface IBLiteAuditSink
{
    void OnInsert(InsertAuditEvent e)  { }
    void OnQuery(QueryAuditEvent e)    { }
    void OnCommit(CommitAuditEvent e)  { }
    void OnSlowOperation(SlowOperationEvent e) { }
}
```

#### `BLiteMetrics.cs` — In-memory counters (Interlocked)
Counters: `TotalInserts`, `TotalQueriesIndexScan`, `TotalQueriesBsonScan`,
`TotalQueriesFullScan`, `TotalCommits`, `PageCacheHits`, `PageCacheMisses`.
Derived properties: `AvgInsertMs`, `AvgQueryMs`, `CacheHitRate`.

**Hook points to modify:**
- `StorageEngine.CommitTransaction` → emits `CommitAuditEvent`
- `DocumentCollection.InsertDataCore` → emits `InsertAuditEvent`
- `BTreeQueryProvider.Execute<TResult>` → emits `QueryAuditEvent` + propagates `QueryStrategy`

**New public constructors:**
```csharp
// BLiteEngine
public BLiteEngine(string path, BLiteAuditOptions auditOptions) { ... }

// DocumentDbContext
protected DocumentDbContext(string path, BLiteAuditOptions auditOptions) { ... }
```

---

### PHASE 2 — DiagnosticSource / Activity + Slow Query

#### `BLiteDiagnostics.cs`
```csharp
public static class BLiteDiagnostics
{
    public static readonly ActivitySource ActivitySource =
        new("BLite.Core", BLiteVersion.Current);
}
```

- Emit `Activity` in `CommitTransaction` and `Execute<TResult>`
- `SlowOperationEvent` emitted when `Elapsed > SlowQueryThreshold`
- Propagate `QueryStrategy` and `IndexName` as OpenTelemetry tags

---

## 📦 Expected Output

- Complete Phase 1 implementation that compiles without errors on `net10.0` and `netstandard2.1`
- Phase 2 implementation (ActivitySource + slow query detection)
- Test suite (`tests/BLite.Tests/Audit/`) with at least 15 cases:
  - `IBLiteAuditSink` receives events for insert, query, commit
  - `BLiteMetrics` counters correct after sequential and concurrent operations
  - Slow query detection: event emitted if threshold exceeded, not emitted if below threshold
  - Zero overhead verified: performance with `null` options within 2% margin vs baseline
- Demo `BLiteSink` that writes events to the console (included in the test project)

## 📚 References

- `BLite/AUDIT_IMPLEMENTATION.md` — complete technical specification with C# code
- `BLite/src/BLite.Core/Storage/StorageEngine.cs` — CommitTransaction chokepoint
- `BLite/src/BLite.Core/Collections/DocumentCollection.cs` — InsertDataCore chokepoint
- `BLite/src/BLite.Core/Query/BTreeQueryProvider.cs` — Execute chokepoint
- `BLite/README.md` — project overview