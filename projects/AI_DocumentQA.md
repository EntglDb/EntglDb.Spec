# Progetto AI: Document Q&A — RAG su documenti locali

## 🎯 Obiettivo

Sviluppare un'applicazione **RAG (Retrieval-Augmented Generation)** che permette
all'utente di caricare un insieme di documenti (PDF, Word, testo) e di interrogarli
in linguaggio naturale, ottenendo risposte basate **esclusivamente** sul contenuto
caricato.

Progetto **platform-free**: il team sceglie la piattaforma preferita (web app,
console, Blazor, MAUI). Il database vettoriale può essere BLite (con HNSW vector
search), ma sono accettate anche alternative open source.

---

## 🧠 Problema da risolvere

Le aziende accumulano manuali tecnici, contratti, procedure interne e note di
riunione che rimangono inaccessibili perché ricercarli con keyword è inefficace.
Un sistema RAG trasforma documenti passivi in una **knowledge base conversazionale**.

---

## 🛠️ Specifiche Tecniche

### Pipeline RAG

```
FASE 1 — Indicizzazione (run once)
─────────────────────────────────
Documento (PDF/Word/txt)
    │
    ▼
┌──────────────────────┐
│  Chunking            │  Divide il testo in chunk da ~500 token con overlap ~50
└──────────────────────┘
    │
    ▼
┌──────────────────────┐
│  Embedding           │  Genera vettore float[] per ogni chunk
│                      │  (MiniLM-L6-v2 / OpenAI text-embedding-3-small)
└──────────────────────┘
    │
    ▼
┌──────────────────────┐
│  Vector Store        │  Salva chunk + embedding + metadata (documento, pagina)
│  (BLite HNSW o       │
│   alternativa)       │
└──────────────────────┘

FASE 2 — Ricerca e risposta (per ogni domanda)
──────────────────────────────────────────────
Domanda utente
    │
    ▼
┌──────────────────────┐
│  Query Embedding     │  Stessa pipeline embedding della fase 1
└──────────────────────┘
    │
    ▼
┌──────────────────────┐
│  ANN Search          │  Top-K chunk più simili (cosine similarity)
│  (HNSW Vector Index) │  K = 3..5
└──────────────────────┘
    │
    ▼
┌──────────────────────┐
│  Prompt Assembly     │  "Rispondi alla domanda usando SOLO questi estratti: ..."
└──────────────────────┘
    │
    ▼
┌──────────────────────┐
│  LLM Generation      │  Ollama locale / OpenAI API / HuggingFace
└──────────────────────┘
    │
    ▼
Risposta + citazioni (documento:pagina)
```

### Requisiti minimi

1. Caricare almeno 3 documenti PDF → indicizzazione automatica
2. Rispondere a domande in linguaggio naturale in ≤ 5 secondi (esclusa prima indicizzazione)
3. La risposta include sempre la **citazione** del documento e della sezione sorgente
4. Risponde "Non so" quando la risposta non è nei documenti caricati (no hallucination)
5. Interfaccia minimale: CLI o web form

### Componenti da implementare

#### A. Document Loader
- Parser PDF: `PdfPig` (C#) o `PyMuPDF` (Python) o equivalente
- Parser Word: `DocumentFormat.OpenXml` (C#) o `python-docx`
- Chunking: sliding window su paragrafi, rispettando i confini di frase

#### B. Embedding Service
Interfaccia `IEmbeddingService` con almeno una implementazione:
- `OllamaEmbeddingService` — chiama `POST /api/embeddings` su Ollama locale
- `OpenAiEmbeddingService` — usa `text-embedding-3-small` (1536 dim)
- `LocalOnnxEmbeddingService` — MiniLM-L6-v2 via ONNX Runtime (384 dim)

#### C. Vector Store
- Interfaccia `IVectorStore` con `Add(chunk, vector)` e `Search(query, k)`
- Implementazione suggerita **BLite** con `HasVectorIndex(x => x.Embedding, dimensions: 384, metric: Cosine)`
- Alternativa accettata: in-memory `List<(float[], Chunk)>` con brute-force cosine (per semplicità)

#### D. RAG Orchestrator
- Assembla il prompt con i chunk recuperati
- Rispetta il limite di token del modello (conta approssimativamente i token)
- Filtra i chunk sotto una soglia di similarità minima (es. cosine < 0.3 → scarta)

### Opzioni LLM

| Opzione | Privacy | Costo |
|---|---|---|
| Ollama locale (`llama3.2:3b`, `phi4-mini`) | Alta — tutto locale | Gratis |
| OpenAI `gpt-4o-mini` | Dati inviati a OpenAI | ~$0.002/query |
| HuggingFace Inference API | Dati inviati a HF | Free tier |

**Consigliato per il progetto:** Ollama locale — nessun costo, privacy totale, adatto
a documenti aziendali.

---

## 📦 Output Atteso

- Sistema funzionante con almeno 3 documenti di test (es. RFC, manuale utente, articolo)
- Almeno 10 domande/risposte documentate con citazioni corrette
- README con: piattaforma scelta, modello LLM usato, istruzioni di setup
- Valutazione qualitativa: percentuale di risposte corrette e pertinenti sul set di test

## 📚 Riferimenti

- Ollama: https://ollama.com/docs
- BLite Vector Search: `BLite/README.md` sezione "AI-Ready Vector Search"
- MiniLM-L6-v2 (ONNX): https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2
- PdfPig (C#): https://github.com/UglyToad/PdfPig
- Retrieval-Augmented Generation (paper originale): https://arxiv.org/abs/2005.11401
