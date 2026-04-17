# QuickAdd Capture Flows

## Purpose
Use QuickAdd to reduce friction when capturing inbox notes, project notes, and reviews.

## Recommended Captures
1. **Inbox Capture**
   - target folder: `12 Operations/12.01 Inbox/`
   - template: `90 Templates/Inbox Note Template - Templater.md`
   - filename: `Capture - {{VALUE}}`

2. **Daily Note**
   - target folder: `06 Daily Systems/Daily Notes/`
   - template: `90 Templates/Daily Note Template - Templater.md`
   - filename: `{{DATE:YYYY-MM-DD}}`

3. **Project Note**
   - target folder: `12 Operations/12.02 Projects/`
   - template: `90 Templates/Project Note Template - Templater.md`
   - filename: `{{VALUE}}`

4. **Weekly Review**
   - target folder: `06 Daily Systems/Weekly Reviews/`
   - template: `90 Templates/Weekly Review Template - Templater.md`
   - filename: `{{DATE:gggg-[W]ww}}`

## Suggested QuickAdd Choices
- Capture to Inbox
- Open Today’s Daily Note
- New Project Note
- Create Weekly Review

## Setup Notes
- Use **Template** or **Capture** choices in QuickAdd.
- Pair QuickAdd with Templater for dynamic fields.
- Keep filenames predictable for retrieval and Dataview.
