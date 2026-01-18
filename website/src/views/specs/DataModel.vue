<template>
  <div class="spec-view">
    <h1>Data Model</h1>
    <p class="lead">EntglDb is a document-oriented database storing JSON objects in named collections.</p>

    <h2>Documents</h2>
    <p>A document is a standard JSON object. It MUST contain a unique <code>_id</code> string field.</p>
    
    <div class="code-block">
      <pre><code>{
  <span class="key">"_id"</span>: <span class="string">"user-123"</span>,
  <span class="key">"name"</span>: <span class="string">"Alice"</span>,
  <span class="key">"age"</span>: <span class="number">30</span>,
  <span class="key">"active"</span>: <span class="keyword">true</span>,
  <span class="key">"tags"</span>: [<span class="string">"admin"</span>, <span class="string">"staff"</span>],
  <span class="key">"metadata"</span>: {
    <span class="key">"last_login"</span>: <span class="string">"2026-01-01T12:00:00Z"</span>
  }
}</code></pre>
    </div>

    <h2>Serialization Rules</h2>
    <div class="alert-box">
      <strong>Important:</strong> To ensure consistent hashing and synchronization across .NET, Kotlin, and Node.js, the following rules apply:
    </div>
    
    <ul class="spec-list">
      <li><strong>Format:</strong> UTF-8 encoded JSON.</li>
      <li><strong>System Fields:</strong> Must use <code>snake_case</code> (e.g., <code>node_id</code>, <code>tcp_port</code>, <code>hlc_timestamp</code>).</li>
      <li><strong>Date/Time:</strong> ISO-8601 Strings in UTC (<code>YYYY-MM-DDTHH:mm:ss.sssZ</code>).</li>
      <li><strong>Numbers:</strong> Standard JSON numbers (integers or floats).</li>
    </ul>

    <h2>Operation Log (Oplog)</h2>
    <p>Every mutation is recorded as an immutable <strong>OplogEntry</strong>.</p>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>hlc_timestamp</code></td>
            <td>String</td>
            <td>Hybrid Logical Clock (Time+Counter+NodeId)</td>
          </tr>
          <tr>
            <td><code>collection</code></td>
            <td>String</td>
            <td>Target collection name</td>
          </tr>
          <tr>
            <td><code>key</code></td>
            <td>String</td>
            <td>Document ID</td>
          </tr>
          <tr>
            <td><code>operation</code></td>
            <td>Enum</td>
            <td><code>PUT</code> or <code>DELETE</code></td>
          </tr>
          <tr>
            <td><code>json_data</code></td>
            <td>JSON</td>
            <td>The full document content (for PUT)</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.lead {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 40px;
}

.code-block {
  background: #0f0f13;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  font-family: var(--font-mono);
  color: #a1a1aa;
  margin-bottom: 40px;
  overflow-x: auto;
}

.key { color: var(--accent-primary); }
.string { color: #a5f3fc; }
.number { color: #fba740; }
.keyword { color: #f472b6; }

.alert-box {
  background: rgba(234, 179, 8, 0.1);
  border-left: 4px solid #eab308;
  padding: 16px;
  margin: 30px 0;
  color: #fef08a;
}

.spec-list {
  padding-left: 20px;
  margin-bottom: 40px;
  line-height: 1.8;
  color: var(--text-secondary);
}

.spec-list strong {
  color: var(--text-primary);
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

th {
  color: var(--text-muted);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

td {
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.9rem;
}
</style>
