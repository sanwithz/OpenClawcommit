# Area Focus Dashboard

```dataviewjs
const pages = dv.pages('"12 Operations/12.03 Areas"')
  .where(p => p.type === 'area')
  .sort(p => p.file.name, 'asc');

const rows = pages.map(p => [
  p.file.link,
  p.status || '-',
  p.file.mtime
]);

dv.table(['Area', 'Status', 'Updated'], rows);
```
