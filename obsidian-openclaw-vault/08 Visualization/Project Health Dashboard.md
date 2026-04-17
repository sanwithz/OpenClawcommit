# Project Health Dashboard

```dataviewjs
const pages = dv.pages('"12 Operations/12.02 Projects"')
  .where(p => p.type === 'project')
  .sort(p => p.file.mtime, 'desc');

const rows = pages.map(p => [
  p.file.link,
  p.status || '-',
  p.area || '-',
  p.file.mtime
]);

dv.table(['Project', 'Status', 'Area', 'Updated'], rows);
```

## Use
Use this as a more flexible version of the basic Projects Dashboard.
