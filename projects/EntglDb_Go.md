# Project: EntglDb.Go Implementation

## 🎯 Objective
Create an implementation of EntglDb in **Go (Golang)**, ideal for microservices, containers, and distributed orchestration thanks to the cloud-native nature of the language.

## 🛠️ Tech Stack
- **Language**: Go 1.21+.
- **Database**: `mattn/go-sqlite3`.
- **Protocol Buffers**: `google.golang.org/protobuf`.
- **Concurrency**: Goroutines & Channels.

## 🗺️ Development Roadmap

### 1. Modules & Packages
- `pkg/core`: HLC, VectorClock, Conflict Resolution logic.
- `pkg/store`: Storage interfaces and SQLite implementation.
- `pkg/net`: TCP Server and Client.

### 2. Protocol Implementation
- Code generation from `sync.proto`.
- Concurrent TCP connection handling (one goroutine per connection).
- Handshake and message exchange.

### 3. CLI Tool
- Development of a CLI tool (`entgldb-go`) to start a node, join a cluster, inspect data.
- Support for YAML/JSON configuration files.

### 4. Cloud Integration
- The Go project is an ideal candidate for implementing sidecar patterns in Kubernetes.
- Focus on lightweight and fast startup.

## 📦 Output
- Go Module `github.com/entgldb/entgldb-go`.
- Cross-platform binary release.
- Optimized Dockerfile (scratch or alpine).
