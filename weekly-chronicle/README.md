# 📰 Weekly Chronicle System

A personal newspaper generator that creates beautiful PDF reports from your weekly events.

## Directory Structure

```
weekly-chronicle/
├── data/                    # Weekly event data (JSON)
│   ├── weekly_log.json      # Index of all weeks
│   └── 2025-W19.json        # Example week data
├── templates/               # HTML templates
│   └── newspaper_template.html
├── scripts/                 # Generation scripts
│   └── generate-chronicle.js
└── output/                  # Generated HTML & PDF files
```

## Quick Start

### 1. Create Week Data

Copy the template and edit with your week's events:

```bash
cp data/2025-W19.json data/2025-W20.json
# Edit 2025-W20.json with your events
```

### 2. Generate Chronicle

```bash
cd weekly-chronicle/scripts
node generate-chronicle.js 2025-W20
```

Or generate the latest week automatically:

```bash
node generate-chronicle.js
```

### 3. Output

- HTML: `output/2025-W20.html`
- PDF: `output/2025-W20.pdf`

## Data Format

```json
{
  "week_id": "2025-W20",
  "date_range": {
    "start": "2025-05-12",
    "end": "2025-05-18"
  },
  "masthead": {
    "title": "The Weekly Chronicle",
    "subtitle": "Your Personal Weekly Digest",
    "volume": "XCVII",
    "number": "20"
  },
  "front_page": {
    "headline": "YOUR WEEK HEADLINE",
    "byline": "By Personal Chronicle Staff",
    "lead_story": "Main story paragraph...",
    "key_points": ["Point 1", "Point 2"],
    "pull_quote": "Inspirational quote...",
    "weather": {
      "temp_range": "24-32°C",
      "condition": "Mostly sunny"
    },
    "week_at_glance": ["✓ Accomplishment 1", "✓ Accomplishment 2"]
  },
  "sections": {
    "home_personal": [
      {
        "date": "2025-05-12",
        "headline": "Story Headline",
        "content": "Story content...",
        "highlight": "Key highlight..."
      }
    ],
    "health_wellness": [...],
    "work_career": [...],
    "entertainment": [...],
    "looking_ahead": {
      "priorities": "Next week's focus...",
      "goals": "Future aspirations...",
      "checklist": ["□ Task 1", "□ Task 2"]
    }
  }
}
```

## Sections

1. **Front Page** - Week highlights and summary
2. **Home & Personal Life** - Family, home projects, personal matters
3. **Health & Wellness** - Fitness, nutrition, mental health
4. **Work & Career** - Professional achievements, learning
5. **Entertainment & Culture** - Leisure, hobbies, media
6. **Looking Ahead** - Next week's plans and goals

## Customization

Edit `templates/newspaper_template.html` to change:
- Colors and fonts
- Layout structure
- Section titles
- Additional styling

## Automation

Add to your weekly routine with a cron job:

```bash
# Generate every Sunday at 6 PM
0 18 * * 0 cd /path/to/weekly-chronicle/scripts && node generate-chronicle.js
```

## Tips

- Keep entries concise (2-3 sentences)
- Focus on achievements and meaningful moments
- Include specific dates for context
- Add a memorable pull quote each week
- Track weather for atmosphere

## Requirements

- Node.js
- Puppeteer (`npm install puppeteer`)
