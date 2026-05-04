Run the Monday morning pipeline summary using the Leads & Pipeline Google Sheet.

Follow the full SOP in blueprints/monday-pipeline-summary.md and the skill in .claude/skills/pipeline-summary/pipeline-summary.md.

Steps:
1. Use google_drive_find_a_file to find the "Leads & Pipeline" spreadsheet (search_type: contains, file type: Google Sheets)
2. Use google_sheets_get_data_range with range A1:Z20 to pull all rows and columns
3. Analyse the data:
   - Count leads by stage
   - Sum deal_value_usd for active stages: Quote sent, Discovery booked, Audit in progress — broken down by stage
   - Identify the three hottest leads: next step this week first, then by deal value, then by stage closeness to won
4. Output the summary in this format:

Pipeline Summary — Week of [Monday date]

LEADS BY STAGE
[stage] — [count]
Total: [n] leads

ACTIVE PIPELINE VALUE
Quote sent        [n leads]   $[value]
Discovery booked  [n leads]   $[value]
Audit in progress [n leads]   $[value]
Total active: $[total]

THREE HOTTEST LEADS THIS WEEK
1. [Company] — $[value]
   [Stage]. [Next step + date].
2. ...
3. ...
