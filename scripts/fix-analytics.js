const fs = require('fs');

const file = 'src/app/dashboard/analytics/page.tsx';
let s = fs.readFileSync(file, 'utf8');
s = s.replace(
  /import\s*\{\s*useLanguages\s*,\s*useStats\s*,\s*useTraffic\s*\}\s*from\s*['"]@\/lib\/hooks\/useApi['"];\s*\r?\n?/g,
  '',
);
s = s.replace(/useStats\(\)/g, 'useDashboardResource(API_CORE.stats)');
s = s.replace(/useLanguages\(\)/g, 'useDashboardResource(API_CORE.languages)');
s = s.replace(/useTraffic\(\)/g, 'useDashboardResource(API_CORE.traffic)');
s = s.replace(
  /statsData\?\.data\?\.slice\(0,\s*4\)\s*\|\|\s*\[\]/g,
  'statsData?.slice(0,4)',
);
s = s.replace(
  /languagesData\?\.data\?\.slice\(0,\s*6\)\s*\|\|\s*\[\]/g,
  'languagesData?.slice(0,6)',
);
s = s.replace(
  /trafficData\?\.data\?\.slice\(0,\s*6\)\s*\|\|\s*\[\]/g,
  'trafficData?.slice(0,6)',
);
if (!s.includes('API_CORE')) {
  s = s.replace(
    /import\s*\{\s*ErrorAlert[^\}]+\}\s*from\s*['"]@\/components['"];/,
    "import {\n  ErrorAlert,\n  LanguageTable,\n  MapChart,\n  MobileDesktopChart,\n  PageHeader,\n  SalesChart,\n  StatsCard,\n  TrafficTable,\n} from '@/components';\nimport { API_CORE } from '@/routes/api';\nimport { useDashboardResource } from '@/lib/api/useDashboardResource';",
  );
} else if (!s.includes('useDashboardResource')) {
  s = s.replace(
    /import\s*\{\s*API_CORE\s*\}\s*from\s*['"]@\/routes\/api['"];/,
    "import { API_CORE } from '@/routes/api';\nimport { useDashboardResource } from '@/lib/api/useDashboardResource';",
  );
}
fs.writeFileSync(file, s);
console.log('done');
