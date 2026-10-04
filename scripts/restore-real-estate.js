const fs = require('fs');

const file = 'src/app/dashboard/real-estate/page.tsx';
let s = fs.readFileSync(file, 'utf8');

// Restore the correct per-widget endpoints, which were blanked by an earlier
// over-eager regex. Each hook maps to the widget it feeds, in page order.
const endpoints = [
  'API_REAL_ESTATE.stats',
  'API_REAL_ESTATE.properties',
  'API_REAL_ESTATE.propertyTypes',
  'API_REAL_ESTATE.salesTrends',
  'API_REAL_ESTATE.locations',
  'API_REAL_ESTATE.priceDistribution',
];

let index = 0;

s = s.replace(/useDashboardResource\(\s*as any\s*\)/g, () => {
  const endpoint = endpoints[index];
  index += 1;
  return `useDashboardResource(${endpoint})`;
});

fs.writeFileSync(file, s);
console.log(`restored ${index} endpoints`);
