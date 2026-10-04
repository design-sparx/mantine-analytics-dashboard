const fs = require('fs');

[
  'src/app/dashboard/marketing/page.tsx',
  'src/app/dashboard/real-estate/page.tsx',
].forEach((p) => {
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(
    /import\s*\{\s*useFetch\s*\}\s*from\s*['"]@mantine\/hooks['"];\r?\n?/g,
    '',
  );
  s = s.replace(
    /import\s*\{\s*IApiResponse\s*\}\s*from\s*['"]@\/types\/api-response['"];\r?\n?/g,
    '',
  );
  if (p.includes('marketing') && !s.includes('API_MARKETING')) {
    s = s.replace(
      /import\s*\{\s*PATH_TASKS\s*\}\s*from\s*['"]@\/routes['"];/,
      "import { PATH_TASKS } from '@/routes';\nimport { API_MARKETING } from '@/routes/api';\nimport { useDashboardResource } from '@/lib/api/useDashboardResource';",
    );
  }
  if (p.includes('real-estate')) {
    if (!s.includes('API_REAL_ESTATE')) {
      if (s.match(/import\s*\{\s*PATH_TASKS\s*\}/)) {
        s = s.replace(
          /import\s*\{\s*PATH_TASKS\s*\}\s*from\s*['"]@\/routes['"];/,
          "import { PATH_TASKS } from '@/routes';\nimport { API_REAL_ESTATE } from '@/routes/api';\nimport { useDashboardResource } from '@/lib/api/useDashboardResource';",
        );
      } else {
        s = s.replace(
          /from\s*['"]@\/components['"];/,
          "from '@/components';\nimport { API_REAL_ESTATE } from '@/routes/api';\nimport { useDashboardResource } from '@/lib/api/useDashboardResource';",
        );
      }
    } else if (!s.includes('useDashboardResource')) {
      s = s.replace(
        /API_REAL_ESTATE\s*\}\s*;/,
        "API_REAL_ESTATE };\nimport { useDashboardResource } from '@/lib/api/useDashboardResource';",
      );
    }
  }
  fs.writeFileSync(p, s);
});
console.log('ok');
