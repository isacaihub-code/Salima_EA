# Skill: /pipeline-summary

**Trigger:** `/pipeline-summary`
**Full SOP:** `blueprints/monday-pipeline-summary.md`

Produce the Monday morning pipeline summary from the live Leads & Pipeline sheet.

---

## Execution

Run these steps in order. Do not skip. Do not summarise from memory — always pull live data.

### Step 1 — Find the spreadsheet
Tool: `google_drive_find_a_file`
- title: `Leads & Pipeline`
- search_type: `contains`
- file_types: Google Sheets
- Capture the `file_id`

### Step 2 — Pull all rows
Tool: `google_sheets_get_data_range`
- spreadsheet: file_id from Step 1
- a1_range: `A1:Z20` (expand to A1:Z50 if more than 15 leads)
- output_hint: all rows and columns including headers

Expected columns: `company | contact_name | role | email | source | stage | deal_value_usd | last_contact | next_step | notes`

### Step 3 — Analyse

**Leads by stage**
Count each unique value in the `stage` column.

**Active pipeline value**
Sum `deal_value_usd` for rows where stage = `Quote sent`, `Discovery booked`, or `Audit in progress`.
Break down by stage.

**Three hottest leads**
Rank by:
1. Next step date falls within the current Mon–Fri week
2. Highest `deal_value_usd`
3. Stage order: Quote sent > Discovery booked > Audit in progress

If no leads have steps this week, take the top 3 by deal value in active stages.

### Step 4 — Output

```
Pipeline Summary — Week of [Monday date]

LEADS BY STAGE
[stage] — [count]
...
Total: [n] leads

ACTIVE PIPELINE VALUE
Quote sent       [n leads]   $[value]
Discovery booked [n leads]   $[value]
Audit in progress[n leads]   $[value]
Total active: $[total]

THREE HOTTEST LEADS THIS WEEK

1. [Company] — $[value]
   [Stage]. [Next step + date].

2. [Company] — $[value]
   [Stage]. [Next step + date].

3. [Company] — $[value]
   [Stage]. [Next step + date].
```

---

## Edge Cases

| Situation | Action |
|-----------|--------|
| Sheet not found | Stop — ask Salima for the file name or ID |
| deal_value_usd is 0 or blank | Include in stage count, exclude from value total |
| Stage names differ from expected | List all stages found, flag the mismatch |
| No next steps this week | Use top 3 by value in active stages, note no steps this week |

---

## Key Notes

- Use `google_sheets_get_data_range` — NOT `get_many_spreadsheet_rows_advanced` (that tool filters columns via output_hint and drops data)
- Pipeline sheet ID (last known): `1yjYPzxk4pZFJPQvAl7d_svHdTbRXl_3m_jJ3_2HxiwY`
- Always pull live — never answer from memory or prior session data
