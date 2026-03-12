# Progetto: EntglDb — Conflict Resolution avanzata (JSON Diff/Patch)

## 🎯 Obiettivo

Implementare una libreria .NET standalone `EntglDb.ConflictResolution` che estende
le capacità di risoluzione conflitti di EntglDb andando oltre la strategia
**Last-Write-Wins (LWW)** già presente, verso un merge intelligente basato su
**JSON Diff** e **JSON Patch (RFC 6902)**.

L'implementazione di riferimento `IConflictResolver` in `EntglDb.Net` è il punto
di partenza: questo progetto ne estende il contratto e lo arricchisce.

---

## 🧠 Concetto

Quando due nodi modificano lo stesso documento contemporaneamente, LWW scarta
silenziosamente le modifiche del "perdente". Con JSON Diff/Patch è possibile:

1. Calcolare il **delta** tra la versione base e ciascuna delle due versioni conflittuali.
2. **Unire automaticamente** le modifiche che non toccano gli stessi campi.
3. Gestire i **conflitti veri** (stesso campo modificato diversamente) con strategie configurabili.

**Esempio:**
```json
// Base document
{ "name": "Mario", "surname": "Rossi", "age": 30 }

// Node A modifica "name"
{ "name": "Mario Bianchi", "surname": "Rossi", "age": 30 }

// Node B modifica "age"
{ "name": "Mario", "surname": "Rossi", "age": 31 }

// Merge automatico → nessun conflitto reale
{ "name": "Mario Bianchi", "surname": "Rossi", "age": 31 }
```

---

## 🛠️ Specifiche Tecniche

### 1. Libreria `EntglDb.ConflictResolution`

Libreria .NET 8+ indipendente. Dipendenze: `System.Text.Json` (già incluso in .NET).
Nessuna dipendenza esterna obbligatoria — l'implementazione di JSON Diff/Patch è da fare da zero
(o tramite una libreria open source con licenza compatibile MIT).

**Interfaccia pubblica:**

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
    string Path,          // JSON Pointer RFC 6901 (es. "/address/city")
    JsonElement ValueA,
    JsonElement ValueB,
    MergeConflictType Type);

public enum MergeConflictType { ValueChanged, ArrayConflict, TypeMismatch }
```

### 2. Algoritmo di Merge — 3-way merge

```
Input:  baseJson  (snapshot al momento della fork)
        versionA  (modifica del nodo A)
        versionB  (modifica del nodo B)

Step 1: diffA = JsonDiff(base, versionA)   → lista di JsonPatch operations
Step 2: diffB = JsonDiff(base, versionB)   → lista di JsonPatch operations
Step 3: detectCollisions(diffA, diffB)     → path che appaiono in entrambi i diff
Step 4: applyPatch(base, diffA ∪ diffB non conflittuali)  → merged document
Step 5: per ogni collision → strategia configurabile
```

### 3. Strategie per i conflitti reali

| Strategia | Comportamento |
|---|---|
| `ThrowOnConflict` | Lancia `MergeConflictException` (default safe) |
| `PreferA` / `PreferB` | Applica sempre la versione di A o B |
| `PreferLatestHlc` | Applica la versione con HLC più recente (LWW per field) |
| `Custom(Func<MergeConflict, JsonElement>)` | Callback utente per ogni campo in conflitto |

### 4. Gestione degli Array

Gli array sono il caso più complesso. Implementare almeno due strategie:

- **`ReplaceArray`**: tratta l'array come valore atomico (LWW sull'array intero).
- **`AppendArray`**: concatena gli elementi aggiunti da A e B, rimuove quelli rimossi
  da entrambi. Richiede tracking degli ID degli elementi.

### 5. Integrazione con EntglDb

Dopo aver sviluppato e testato la libreria standalone, integrarla in `EntglDb.Net`
implementando:

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

## 📦 Output Atteso

- NuGet package (pubblicazione facoltativa) `EntglDb.ConflictResolution`
- Suite di unit test con almeno 30 casi:
  - Merge senza conflitti (campi disgiunti)
  - Merge con conflitti (stesso campo, strategie diverse)
  - Merge con array (append, replace)
  - Edge cases: documento null, document vuoto, nested objects
- Demo console che simula due nodi concorrenti e mostra il comportamento di merge
- Integrazione dimostrata in `EntglDb.Net` con `JsonDiffPatchResolver`

## 📚 Riferimenti

- `EntglDb.Net/src/EntglDb.Core/sync/IConflictResolver.cs`
- `EntglDb.Net/src/EntglDb.Core/sync/RecursiveMergeResolver.cs`
- RFC 6902 — JSON Patch: https://datatracker.ietf.org/doc/html/rfc6902
- RFC 6901 — JSON Pointer: https://datatracker.ietf.org/doc/html/rfc6901
