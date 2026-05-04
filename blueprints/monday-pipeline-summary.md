# Blueprint: Monday Morning Pipeline Summary

*Workflow SOP — read before running.*
*Created: 2026-04-29 — based on live session run.*

---

## Purpose

Produce a weekly pipeline summary every Monday morning containing:
- Number of leads by stage
- Total value of active stages (Quote sent + Discovery booked + Audit in progress)
- The three hottest leads with their next scheduled steps for the week

---

## Trigger

Run at the start of each working week, or when Salima says:
- "Pipeline summary"
- "Monday briefing"
- "Where are we with leads"
- Any equivalent intent

---

## Inputs Required

| Input | Source | Notes |
|-------|--------|-------|
| Leads & Pipeline spreadsheet | Google Sheets via Zapier MCP | Must have edit access on the connected account |
| Today's date | System / CLAUDE.local.md | Used to identify "this week" next steps |

---

## Steps

### 1. Find the spreadsheet
**Tool:** `google_drive_find_a_file`
- Search for: `Leads & Pipeline` (contains)
- File type: Google Sheets
- Capture: `file_id`

### 2. Pull all data
**Tool:** `google_sheets_get_data_range`
- Spreadsheet: file_id from step 1
- Range: `A1:Z[last row]` — use A1:Z20 for up to 15 leads, expand if needed
- Output: all rows with headers

**Columns to extract:**
`company | contact_name | role | email | source | stage | deal_value_usd | last_contact | next_step | notes`

### 3. Analyse the data

**Leads by stage** — count each unique value in the `stage` column.

**Active pipeline value** — sum `deal_value_usd` for rows where `stage` is one of:
- Quote sent
- Discovery booked
- Audit in progress

Break down by stage in the output.

**Three hottest leads** — rank by:
1. Next step falls within the current week (Mon–Fri)
2. Highest `deal_value_usd`
3. Stage closest to closing (Quote sent > Discovery booked > Audit in progress)

### 4. Format and output

Produce the summary in this structure:

```
Pipeline Summary — Week of [date]

LEADS BY STAGE
[table: stage | count]

ACTIVE PIPELINE VALUE
[table: stage | leads | value]
Total: $X

THREE HOTTEST LEADS THIS WEEK
1. [Company] — $[value]
   [Stage]. [Next step and date].

2. ...

3. ...
```

---

## Decision Points

| Situation | Action |
|-----------|--------|
| Spreadsheet not found | Stop. Ask Salima for the file name or ID |
| No leads with next steps this week | Report the three highest-value active leads instead, note no steps scheduled this week |
| Stage names differ from expected | List all stages found, flag the mismatch |
| deal_value_usd is 0 or blank for an active stage | Include in count, exclude from value total, note it |

---

## Tools Used

| Tool | Purpose |
|------|---------|
| `google_drive_find_a_file` | Locate the pipeline spreadsheet |
| `google_sheets_get_data_range` | Pull all row data |

---

## Notes from Live Run (2026-04-29)

- `google_sheets_get_many_spreadsheet_rows_advanced` only returned 3 columns due to output_hint filtering — use `google_sheets_get_data_range` with explicit A1 range instead.
- Sheet had 15 leads across 10 columns (A:J).
- Active pipeline total was $30,300 across 7 leads.
