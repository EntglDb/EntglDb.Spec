# Project: EntglDb.Studio Development

## 🎯 Objective
Develop a complete Desktop Application ("Management Studio") to administer, inspect, and manage EntglDb clusters. The application must serve as a control panel for developers and system administrators.

## 🛠️ Technologies
- **Platform**: .NET 8+.
- **UI Framework**: AvaloniaUI (preferred for cross-platform) or WPF/WinUI 3.
- **Libraries**: `EntglDb.Net` (to connect as a peer or client).

## 🗺️ Required Features

### 1. Cluster Dashboard
- Graphical visualization of cluster topology (Nodes, Connections).
- Node status (Online/Offline, RTT, Current Leader).
- Real-time metrics (Ops/sec, Network traffic).

### 2. Data Explorer
- Navigation between Collections (Tables).
- JSON document visualization with highlighting.
- **CRUD Editor**: Create, Edit, and Delete documents via GUI.
- Change history inspection (Oplog visualizer per single document).
- VectorClock and synchronization status visualization.

### 3. Server Management
- Remote node configuration (e.g., Add cloud peer, Enable/Disable discovery).
- View distributed logs (if supported).
- Debugging tools (e.g., Force Snapshot, Trigger manual sync).

### 4. Conflict Analysis
- Tool to identify documents with resolved conflicts or potential divergence.
- Visual diff between versions from different nodes.

## 📦 Output
- Installable application (MSIX or standalone executable).
- `EntglDb.Studio` repository.
- User documentation.
