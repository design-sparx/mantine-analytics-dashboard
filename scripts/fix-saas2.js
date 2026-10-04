const fs = require('fs');
const path = require('path');

const file = 'src/app/dashboard/saas/page.tsx';
let s = fs.readFileSync(file, 'utf8');
s = s.replace(
  /import\s*\{\s*useProjects\s*,\s*useStats\s*\}\s*from\s*['"]@\/lib\/hooks\/useApi['"];\s*\r?\n?/g,
  '',
);
s = s.replace(/useStats\(\)/g, 'useDashboardResource(API_CORE.stats)');
s = s.replace(/useProjects\(\)/g, 'useDashboardResource(API_CORE.projects)');
s = s.replace(/statsData\?\.data\s*\|\|\s*\[\]/g, 'statsData');
s = s.replace(
  /projectsData\?\.data\?\.slice\(0,\s*6\)\s*\|\|\s*\[\]/g,
  'projectsData?.slice(0, 6)',
);
if (!s.includes('API_CORE')) {
  s = s.replace(
    /import\s*\{\s*PATH_TASKS\s*\}\s*from\s*['"]@\/routes['"];/,
    "import { PATH_TASKS } from '@/routes';\nimport { API_CORE } from '@/routes/api';\nimport { useDashboardResource } from '@/lib/api/useDashboardResource';",
  );
} else if (!s.includes('useDashboardResource')) {
  s = s.replace(
    /import\s*\{\s*API_CORE\s*\}\s*from\s*['"]@\/routes\/api['"];/,
    "import { API_CORE } from '@/routes/api';\nimport { useDashboardResource } from '@/lib/api/useDashboardResource';",
  );
}
fs.writeFileSync(file, s);
console.log('done');
