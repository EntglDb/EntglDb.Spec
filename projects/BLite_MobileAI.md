# Project: BLite Mobile + AI (MAUI / Android + ML.NET)

## 🎯 Goal

Develop a **.NET MAUI** mobile application (or native Android in C#) that uses
**BLite** as the local embedded database and **ML.NET** with a minimal AI model
(Mini LLM or classification/NLP model) to enrich data with artificial intelligence
directly on the device — without cloud, without a mandatory connection.

BLite is compatible with `netstandard2.1`, making it suitable for MAUI and Xamarin
without any modifications.

---

## 🧠 Reference scenario

**"Smart Notes"** — a personal notes app that:
1. Saves notes in BLite (fast, embedded, ACID, zero dependencies).
2. Automatically classifies each note with a **tag** (Work, Personal, Idea, Todo, ...)
   using an ML.NET model trained on-device.
3. Generates a **summary** or a **list of keywords** with a minimal NLP extraction model
   (e.g. TF-IDF, sentence embeddings, or a lightweight ONNX model).
4. Allows searching by vector similarity using BLite's **HNSW Vector Search**.

The team is free to choose a different application domain (inventory, expenses, inspections)
as long as it meets the technical constraints.

---

## 🛠️ Technical Specifications

### Technology stack

| Component | Technology |
|---|---|
| App | .NET MAUI or Android (Xamarin-compatible) |
| Local database | BLite (netstandard2.1) |
| AI / ML | ML.NET + ONNX Runtime |
| AI model | TinyBERT / MiniLM-L6 (ONNX, ~23 MB) or custom ML.NET model |
| UI | .NET MAUI Shell or Jetpack Compose |

### 1. BLite Integration

```csharp
// Database setup on mobile device
var dbPath = Path.Combine(FileSystem.AppDataDirectory, "notes.db");
using var db = new NotesDbContext(dbPath);

// Standard CRUD operation
db.Notes.Insert(new Note { Title = "Meeting", Content = "...", CreatedAt = DateTime.UtcNow });

// Vector Search for similar notes
var similar = db.Notes.AsQueryable()
    .VectorSearch(n => n.Embedding, queryVector, k: 5)
    .ToList();
```

The `DbContext` should use the constructor with `BLiteAuditOptions` if the team has
also completed the BLite Audit project (optional, but recommended).

### 2. ML.NET Pipeline

```
Note text
      │
      ▼
┌──────────────────────┐
│  Text Featurizer     │  ML.NET: normalization, tokenization
└──────────────────────┘
      │
      ▼
┌──────────────────────┐
│  Classification      │  ML.NET multiclass classification (5 categories)
│  (FastForest or SDCA)│  → automatic tag
└──────────────────────┘
      │
      ▼
┌──────────────────────┐
│  Sentence Embedding  │  ONNX: MiniLM-L6-v2 or custom embeddings
│  (ONNX Runtime)      │  → float[384] vector
└──────────────────────┘
      │
      ▼
┌──────────────────────┐
│  BLite Vector Index  │  HNSW stores the embedding and enables ANN search
│  (n => n.Embedding)  │
└──────────────────────┘
```

### 3. Classification model (ML.NET)

The team must:
1. Prepare a training dataset (minimum 200 examples) in CSV format:
   `text,label` where `label` is one of `work`, `personal`, `idea`, `todo`, `other`.
2. Train the model with ML.NET `MulticlassClassification`.
3. Export and load the `.zip` model as an embedded resource in the app.
4. Classify each note at save time (async pipeline, does not block the UI).

### 4. ONNX Embedding (optional but recommended)

- Download `all-MiniLM-L6-v2` in ONNX format from HuggingFace (~23 MB).
- Integrate via `Microsoft.ML.OnnxRuntime` or `Microsoft.ML.OnnxTransformer`.
- Generate a `float[]` of dimension 384 for each note.
- Configure a `VectorIndex` on BLite and save the embedding.
- Implement the "Notes similar to this" search in the UI.

### 5. Required UI features

- Note list with coloured tags (classified by ML)
- Note editor with auto-save
- Search bar: full-text search + vector similarity search
- Debug screen (optional): shows BLite metrics (`BLiteMetrics`) if available

---

## 📦 Expected Output

- MAUI app that compiles on Android (API 24+) or Windows
- BLite used as the sole storage (no separate SQLite, no JSON files)
- Working ML.NET classification model with accuracy ≥ 75% on the test set
- Vector search demonstrable in the UI (minimum: "Similar notes" button)
- README with build and demo instructions

## 📚 References

- `BLite/README.md` — Vector Search HNSW, LINQ, CDC
- `BLite/src/BLite.Core/` — engine source code
- [ML.NET docs](https://learn.microsoft.com/dotnet/machine-learning/)
- [ONNX Runtime for .NET](https://onnxruntime.ai/docs/get-started/with-csharp.html)
- [MiniLM-L6-v2 ONNX on HuggingFace](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2)
- [.NET MAUI Getting Started](https://learn.microsoft.com/dotnet/maui/get-started/first-app)