# Brief: Sample Application Project Ideas with EntglDb

This brief collects real-world application scenarios in which EntglDb can be used
as a synchronization middleware. Teams are free to choose the platform
(Android, Windows, Web, console) and technology stack, as long as they use EntglDb.Net or
EntglDb.Kotlin as the sync layer.

---

## 📋 What a sample application project must do

1. **Define at least one synchronized collection** via `WatchCollection()`.
2. **Work offline**: reads and writes must work without a network connection.
3. **Synchronize automatically** when two instances are on the same LAN.
4. **Handle at least one conflict** in a way that makes sense for the application domain.
5. Expose a **minimal UI** that shows the sync status (connected/offline badge).

---

## 💡 Proposed Ideas

### A. Collaborative shopping list

Mobile app (Android) to manage a shared shopping list among family members.
Each device can add, tick, or remove items.
Synchronization happens over LAN (home Wi-Fi) without needing a cloud server.

**Collections:** `shopping_items`
**Typical conflict:** an item ticked on one device and modified on another.
**Suggested strategy:** recursive merge + "ticked" wins.

---

### B. Offline-first attendance register

Desktop/tablet application to record attendance at an office or event.
One operator per room records those present; data syncs between all tablets
at the end of the day (even via a local hotspot without internet).

**Collections:** `attendees`, `check_ins`
**Typical conflict:** the same person registered by two different operators.
**Suggested strategy:** merge on the most recent `check_in_time` (HLC).

---

### C. Multi-workstation warehouse inventory

System for small warehouses with multiple workstations.
Each workstation (Windows / Android tablet) can enter stock in/out movements.
Synchronization happens over LAN; no internet connection required.

**Collections:** `products`, `movements`
**Typical conflict:** two operators modify the same product simultaneously.
**Suggested strategy:** append movements (immutable log), recalculate stock on read.

---

### D. Field inspection notes

Mobile app for technicians performing field inspections (e.g., facilities, stores).
Notes are written offline; they sync when the technician returns to the office
and connects to the company LAN.

**Collections:** `inspections`, `photos_metadata`
**Typical conflict:** supervisor modifies a note while the technician is updating it.
**Suggested strategy:** separate document sections (conflicts very rare); if they occur, manual merge with a UI dialog.

---

## 📦 Expected Output (for any chosen idea)

- Working application with at least 2 instances synchronizable on the same LAN
- Source code with a README explaining how to start the instances
- Demonstration of at least one conflict case and its resolution
- Integration test with two in-process `PeerDatabase` instances

## 📚 References

- `EntglDb.Net/README.md` — Quick Start and Integration Guide
- `EntglDb.Net/samples/` — official examples
- `EntglDb.Kotlin/README.md` — Android scaffold
