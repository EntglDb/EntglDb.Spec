# Progetto: EntglDb.Kotlin — Implementazione da zero

## 🎯 Obiettivo

Implementare da zero la libreria Kotlin di EntglDb, portando tutte le funzionalità
della versione di riferimento `.Net` (v1.0.0) su Android e JVM, a partire dallo
scaffold già predisposto nel repository `EntglDb.Kotlin`.

L'implementazione di riferimento completa è disponibile in `EntglDb.Net`.

---

## 📊 Stato di partenza

| Componente | Stato |
|---|---|
| `protocol/` | ✅ Definizione Protobuf v5 già presente e compilata |
| `core/` | 🔲 Da implementare |
| `persistence-sqlite/` | 🔲 Da implementare |
| `network/` | 🔲 Da implementare |
| `app/` | 🔲 Da implementare |

---

## 🛠️ Specifiche Tecniche

### Modulo `core` — Engine

Il core è il cuore dell'intera libreria. Implementa le strutture dati e la logica
di sincronizzazione, senza dipendenze da rete o storage.

**Classi principali da implementare:**

#### 1. `HlcTimestamp` — Hybrid Logical Clock
- Tre componenti: `wall: Long`, `logic: Int`, `node: String`
- Metodo `tick(wall: Long)`: avanza il clock garantendo monotonicità
- Metodo `receive(remote: HlcTimestamp, wall: Long)`: aggiorna il clock alla ricezione di un messaggio
- Serializzazione tramite `kotlinx.serialization`

#### 2. `VectorClock`
- Map `nodeId → HlcTimestamp`
- Metodo `dominates(other: VectorClock)`: confronto causale
- Metodo `merge(other: VectorClock)`: unione prendendo il max per ogni nodo

#### 3. `OplogEntry`
- Campi: `collection`, `key`, `operation` (Put/Delete), `jsonData`, `hlc`, `hash`, `previousHash`
- `hash` calcolato con SHA-256 su `(previousHash + collection + key + operation + jsonData + hlc)`
- Verifica dell'integrità della catena: `verifyChain(entries: List<OplogEntry>): Boolean`

#### 4. `IConflictResolver`
- Interfaccia con metodo `resolve(base: String?, local: String, remote: String): String`
- Implementazione `LastWriteWinsResolver`: usa l'HLC per selezionare il winner
- Implementazione `RecursiveMergeResolver`: unione ricorsiva dei campi JSON non in conflitto

#### 5. `PeerDatabase`
- Gestisce una `Collection` di `PeerCollection`
- Metodi: `put(collection, key, json)`, `delete(collection, key)`, `find(collection, key)`
- Osserva le scritture locali e genera `OplogEntry` (CDC pattern)

---

### Modulo `persistence-sqlite` — Storage

Implementa `IPeerStorage` usando `androidx.sqlite:sqlite-ktx`.

**Tabelle da creare:**
```sql
CREATE TABLE oplog (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    collection TEXT NOT NULL,
    key TEXT NOT NULL,
    operation TEXT NOT NULL,
    json_data TEXT,
    hlc_wall INTEGER NOT NULL,
    hlc_logic INTEGER NOT NULL,
    hlc_node TEXT NOT NULL,
    hash TEXT NOT NULL,
    previous_hash TEXT
);

CREATE TABLE vector_clock (
    node_id TEXT PRIMARY KEY,
    hlc_wall INTEGER NOT NULL,
    hlc_logic INTEGER NOT NULL
);

CREATE TABLE documents (
    collection TEXT NOT NULL,
    key TEXT NOT NULL,
    json_data TEXT NOT NULL,
    PRIMARY KEY (collection, key)
);
```

---

### Modulo `network` — P2P Networking

Usa Ktor TCP + Brotli compression + crittografia simmetrica.

#### 1. Handshake (Protocollo v5)
- I messaggi sono framed con il `MessageType` enum (1 byte) + 4 byte length + payload Protobuf
- Handshake: scambio di `node_id`, `auth_token`, `supported_compression`, `interesting_collections`
- Crittografia: exchange di chiave via ECDH → AES-256-GCM per il payload (SecureEnvelope)

#### 2. `TcpPeerClient`
- Connessione TCP a un peer remoto
- Gestione reconnect automatica con backoff esponenziale
- Metodi: `pushChanges(entries)`, `pullChanges(since)`, `getVectorClock()`

#### 3. `TcpPeerServer`
- Accetta connessioni TCP in ingresso (Ktor server socket)
- Dispatching dei messaggi al `SyncOrchestrator`

#### 4. `UdpDiscovery`
- Broadcast UDP sulla LAN (porta 7890) per scoprire peers
- Messaggio di discovery: JSON con `nodeId` e porta TCP
- Notifica il `SyncOrchestrator` alla scoperta di nuovi peers

#### 5. `SyncOrchestrator`
- Gossip loop ogni 2 secondi
- Per ogni peer connesso: invia e riceve `OplogEntry` mancanti
- Gap Recovery: se il peer è troppo indietro, invia uno snapshot

---

### Modulo `app` — Sample Android

Applicazione Android con Jetpack Compose che dimostra la sincronizzazione in tempo reale
tra dispositivi sulla stessa LAN.

**Funzionalità minime:**
- Lista TODO condivisa tra due dispositivi
- Indicatore di stato connessione (online/offline)
- Visualizzazione del VectorClock corrente
- Risoluzione manuale di conflitti (dialog di scelta)

---

## 📦 Output Atteso

- Implementazione compilante di tutti e quattro i moduli
- Test unitari per `core`: `VectorClock`, `HlcTimestamp`, `OplogEntry` (verifica chain)
- Test di integrazione: due istanze `PeerDatabase` che si sincronizzano in-process
- App Android funzionante con demo di sync LAN

## 📚 Riferimenti

- `EntglDb.Net/src/EntglDb.Core/` — implementazione C# di riferimento
- `EntglDb.Net/src/EntglDb.Network/` — implementazione rete di riferimento
- `protocol/src/main/proto/sync.proto` — protocollo v5 definito
- `EntglDb.Net/README.md` — architettura generale
