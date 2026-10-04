import fs from 'fs';

const s = fs.readFileSync('src/app/dashboard/crm/page.tsx', 'utf8');

const at = s.indexOf('= useFetch<IApiResponse');
console.log(JSON.stringify(s.slice(at - 120, at + 70)));

// What exactly follows `IApiResponse<...>`?
const m = s.match(/IApiResponse<[^>]*>.{0,30}/);
console.log('\nafter generic:', JSON.stringify(m && m[0]));
