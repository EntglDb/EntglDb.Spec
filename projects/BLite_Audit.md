# Progetto: BLite — Audit & Performance Monitoring

## 🎯 Obiettivo

Implementare il sistema di **audit e monitoraggio delle performance** per BLite,
come descritto nella specifica tecnica dettagliata in `BLite/AUDIT_IMPLEMENTATION.md`.

BLite è un database embedded .NET ad alte prestazioni (ACID, BSON, zero-allocation).
Questo progetto aggiunge visibilità interna al motore: ogni operazione importante
emette un evento che può essere intercettato dall'applicazione ospite per logging,
metriche, alert su slow query, e integrazione con OpenTelemetry.

---

## 🧠 Architettura del sistema di Audit

Il sistema si compone di tre elementi ortogonali:

```
┌───────────────────────────────────────────────────────────────┐
│  BLiteAuditOptions  (configurata nel costruttore dell'engine) │
│  ├── IBLiteAuditSink?         (callback utente)               │
│  ├── BLiteMetrics?            (contatori in-memory)           │
│  ├── SlowQueryThreshold       (TimeSpan)                      │
│  └── EnableDiagnosticSource   (bool — OpenTelemetry)          │
├───────────────────────────────────────────────────────────────┤
│  Punto 1: StorageEngine.CommitTransaction                     │
│  Punto 2: DocumentCollection.InsertDataCore                   │
│  Punto 3: BTreeQueryProvider.Execute<TResult>                 │
└───────────────────────────────────────────────────────────────┘
```

**Principio zero-overhead:** tutti gli hook sono protetti da guard. Con opzioni non
configurate, il JIT elimina i branch (dead-code elimination). Il database è as fast
as before se l'audit non viene abilitato.

---

## 🛠️ Specifiche Tecniche

La specifica dettagliata è in `BLite/AUDIT_IMPLEMENTATION.md`. Di seguito il riassunto
delle due fasi di implementazione.

### FASE 1 — Sink + Metriche in-process

**File da creare** in `src/BLite.Core/Audit/`:

#### `AuditEvents.cs` — Record types degli eventi
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

#### `IBLiteAuditSink.cs` — Interfaccia utente
```csharp
public interface IBLiteAuditSink
{
    void OnInsert(InsertAuditEvent e)  { }
    void OnQuery(QueryAuditEvent e)    { }
    void OnCommit(CommitAuditEvent e)  { }
    void OnSlowOperation(SlowOperationEvent e) { }
}
```

#### `BLiteMetrics.cs` — Contatori in-memory (Interlocked)
Contatori: `TotalInserts`, `TotalQueriesIndexScan`, `TotalQueriesBsonScan`,
`TotalQueriesFullScan`, `TotalCommits`, `PageCacheHits`, `PageCacheMisses`.
Proprietà derivate: `AvgInsertMs`, `AvgQueryMs`, `CacheHitRate`.

**Punti di hook da modificare:**
- `StorageEngine.CommitTransaction` → emette `CommitAuditEvent`
- `DocumentCollection.InsertDataCore` → emette `InsertAuditEvent`
- `BTreeQueryProvider.Execute<TResult>` → emette `QueryAuditEvent` + propaga `QueryStrategy`

**Nuovi costruttori pubblici:**
```csharp
// BLiteEngine
public BLiteEngine(string path, BLiteAuditOptions auditOptions) { ... }

// DocumentDbContext
protected DocumentDbContext(string path, BLiteAuditOptions auditOptions) { ... }
```

---

### FASE 2 — DiagnosticSource / Activity + Slow Query

#### `BLiteDiagnostics.cs`
```csharp
public static class BLiteDiagnostics
{
    public static readonly ActivitySource ActivitySource =
        new("BLite.Core", BLiteVersion.Current);
}
```

- Emissione di `Activity` in `CommitTransaction` e `Execute<TResult>`
- `SlowOperationEvent` emesso quando `Elapsed > SlowQueryThreshold`
- Propagazione di `QueryStrategy` e `IndexName` come tag OpenTelemetry

---

## 📦 Output Atteso

- Implementazione completa di Fase 1 che compila senza errori su `net10.0` e `netstandard2.1`
- Implementazione di Fase 2 (ActivitySource + slow query detection)
- Suite di test (`tests/BLite.Tests/Audit/`) con almeno 15 casi:
  - `IBLiteAuditSink` riceve eventi per insert, query, commit
  - `BLiteMetrics` contatori corretti dopo operazioni sequenziali e concorrenti
  - Slow query detection: evento emesso se soglia superata, non emesso se sotto soglia
  - Zero overhead verificato: performance con `null` options entro margine del 2% vs baseline
- Demo `BLiteSink` che scrive gli eventi su console (incluso nel progetto di test)

## 📚 Riferimenti

- `BLite/AUDIT_IMPLEMENTATION.md` — specifica tecnica completa con codice C#
- `BLite/src/BLite.Core/Storage/StorageEngine.cs` — chokepoint CommitTransaction
- `BLite/src/BLite.Core/Collections/DocumentCollection.cs` — chokepoint InsertDataCore
- `BLite/src/BLite.Core/Query/BTreeQueryProvider.cs` — chokepoint Execute
- `BLite/README.md` — panoramica del progetto
