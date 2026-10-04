const fs = require('fs');

let s = fs.readFileSync('src/app/dashboard/saas/page.tsx').toString();

s = s.replace(
  "import { useProjects, useStats } from '@/lib/hooks/useApi';",
  '',
);
s = s.replace(
  /const\s*\{\s*data:\s*statsData,\s*error:\s*statsError,\s*loading:\s*statsLoading,\s*\}\s*=\s*useStats\(\);/,
  '  const { data: statsData, error: statsError, loading: statsLoading } = useDashboardResource(API_CORE.stats);',
);
s = s.replace(
  /const\s*\{\s*data:\s*projectsData,\s*error:\s*projectsError,\s*loading:\s*projectsLoading,\s*\}\s*=\s*useProjects\(\);/,
  '  const { data: projectsData, error: projectsError, loading: projectsLoading } = useDashboardResource(API_CORE.projects);',
);
s = s.replace('data={statsData?.data || []}', 'data={statsData}');
s = s.replace(
  'data={projectsData?.data?.slice(0, 6) || []}',
  'data={projectsData?.slice(0, 6)}',
);
s = s.replace('import { Paper,', 'import {');
s = s.replace('MapChart,', '');

if (!s.includes('API_CORE')) {
  s = s.replace(
    "import { PATH_TASKS } from '@/routes';",
    "import { PATH_TASKS } from '@/routes';\nimport { API_CORE } from '@/routes/api';\nimport { useDashboardResource } from '@/lib/api/useDashboardResource';",
  );
} else if (!s.includes('useDashboardResource')) {
  s = s.replace(
    "import { API_CORE } from '@/routes/api';",
    "import { API_CORE } from '@/routes/api';\nimport { useDashboardResource } from '@/lib/api/useDashboardResource';",
  );
}

fs.writeFileSync('src/app/dashboard/saas/page.tsx', s);
console.log('ok');
