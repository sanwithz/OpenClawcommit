# Stale Notes Dashboard

```dataviewjs
const cutoffDays = 30;
const now = window.moment();
const pages = dv.pages('"12 Operations"')
  .where(p => p.file.name !== 'README')
  .where(p => now.diff(window.moment(p.file.mtime), 'days') >= cutoffDays)
  .sort(p => p.file.mtime, 'asc');

const rows = pages.map(p => [
  p.file.link,
  p.type || '-',
  p.status || '-',
  p.area || '-',
  p.file.mtime
]);

dv.header(2, `Notes stale for ${cutoffDays}+ days`);
dv.table(['Note', 'Type', 'Status', 'Area', 'Updated'], rows);
```
