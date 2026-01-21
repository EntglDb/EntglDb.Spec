# Building the Internet-Draft

This directory contains the XML source for the EntglDb Protocol Internet-Draft.

## Prerequisites

To compile the draft into text or HTML, you need `xml2rfc`.

### Installation

```bash
pip install xml2rfc
```

## Building

Run the following command to generate the text version:

```bash
xml2rfc draft-entgldb-p2p-protocol-00.xml --text
```

To generate the HTML version:

```bash
xml2rfc draft-entgldb-p2p-protocol-00.xml --html
```

## Submission

Once finalized, the `.xml` file (and potentially the `.txt`) can be uploaded to the IETF Datatracker.
