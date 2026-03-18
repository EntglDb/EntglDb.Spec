# AI Project: Document Q&A — RAG on local documents

## 🎯 Goal

Develop a **RAG (Retrieval-Augmented Generation)** application that lets the user
load one or more documents (PDF, `.txt`, `.md`) and interrogate them in **natural
language**, receiving accurate answers with citations to the source passages.

**Platform-free**: the team chooses the preferred platform (console, web, desktop).

---

## 🧠 Problem to solve

LLMs have a knowledge cut-off and do not know the contents of _your_ documents.
RAG solves this by splitting the documents into chunks, converting them to
**vector embeddings**, and retrieving the most relevant chunks for each question.
The LLM then answers using _only_ those chunks — avoiding hallucinations and
providing verifiable citations.

This project uses **BLite** as the vector store (HNSW index built-in).

---

## 🛠️ Technical Specifications

### Processing pipeline

```
PHASE 1 — Indexing (run once per document)

Document (PDF / txt / md)
    │
    ▼
┌─────────────────┐
│  Text Chunking  │  Split into chunks of ~512 tokens with overlap
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Embedding      │  IEmbeddingService → float[] vector
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  BLite Store    │  IVectorStore.StoreChunkAsync(chunk, vector)
└─────────────────┘


PHASE 2 — Search and answer (for each user question)

User question
    │
    ▼
┌─────────────────┐
│  Embedding      │  Embed the question → float[] vector
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  BLite Search   │  IVectorStore.SearchAsync(vector, topK: 5)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  LLM Prompt     │  "Answer the question using ONLY the following passages: ..."
└────────┬────────┘
         │
         ▼
     Answer + citations
```

### Key interfaces

```csharp
public interface IEmbeddingService
{
    Task<float[]> EmbedAsync(string text, CancellationToken ct = default);
}

public interface IVectorStore
{
    Task StoreChunkAsync(DocumentChunk chunk, float[] embedding, CancellationToken ct = default);
    Task<IReadOnlyList<SearchResult>> SearchAsync(float[] queryEmbedding, int topK, CancellationToken ct = default);
}

public record DocumentChunk(string DocumentId, int ChunkIndex, string Text, string Source);
public record SearchResult(DocumentChunk Chunk, float Score);
```

### Component A — Chunking

- Split documents into chunks of ~512 tokens
- Overlap of ~50 tokens between consecutive chunks
- Preserve paragraph/sentence boundaries where possible

### Component B — Embedding

The team chooses one of the following:

| Option | Privacy | Cost | Notes |
|---|---|---|---|
| `all-MiniLM-L6-v2` (local, ONNX/Fastembed) | High — everything local | Free | Recommended for this project |
| OpenAI `text-embedding-3-small` | Data sent to OpenAI | ~$0.02/1M tokens | |
| HuggingFace Inference API | Data sent to HF | Free tier | |

**Recommended**: `all-MiniLM-L6-v2` — no cost, full privacy, suitable for corporate documents.

### Component C — BLite Vector Store

Example BLite storage code:

```csharp
var col = engine.GetOrCreateCollection("chunks");

// Store
await col.InsertAsync(new BsonDocument
{
    ["documentId"] = chunk.DocumentId,
    ["chunkIndex"]  = chunk.ChunkIndex,
    ["text"]        = chunk.Text,
    ["source"]      = chunk.Source,
    ["embedding"]   = new BsonArray(embedding.Select(f => (BsonValue)f))
});

// Search (HNSW)
var results = await col.VectorSearchAsync("embedding", queryVector, topK: 5);
```

### Component D — LLM for answers

The team chooses one of the following:

| Option | Notes |
|---|---|
| Local Ollama (`llama3.2:3b` or `phi3:mini`) | Recommended — fully offline |
| OpenAI `gpt-4o-mini` | Fast and cheap, but requires internet |
| HuggingFace Inference API | Free tier available |

### Minimum requirements

1. Index at least 3 real documents (PDF or text) of at least 5 pages each
2. Answer questions in natural language with passage citations
3. Processing entirely local (no mandatory cloud APIs)
4. Response time for a question: < 30 seconds on a standard laptop
5. Simple UI (CLI or web form or desktop)

### Advanced requirements (optional)

- Support for multi-document queries ("From all loaded documents, which one mentions X?")
- Chat history: the LLM remembers the last N exchanges
- Filter by document during search (e.g. "search only in document X")
- Performance evaluation with a set of 10 Q&A pairs

---

## 📦 Expected Output

- Working application with indexed documentation
- At least 3 test documents with 10 pre-defined Q&A pairs for evaluation
- README with: platform, AI stack, chunking choices, execution instructions
- Qualitative evaluation: % of correct answers on the 10 test pairs

## 📚 References

- RAG — original paper: https://arxiv.org/abs/2005.11401
- BLite HNSW: `BLite.Core.VectorIndex` (in the BLite repository)
- Fastembed (ONNX embeddings for .NET): https://github.com/Anilturaga/fastembed-sharp
- Ollama: https://ollama.com
- LangChain RAG tutorial (Python, as conceptual reference): https://python.langchain.com/docs/tutorials/rag/