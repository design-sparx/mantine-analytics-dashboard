const fs = require('fs');
let s = fs.readFileSync('src/app/dashboard/saas/page.tsx', 'utf8');
s =
  s.split("import { useProjects, useStats } from '@/lib/hooks/useApi';")[0] +
    s.split("import { useProjects, useStats } from '@/lib/hooks/useApi';")[1] ||
  '';
// but split loses first part cleanly
const parts = s.split(
  "import { useProjects, useStats } from '@/lib/hooks/useApi';",
);
if (parts.length === 2) {
  s = parts[0] + parts[1];
} else if (parts.length > 2) {
  s = parts[0] + parts.slice(1).join('');
}
fs.writeFileSync('src/app/dashboard/saas_tmp.txt', s);
console.log('done');
