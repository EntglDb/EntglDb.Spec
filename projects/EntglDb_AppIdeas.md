# Traccia: Idee di Progetto Applicativo con EntglDb

Questa traccia raccoglie scenari applicativi reali nei quali EntglDb può essere usato
come middleware di sincronizzazione. I team sono liberi di scegliere la piattaforma
(Android, Windows, Web, console) e lo stack tecnologico, purché usino EntglDb.Net o
EntglDb.Kotlin come layer di sync.

---

## 📋 Cosa deve fare un progetto applicativo

1. **Definire almeno una collezione sincronizzata** tramite `WatchCollection()`.
2. **Funzionare offline**: lettura e scrittura devono funzionare senza rete.
3. **Sincronizzarsi automaticamente** quando due istanze sono sulla stessa LAN.
4. **Gestire almeno un conflitto** in modo sensato per il dominio applicativo.
5. Esporre una **UI minimale** che mostri lo stato di sync (badge connesso/offline).

---

## 💡 Idee Proposte

### A. Lista della spesa collaborativa

App mobile (Android) per gestire una lista della spesa condivisa tra i membri della famiglia.
Ogni dispositivo può aggiungere, spuntare o rimuovere articoli.
La sincronizzazione avviene via LAN (Wi-Fi di casa) senza necessità di un server cloud.

**Collezioni:** `shopping_items`
**Conflitto tipico:** un articolo spuntato su un dispositivo e modificato su un altro.
**Strategia suggerita:** merge ricorsivo + "spuntato" vince.

---

### B. Registro presenze offline-first

Applicazione desktop/tablet per registrare le presenze in un ufficio o in un evento.
Un operatore per sala registra i presenti; i dati si sincronizzano tra tutti i tablet
al termine della giornata (anche tramite hotspot locale senza internet).

**Collezioni:** `attendees`, `check_ins`
**Conflitto tipico:** stessa persona registrata da due operatori diversi.
**Strategia suggerita:** merge per `check_in_time` più recente (HLC).

---

### C. Inventario di magazzino multi-postazione

Sistema per piccoli magazzini con più postazioni di lavoro.
Ogni postazione (Windows / Android tablet) può inserire movimenti di carico/scarico.
La sincronizzazione avviene via LAN; non è richiesta connessione internet.

**Collezioni:** `products`, `movements`
**Conflitto tipico:** due operatori modificano lo stesso prodotto contemporaneamente.
**Strategia suggerita:** append dei movimenti (immutable log), ricalcolo stock in lettura.

---

### D. Note di campo per ispezioni

App mobile per tecnici che effettuano ispezioni sul campo (es. impianti, negozi).
Le note vengono scritte offline; si sincronizzano quando il tecnico rientra in ufficio
e si collega alla LAN aziendale.

**Collezioni:** `inspections`, `photos_metadata`
**Conflitto tipico:** supervisore modifica una nota mentre il tecnico la aggiorna.
**Strategia suggerita:** sezioni separate del documento (conflitti rarissimi); in caso, merge manuale con dialog UI.

---

## 📦 Output Atteso (per qualsiasi idea scelta)

- Applicazione funzionante con almeno 2 istanze sincronizzabili sulla stessa LAN
- Codice sorgente con README che spiega come avviare le istanze
- Dimostrazione di almeno un caso di conflitto e della sua risoluzione
- Test di integrazione con due `PeerDatabase` in-process

## 📚 Riferimenti

- `EntglDb.Net/README.md` — Quick Start e Integration Guide
- `EntglDb.Net/samples/` — esempi ufficiali
- `EntglDb.Kotlin/README.md` — scaffold Android
