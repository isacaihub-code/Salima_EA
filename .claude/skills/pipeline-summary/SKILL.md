---
name: pipeline-summary
description: Produces the Monday morning pipeline summary from the live Leads & Pipeline Google Sheet. Use when Salima asks for a pipeline recap, weekly briefing, or lead overview. Outputs leads by stage, active pipeline value, and the three hottest leads with next steps.
compatibility: Requires Zapier MCP with Google Drive and Google Sheets access.
metadata:
  author: salima
  version: "1.0"
  created: "2026-04-29"
---

# Pipeline Summary

Produce the Monday morning pipeline summary from the live Leads & Pipeline sheet. Always pull live data — never answer from memory or prior session.

## Steps

### 1 — Find the spreadsheet
Tool: `google_drive_find_a_file`
- title: `Leads & Pipeline`
- search_type: `contains`
- file_types: Google Sheets
- Capture the `file_id`

### 2 — Pull all rows
Tool: `google_sheets_get_data_range`
- spreadsheet: file_id from Step 1
- a1_range: `A1:Z20` (use A1:Z50 if more than 15 leads)
- output_hint: all rows and columns including headers

Expected columns: `company | contact_name | role | email | source | stage | deal_value_usd | last_contact | next_step | notes`

> Use `google_sheets_get_data_range` — not `get_many_spreadsheet_rows_advanced`. The latter filters columns via output_hint and silently drops data.

### 3 — Analyse

**Leads by stage** — count each unique value in the `stage` column.

**Active pipeline value** — sum `deal_value_usd` for rows where stage is one of:
`Quote sent` · `Discovery booked` · `Audit in progress`
Break down by stage.

**Three hottest leads** — rank by:
1. Next step date falls within the current Mon–Fri week
2. Highest `deal_value_usd`
3. Stage closeness to closing: Quote sent > Discovery booked > Audit in progress

If no leads have steps this week, take top 3 by value in active stages and note it.

### 4 — Output

```
Pipeline Summary — Week of [Monday date]

LEADS BY STAGE
[stage] — [count]
...
Total: [n] leads

ACTIVE PIPELINE VALUE
Quote sent        [n leads]   $[value]
Discovery booked  [n leads]   $[value]
Audit in progress [n leads]   $[value]
Total active: $[total]

THREE HOTTEST LEADS THIS WEEK

1. [Company] — $[value]
   [Stage]. [Next step + date].

2. [Company] — $[value]
   [Stage]. [Next step + date].

3. [Company] — $[value]
   [Stage]. [Next step + date].
```

## Edge Cases

| Situation | Action |
|-----------|--------|
| Sheet not found | Stop — ask Salima for the file name or ID |
| deal_value_usd is 0 or blank on active lead | Include in stage count, exclude from value total |
| Stage names differ from expected | List all stages found, flag the mismatch |
| No next steps this week | Use top 3 by deal value, note no steps scheduled this week |

## Reference

Full SOP with background and session notes: [references/REFERENCE.md](references/REFERENCE.md)
