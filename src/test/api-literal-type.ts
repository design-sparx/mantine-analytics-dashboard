import { API_CRM } from '@/routes/api';

// Compile-time probe: a literal type must survive the registry, otherwise the
// payload lookup in useDashboardResource collapses to a union.
type Expect<T extends true> = T;
type IsLiteral = Expect<
  typeof API_CRM.stats extends '/api/crm/stats' ? true : false
>;
