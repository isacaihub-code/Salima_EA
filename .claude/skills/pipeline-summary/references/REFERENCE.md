# Pipeline Summary — Reference

Full SOP and session notes. Read when troubleshooting or when the SKILL.md steps are unclear.

## Background

Weekly ritual — run every Monday morning before Salima's first call. Gives a complete view of the pipeline: where leads stand, what the active book of business is worth, and what needs attention this week.

## Known Spreadsheet IDs

| File | ID | Notes |
|------|----|-------|
| Leads & Pipeline (Sample) | `1yjYPzxk4pZFJPQvAl7d_svHdTbRXl_3m_jJ3_2HxiwY` | Original — read-only for Zapier account |
| Working pipeline sheet | `1sMfW8d6Ei3Xwoi6BWiiHEaGiRKPLwXeAPg1HaNMAZnA` | Created 2026-04-29 — Zapier has edit access |

Always search by name first (Step 1). Fall back to known IDs only if search fails.

## Column Map (as of 2026-04-29)

| Column | Header | Notes |
|--------|--------|-------|
| A | company | Lead/client company name |
| B | contact_name | Primary contact |
| C | role | Contact's job title |
| D | email | Contact email |
| E | source | How the lead came in |
| F | stage | Pipeline stage — see stage list below |
| G | deal_value_usd | Projected deal value in USD |
| H | last_contact | Date of last touchpoint (YYYY-MM-DD) |
| I | next_step | What needs to happen next |
| J | notes | Context, use case, priority notes |

## Stage Reference

| Stage | Active? | Include in value? |
|-------|---------|-------------------|
| Quote sent | Yes | Yes |
| Discovery booked | Yes | Yes |
| Audit in progress | Yes | Yes |
| Won | No | No |
| Contacted | No | No |
| Cold | No | No |
| On hold | No | No |
| Lost | No | No |

## Live Run Notes (2026-04-29)

- 15 leads total across 8 stages
- Active pipeline: $30,300 (Quote sent $18,500 · Discovery booked $9,900 · Audit in progress $1,900)
- `get_many_spreadsheet_rows_advanced` silently dropped 7 columns — use `get_data_range` with explicit A1 range instead
- Three hottest leads that week: Foster & Marsh Legal ($12,000), Zayd Property ($6,500), Tahseen Tutoring ($4,900)
