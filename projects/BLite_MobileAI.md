# Progetto: BLite Mobile + AI (MAUI / Android + ML.NET)

## 🎯 Obiettivo

Sviluppare un'applicazione mobile **.NET MAUI** (o nativa Android in C#) che utilizza
**BLite** come database embedded locale e **ML.NET** con un modello AI minimale
(Mini LLM o modello di classificazione/NLP) per arricchire i dati con intelligenza
artificiale direttamente sul dispositivo — senza cloud, senza connessione obbligatoria.

BLite è compatibile con `netstandard2.1`, il che lo rende adatto a MAUI e Xamarin
senza alcuna modifica.

---

## 🧠 Scenario di riferimento

**"Smart Notes"** — un'app di note personali che:
1. Salva le note in BLite (veloce, embedded, ACID, zero dipendenze).
2. Classifica automaticamente ogni nota con un **tag** (Lavoro, Personale, Idea, Todo, ...)
   usando un modello ML.NET addestrato on-device.
3. Genera un **riassunto** o una **lista di parole chiave** con un modello di estrazione
   NLP minimale (es. TF-IDF, sentence embeddings, o un ONNX model leggero).
4. Permette di cercare per somiglianza vettoriale usando l'**HNSW Vector Search** di BLite.

Il team è libero di scegliere un dominio applicativo diverso (inventario, spese, ispezioni)
purché rispetti i vincoli tecnici.

---

## 🛠️ Specifiche Tecniche

### Stack tecnologico

| Componente | Tecnologia |
|---|---|
| App | .NET MAUI o Android (Xamarin-compatible) |
| Database locale | BLite (netstandard2.1) |
| AI / ML | ML.NET + ONNX Runtime |
| Modello AI | TinyBERT / MiniLM-L6 (ONNX, ~23 MB) oppure modello custom ML.NET |
| UI | .NET MAUI Shell o Jetpack Compose |

### 1. Integrazione BLite

```csharp
// Configurazione database su dispositivo mobile
var dbPath = Path.Combine(FileSystem.AppDataDirectory, "notes.db");
using var db = new NotesDbContext(dbPath);

// Operazione CRUD standard
db.Notes.Insert(new Note { Title = "Riunione", Content = "...", CreatedAt = DateTime.UtcNow });

// Vector Search per note simili
var similar = db.Notes.AsQueryable()
    .VectorSearch(n => n.Embedding, queryVector, k: 5)
    .ToList();
```

Il `DbContext` deve usare il costruttore con `BLiteAuditOptions` se il team ha
anche completato il progetto BLite Audit (opzionale, ma consigliato).

### 2. Pipeline ML.NET

```
Testo della nota
      │
      ▼
┌──────────────────────┐
│  Text Featurizer     │  ML.NET: normalizzazione, tokenizzazione
└──────────────────────┘
      │
      ▼
┌──────────────────────┐
│  Classification      │  ML.NET multiclass classification (5 categorie)
│  (FastForest o SDCA) │  → tag automatico
└──────────────────────┘
      │
      ▼
┌──────────────────────┐
│  Sentence Embedding  │  ONNX: MiniLM-L6-v2 oppure custom embeddings
│  (ONNX Runtime)      │  → vector float[384]
└──────────────────────┘
      │
      ▼
┌──────────────────────┐
│  BLite Vector Index  │  HNSW salva l'embedding e permette ricerca ANN
│  (n => n.Embedding)  │
└──────────────────────┘
```

### 3. Modello di classificazione (ML.NET)

Il team deve:
1. Preparare un dataset di training (minimo 200 esempi) in formato CSV:
   `text,label` dove `label` è uno tra `work`, `personal`, `idea`, `todo`, `other`.
2. Addestrare il modello con ML.NET `MulticlassClassification`.
3. Esportare e caricare il modello `.zip` come risorsa embedded nell'app.
4. Classificare ogni nota al momento del salvataggio (pipeline asincrona, non blocca la UI).

### 4. ONNX Embedding (opzionale ma consigliato)

- Scaricare `all-MiniLM-L6-v2` in formato ONNX da HuggingFace (~23 MB).
- Integrare tramite `Microsoft.ML.OnnxRuntime` o `Microsoft.ML.OnnxTransformer`.
- Generare un `float[]` di dimensione 384 per ogni nota.
- Configurare un `VectorIndex` su BLite e salvare l'embedding.
- Implementare la ricerca "Note simili a questa" nella UI.

### 5. Funzionalità UI richieste

- Lista note con tag colorati (classificati da ML)
- Editor di nota con salvataggio automatico
- Barra di ricerca: ricerca full-text + ricerca per similarità vettoriale
- Schermata debug (facoltativa): mostra metriche BLite (`BLiteMetrics`) se disponibili

---

## 📦 Output Atteso

- App MAUI compilante su Android (API 24+) o Windows
- BLite usato come unico storage (no SQLite separato, no file JSON)
- Modello ML.NET classificazione funzionante con accuracy ≥ 75% sul test set
- Vector search dimostrabile nell'UI (minimum: bottone "Note simili")
- README con istruzioni per build e demo

## 📚 Riferimenti

- `BLite/README.md` — Vector Search HNSW, LINQ, CDC
- `BLite/src/BLite.Core/` — codice sorgente engine
- [ML.NET docs](https://learn.microsoft.com/dotnet/machine-learning/)
- [ONNX Runtime per .NET](https://onnxruntime.ai/docs/get-started/with-csharp.html)
- [MiniLM-L6-v2 ONNX su HuggingFace](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [.NET MAUI Getting Started](https://learn.microsoft.com/dotnet/maui/get-started/first-app)
