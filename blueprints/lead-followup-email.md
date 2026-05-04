# Blueprint: Lead Follow-up Email + Status Update

*Workflow SOP — read before running.*
*Created: 2026-04-29 — based on live session run.*

---

## Purpose

Update a lead's status in the pipeline after a follow-up action, and create a professional draft follow-up email ready for Salima to review and send.

**Rule: Never send emails directly. Always save as draft.**

---

## Trigger

Run when Salima says:
- "Follow up with [lead]"
- "Update [lead] status and draft a follow-up"
- "Send a follow-up to [contact]"
- Any equivalent intent referencing a specific lead

---

## Inputs Required

| Input | Source | Notes |
|-------|--------|-------|
| Lead name or company | Salima's request | Used to locate the row |
| Pipeline spreadsheet ID | Known from session or ask | Must have edit access |
| Action taken | Context (e.g. "follow-up sent", "proposal shared") | Determines what to update |
| Contact email | Pipeline data | Already in the sheet |

---

## Steps

### 1. Locate the lead in the sheet
**Tool:** `google_sheets_get_data_range`
- Pull all rows to find the exact row number for the named lead
- Note: row numbers start at 2 (row 1 = headers)

**Extract for the target lead:**
- Row number
- contact_name
- email
- stage
- deal_value_usd
- last_contact
- next_step
- notes

### 2. Update the pipeline row (parallel with step 3)
**Tool:** `google_sheets_update_spreadsheet_row`
- Spreadsheet: use the ID with edit access (not the read-only original)
- Row: exact row number from step 1
- Fields to update:
  - `last_contact` → today's date (YYYY-MM-DD)
  - `next_step` → "Follow-up sent [date] — awaiting response"
- Do not change: stage, deal_value_usd, or any other column
- No formatting changes needed — always state this explicitly to avoid the tool asking

### 3. Draft the follow-up email (parallel with step 2)
**Tool:** `gmail_create_draft`
- `to`: contact email from pipeline
- `subject`: "Following up — [Package/Topic]"
- `body_type`: plain
- `from_name`: Salima Hassouni

**Email structure:**
1. One-line opener referencing the previous touchpoint (proposal date, last conversation)
2. One-line offer: call, answer questions, adjust anything
3. One concrete reference to their specific situation (from `notes` column)
4. Clear CTA: suggest a short call, give two time options if possible
5. Sign-off: Salima Hassouni / Arabic AI Agents

**Tone:** Professional, warm, brief. No filler. Outcome-first.

### 4. Report back

State:
- Sheet row updated: which fields, what values
- Draft saved: subject line and recipient
- Do not send — remind Salima to review draft in Gmail before sending

---

## Decision Points

| Situation | Action |
|-----------|--------|
| Lead not found in sheet | Stop. Ask Salima to confirm the company name |
| Sheet update fails (permission error) | Report clearly. Suggest sharing the sheet with the Zapier-connected account as Editor. Do not retry silently. |
| Contact email missing from pipeline | Draft the email without `to:` field. Flag the missing email. |
| Salima asks to send (not draft) | Remind her of the standing rule: always draft first. Show the draft and ask for explicit confirmation. |
| Stage needs to change (e.g. won, lost) | Ask Salima what the new stage should be before updating |

---

## Tools Used

| Tool | Purpose |
|------|---------|
| `google_sheets_get_data_range` | Find lead row and extract contact details |
| `google_sheets_update_spreadsheet_row` | Update last_contact and next_step |
| `gmail_create_draft` | Save follow-up email as draft |

---

## Notes from Live Run (2026-04-29)

- The original "Leads & Pipeline (Sample)" sheet returned a permission error on writes — the Zapier-connected account (isac.aihub@gmail.com) only had read access.
- A new sheet was created by Salima with edit access — use that ID going forward.
- The `google_sheets_update_spreadsheet_row` tool will ask about formatting if not explicitly told to skip it — always include "No formatting changes needed, proceed without asking about formatting" in the instructions.
- Run sheet update and email draft in parallel — they are independent.
