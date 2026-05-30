---
id: compliance
title: Compliance
sidebar_label: Compliance
---

# Compliance

## Provenance metadata (C2PA)

All outputs include embedded **C2PA provenance metadata** satisfying **EU AI Act
Article 50** (AI-generated content disclosure). Downstream tools that read C2PA can
verify an asset was AI-generated and trace its origin.

## Audio watermarking

Generated and cloned speech is **watermarked by default** (`apply_watermark: true` on
the [speech](/capabilities/generate#text--speech) and voice-clone endpoints). Keep
it enabled unless you have a specific, compliant reason not to.

## Ephemeral processing & data retention

ImagePipeline processes media **ephemerally**, it acts as a **data processor**, not a
data controller. Your inputs and outputs are never stored long-term.

- **Faces are never stored.** [Identity profiles](/concepts/profiles) reference your
  own storage via a pointer; the API never accesses it and never holds your encryption key.
- **Results are temporary.** `result_url` is a pre-signed link that
  [expires within 24 hours](/concepts/jobs#result-url-lifecycle), download and store
  outputs in your own storage.

:::tip
Because results are ephemeral, treat your own storage as the system of record. Persist the
downloaded file (and any provenance you need) at the moment a job completes.
:::
