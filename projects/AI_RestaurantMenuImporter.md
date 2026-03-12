# Progetto AI: Restaurant Menu Importer

## 🎯 Obiettivo

Sviluppare un'applicazione che legge il menu di un ristorante da una **pagina web** o
da **testo libero** (incollato dall'utente), lo analizza con un modello AI e produce
un **JSON strutturato** con le portate, le categorie, i prezzi e le descrizioni.

Progetto **platform-free**: il team può scegliere la piattaforma preferita
(web app, console, app desktop, mobile). La libreria AI/ML da usare è libera.

---

## 🧠 Problema da risolvere

I menu dei ristoranti in rete esistono in centinaia di formati diversi: pagine HTML
disomogenee, PDF scannerizzati, post Instagram, file Word. Aggregatori come TheFork
o Google Maps devono "estrarre" struttura da testo non strutturato.

Questo progetto è un **estrattore intelligente**: dato un menu in qualsiasi formato testuale,
produce un JSON canonico e usabile da qualsiasi sistema gestionale.

---

## 🛠️ Specifiche Tecniche

### Input accettati

- URL di una pagina web con il menu del ristorante (scraping + estrazione testo)
- Testo libero incollato dall'utente (copia-incolla da PDF o Word)
- File `.txt` o `.md`

### Output JSON atteso

```json
{
  "restaurant": "Trattoria da Mario",
  "currency": "EUR",
  "categories": [
    {
      "name": "Antipasti",
      "items": [
        {
          "name": "Bruschetta al pomodoro",
          "description": "Pane tostato con pomodoro fresco e basilico",
          "price": 6.50,
          "allergens": ["gluten"],
          "tags": ["vegetarian"]
        }
      ]
    },
    {
      "name": "Primi Piatti",
      "items": [ ... ]
    }
  ]
}
```

### Pipeline di elaborazione

```
URL / Testo
    │
    ▼
┌─────────────────────────┐
│  Fetch & Clean          │  HTTP GET + strip HTML tags (se URL)
│                         │  Oppure accetta testo grezzo
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  AI Extraction          │  Prompt a un LLM via API (OpenAI / Ollama locale)
│                         │  oppure modello NER locale (Hugging Face / ML.NET)
│  Prompt suggerito:      │
│  "Estrai il menu dal    │
│  testo seguente e       │
│  restituisci JSON nel   │
│  formato [schema]..."   │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  Validation & Cleanup   │  Valida il JSON, normalizza prezzi (virgola → punto)
│                         │  Deduplicazione categorie, trim testi
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  Output                 │  JSON su file / clipboard / API response
└─────────────────────────┘
```

### Integrazione AI — opzioni

Il team sceglie una delle seguenti:

| Opzione | Costo | Offline |
|---|---|---|
| OpenAI API (`gpt-4o-mini`) | ~$0.001/menu | No |
| Ollama locale (`llama3.2:3b`) | Gratis | Sì |
| HuggingFace Inference API | Free tier | No |
| ML.NET + modello ONNX custom | Gratis | Sì |

La scelta va documentata nel README con motivazione.

### Requisiti minimi

1. Funziona con almeno 5 menu di ristoranti reali diversi (da allegare come test cases)
2. Produce JSON valido e conforme allo schema in ogni caso
3. Gestisce testi in **italiano** e **inglese**
4. Gestisce la mancanza del prezzo (campo `null`, non errore)
5. Interfaccia utente minimale (web form, CLI con argomenti, o form desktop)

### Requisiti avanzati (opzionali)

- Rilevamento automatico degli **allergeni** (gluten, lactose, nuts, …) dal testo
- Tag automatici (`vegetarian`, `vegan`, `spicy`)
- Stima del prezzo quando mancante, basata su portate simili nel menu
- Export in formato CSV oltre che JSON

---

## 📦 Output Atteso

- Applicazione funzionante nella piattaforma scelta
- Almeno 5 test cases con menu reali (URL o file testo) e JSON atteso
- README con: piattaforma scelta, stack AI, istruzioni di esecuzione
- Valutazione qualitativa dell'accuracy su un set di 10 menu

## 📚 Riferimenti

- OpenAI structured output: https://platform.openai.com/docs/guides/structured-outputs
- Ollama (LLM locale): https://ollama.com
- JSON Schema per validazione output
