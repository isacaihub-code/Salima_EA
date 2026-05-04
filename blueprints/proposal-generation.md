# Blueprint: Professional Proposal Generation

*Workflow SOP — read before running.*
*Created: 2026-04-29 — based on live session run.*

---

## Purpose

Generate a complete, professional service proposal document for a client using:
- Client data from the pipeline
- Package details from the pricing sheet
- Branding and legal terms from the Business Identity document

Output: a Google Doc saved to Drive, plus a PDF export.

---

## Trigger

Run when Salima says:
- "Generate a proposal for [client]"
- "Write up a proposal for [company]"
- "Créer une proposition pour [client]"
- Any equivalent intent

---

## Inputs Required

| Input | Source | Notes |
|-------|--------|-------|
| Client name | Salima's request | Used to locate pipeline row |
| Pipeline spreadsheet | Google Sheets via Zapier | Contains deal value, notes, contact |
| Pricing spreadsheet | Google Sheets — "Arabic AI Agents — Pricing (Sample, AED — MENA)" | ID: 11M4cSRr9PjNDw5Zd94gnLcXSfgYt6KAmyQSU_0KgIng |
| Business Identity document | Google Docs — "Business Identity" | ID: 18xxBmg9wX9ZxCmUDOI6QmxThVTOn5isVXMeQkI0xUK4 |

---

## Steps

### 1. Pull client data from pipeline
**Tool:** `google_sheets_get_data_range`
- Range: full sheet (A1:Z[n])
- Find the row matching the client company name
- Extract: contact_name, role, email, stage, deal_value_usd, notes, next_step

### 2. Pull pricing and identity data (parallel)

**Pricing:**
**Tool:** `google_sheets_get_data_range`
- Spreadsheet ID: `11M4cSRr9PjNDw5Zd94gnLcXSfgYt6KAmyQSU_0KgIng`
- Range: A1:J50
- Find the row matching the package named in the pipeline (e.g. "Growth (3 workflows)")
- Extract: package name, price_aed, what_you_get, billing

**Business Identity:**
**Tool:** `google_docs_get_document_content`
- Document ID: `18xxBmg9wX9ZxCmUDOI6QmxThVTOn5isVXMeQkI0xUK4`
- Extract: company name, tagline, founder, email, jurisdiction, payment terms, legal disclaimers

### 3. Build the proposal document
**Tool:** `google_docs_create_document_from_text`
- Title format: `Arabic AI Agents — Proposal for [Company] — [Month Year]`
- Format: HTML (use `<h1>`, `<h2>`, `<ul>`, `<p>`, `<strong>`, `<hr/>`)
- Save to: root of Drive (default)

**Document structure:**

```
[H1] Arabic AI Agents
[tagline in italics]
---
[H2] Service Proposal
Prepared for: [Company]
Attention: [Contact], [Role]
Date: [today]
Reference: AAA-[YEAR]-[INITIALS]-001
Valid until: [today + 30 days]
---
[H2] About Arabic AI Agents
[1 paragraph from identity doc]
---
[H2] Understanding Your Situation
[2–3 sentences using the notes field from the pipeline — specific to their business]
---
[H2] Proposed Engagement: [Package Name]
Investment: AED [price] — [billing type]
What's included: [what_you_get list]
Suggested workflow areas: [3 bullet points based on the notes/industry]
Note: final scope confirmed at kickoff
---
[H2] Investment Summary
Package: AED [price]
Total: AED [price]
Payment: 50% on signing (AED X) · 50% on delivery (AED X)
---
[H2] Next Steps
[next_step from pipeline, with date if available]
---
[H2] Terms and Conditions
[3 legal disclaimers from identity doc]
---
[H2] About the Founder
[1 sentence on Salima + direct engagement model]
---
[Footer: Arabic AI Agents | Salima Hassouni | email | MENA | tagline]
```

### 4. Export as PDF
**Tool:** `google_drive_export_file`
- File: document ID from step 3
- Format: `application/pdf`
- Output: temporary Zapier download URL — share with Salima immediately (link expires)

### 5. Report back

State:
- Google Doc link (permanent)
- PDF download link (temporary — download now)
- Flag any fields that were assumed or left as placeholders (e.g. workflow scope)

---

## Decision Points

| Situation | Action |
|-----------|--------|
| Client not found in pipeline | Stop. Ask Salima to confirm the company name |
| Package in pipeline doesn't match pricing sheet | List the available packages, ask Salima which to use |
| Notes column is empty | Use industry/context from the company name only. Flag that the situation section is generic |
| Workflow scope not specified | Suggest 3 relevant workflows based on the industry. Note clearly that these are suggestions to confirm at kickoff |
| Pricing is in USD not AED | Use AED from pricing sheet. Note the AED/USD equivalence if helpful |

---

## Tools Used

| Tool | Purpose |
|------|---------|
| `google_sheets_get_data_range` | Pull client data from pipeline |
| `google_sheets_get_data_range` | Pull package details from pricing sheet |
| `google_docs_get_document_content` | Pull branding and legal from Business Identity |
| `google_docs_create_document_from_text` | Create the proposal Google Doc |
| `google_drive_export_file` | Export the Doc as PDF |

---

## Reference IDs (as of 2026-04-29)

| Document | ID |
|----------|----|
| Pricing sheet | `11M4cSRr9PjNDw5Zd94gnLcXSfgYt6KAmyQSU_0KgIng` |
| Business Identity doc | `18xxBmg9wX9ZxCmUDOI6QmxThVTOn5isVXMeQkI0xUK4` |

---

## Notes from Live Run (2026-04-29)

- Searching Drive for "agencina pricing" returned nothing — the actual file name is "Arabic AI Agents — Pricing (Sample, AED — MENA)". Always search with `contains` if exact name is unknown.
- `google_docs_get_document_content` failed on the pricing file (it's a Sheet, not a Doc) — use `google_sheets_get_data_range` for it.
- The PDF export returns a temporary Zapier hydration URL, not a Google Drive link — share it immediately with Salima as it expires.
- Workflow scope for F&B clients: customer inquiry/reservation handling, cross-location ops comms, reporting and tracking.
- Sahel Cafe Group proposal reference: `AAA-2026-SCG-001` / Doc ID: `1WrYImmEjOG2qt1_tyoN9rM4iEveTdw2VzYNl2mkqPJM`
