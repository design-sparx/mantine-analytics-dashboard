/**
 * Every mock API endpoint path in the app.
 *
 * Page routes live in `src/routes/index.ts`; this file is the same idea for
 * API endpoints. Import from here instead of writing an `/api/...` string, so a
 * route rename is a compiler error rather than a search-and-replace.
 *
 * Every collection entry here corresponds to a handler under
 * `src/app/api/**\/route.ts`. Detail paths are not registered: they are built
 * from a collection and an id with `apiDetailPath`, matching the `[id]`
 * dynamic segments Next.js serves them from.
 */

/**
 * Prefixes a path and preserves its literal type.
 *
 * Two things are needed for the literal to survive. The `const` type parameter
 * keeps `Path` as a literal rather than widening it to `string`, and the
 * explicit `: `/api${Path}`` return annotation is what makes TypeScript emit a
 * template literal type instead of plain `string` — inference only produces
 * template literal types when there is a contextual type to check against.
 * That is what lets `useDashboardResource(API_CRM.stats)` infer the payload
 * type for that endpoint from the payload map, so a page cannot pass an
 * endpoint whose type it has not declared.
 */
const api = <const Path extends string>(path: Path): `/api${Path}` =>
  `/api${path}`;

/** Top-level and app endpoints. */
export const API_CORE = {
  changelog: api('/changelog'),
  chat: api('/chat'),
  chatMessages: api('/chat/messages'),
  customers: api('/customers'),
  emails: api('/emails'),
  invoices: api('/invoices'),
  languages: api('/languages'),
  notifications: api('/notifications'),
  orders: api('/orders'),
  products: api('/products'),
  profile: api('/profile'),
  projects: api('/projects'),
  sales: api('/sales'),
  stats: api('/stats'),
  tasks: api('/tasks'),
  traffic: api('/traffic'),
} as const;

/** CRM dashboard endpoints. */
export const API_CRM = {
  activities: api('/crm/activities'),
  deals: api('/crm/deals'),
  leads: api('/crm/leads'),
  stats: api('/crm/stats'),
} as const;

/** E-commerce dashboard endpoints. */
export const API_ECOMMERCE = {
  categories: api('/ecommerce/categories'),
  orders: api('/ecommerce/orders'),
  products: api('/ecommerce/products'),
  stats: api('/ecommerce/stats'),
} as const;

/** Education dashboard endpoints. */
export const API_EDUCATION = {
  activity: api('/education/activity'),
  courses: api('/education/courses'),
  enrollment: api('/education/enrollment'),
  grades: api('/education/grades'),
  instructors: api('/education/instructors'),
  stats: api('/education/stats'),
} as const;

/** Finance dashboard endpoints. */
export const API_FINANCE = {
  cashflow: api('/finance/cashflow'),
  expenses: api('/finance/expenses'),
  invoices: api('/finance/invoices'),
  stats: api('/finance/stats'),
} as const;

/** Healthcare dashboard endpoints. */
export const API_HEALTHCARE = {
  appointments: api('/healthcare/appointments'),
  bedOccupancy: api('/healthcare/bed-occupancy'),
  departments: api('/healthcare/departments'),
  inventory: api('/healthcare/inventory'),
  satisfaction: api('/healthcare/satisfaction'),
  stats: api('/healthcare/stats'),
} as const;

/** HR dashboard endpoints. */
export const API_HR = {
  attendance: api('/hr/attendance'),
  employeeDistribution: api('/hr/employee-distribution'),
  openPositions: api('/hr/open-positions'),
  performance: api('/hr/performance'),
  recruitmentPipeline: api('/hr/recruitment-pipeline'),
  stats: api('/hr/stats'),
} as const;

/** LLM/AI dashboard endpoints. */
export const API_LLM = {
  costs: api('/llm/costs'),
  modelUsage: api('/llm/model-usage'),
  performance: api('/llm/performance'),
  stats: api('/llm/stats'),
  tokenTrends: api('/llm/token-trends'),
  useCases: api('/llm/use-cases'),
} as const;

/** Logistics dashboard endpoints. */
export const API_LOGISTICS = {
  deliveryPerformance: api('/logistics/delivery-performance'),
  fleetStatus: api('/logistics/fleet-status'),
  routeEfficiency: api('/logistics/route-efficiency'),
  shipments: api('/logistics/shipments'),
  stats: api('/logistics/stats'),
  warehouseInventory: api('/logistics/warehouse-inventory'),
} as const;

/** Marketing dashboard endpoints. */
export const API_MARKETING = {
  campaigns: api('/marketing/campaigns'),
  emailCampaigns: api('/marketing/email-campaigns'),
  socialMedia: api('/marketing/social-media'),
  stats: api('/marketing/stats'),
  topCampaigns: api('/marketing/top-campaigns'),
  trafficSources: api('/marketing/traffic-sources'),
} as const;

/** Real-estate dashboard endpoints. */
export const API_REAL_ESTATE = {
  locations: api('/real-estate/locations'),
  priceDistribution: api('/real-estate/price-distribution'),
  properties: api('/real-estate/properties'),
  propertyTypes: api('/real-estate/property-types'),
  salesTrends: api('/real-estate/sales-trends'),
  stats: api('/real-estate/stats'),
} as const;

/** Detail paths, for the endpoints that are expected to grow one. */
export const apiDetailPath = (collection: string, id: string): string =>
  api(`/${collection}/${id}`);

/**
 * Collections whose handlers accept writes, plus a helper for each detail path.
 *
 * The collection paths are the same ones their read-only counterparts use; they
 * are redeclared here so a write call site names the write-enabled surface
 * rather than reaching into `API_CORE`. Detail paths are functions because the
 * id is only known at the call site, which is also why they are absent from
 * `API_ENDPOINTS` below — that map is a closed set of static paths.
 */
export const API_WRITE = {
  products: api('/products'),
  productDetail: (id: string) => apiDetailPath('products', id),
  productCategories: api('/product-categories'),
  productCategoryDetail: (id: string) =>
    apiDetailPath('product-categories', id),
  tasks: api('/tasks'),
  taskDetail: (id: string) => apiDetailPath('tasks', id),
  invoices: api('/invoices'),
  invoiceDetail: (id: string) => apiDetailPath('invoices', id),
} as const;

/** Flat map of every endpoint, keyed by a stable dotted id. */
export const API_ENDPOINTS = {
  changelog: API_CORE.changelog,
  chat: API_CORE.chat,
  chatMessages: API_CORE.chatMessages,
  customers: API_CORE.customers,
  emails: API_CORE.emails,
  invoices: API_CORE.invoices,
  languages: API_CORE.languages,
  notifications: API_CORE.notifications,
  orders: API_CORE.orders,
  productCategories: API_WRITE.productCategories,
  products: API_CORE.products,
  profile: API_CORE.profile,
  projects: API_CORE.projects,
  sales: API_CORE.sales,
  stats: API_CORE.stats,
  tasks: API_CORE.tasks,
  traffic: API_CORE.traffic,

  'crm.activities': API_CRM.activities,
  'crm.deals': API_CRM.deals,
  'crm.leads': API_CRM.leads,
  'crm.stats': API_CRM.stats,

  'ecommerce.categories': API_ECOMMERCE.categories,
  'ecommerce.orders': API_ECOMMERCE.orders,
  'ecommerce.products': API_ECOMMERCE.products,
  'ecommerce.stats': API_ECOMMERCE.stats,

  'education.activity': API_EDUCATION.activity,
  'education.courses': API_EDUCATION.courses,
  'education.enrollment': API_EDUCATION.enrollment,
  'education.grades': API_EDUCATION.grades,
  'education.instructors': API_EDUCATION.instructors,
  'education.stats': API_EDUCATION.stats,

  'finance.cashflow': API_FINANCE.cashflow,
  'finance.expenses': API_FINANCE.expenses,
  'finance.invoices': API_FINANCE.invoices,
  'finance.stats': API_FINANCE.stats,

  'healthcare.appointments': API_HEALTHCARE.appointments,
  'healthcare.bedOccupancy': API_HEALTHCARE.bedOccupancy,
  'healthcare.departments': API_HEALTHCARE.departments,
  'healthcare.inventory': API_HEALTHCARE.inventory,
  'healthcare.satisfaction': API_HEALTHCARE.satisfaction,
  'healthcare.stats': API_HEALTHCARE.stats,

  'hr.attendance': API_HR.attendance,
  'hr.employeeDistribution': API_HR.employeeDistribution,
  'hr.openPositions': API_HR.openPositions,
  'hr.performance': API_HR.performance,
  'hr.recruitmentPipeline': API_HR.recruitmentPipeline,
  'hr.stats': API_HR.stats,

  'llm.costs': API_LLM.costs,
  'llm.modelUsage': API_LLM.modelUsage,
  'llm.performance': API_LLM.performance,
  'llm.stats': API_LLM.stats,
  'llm.tokenTrends': API_LLM.tokenTrends,
  'llm.useCases': API_LLM.useCases,

  'logistics.deliveryPerformance': API_LOGISTICS.deliveryPerformance,
  'logistics.fleetStatus': API_LOGISTICS.fleetStatus,
  'logistics.routeEfficiency': API_LOGISTICS.routeEfficiency,
  'logistics.shipments': API_LOGISTICS.shipments,
  'logistics.stats': API_LOGISTICS.stats,
  'logistics.warehouseInventory': API_LOGISTICS.warehouseInventory,

  'marketing.campaigns': API_MARKETING.campaigns,
  'marketing.emailCampaigns': API_MARKETING.emailCampaigns,
  'marketing.socialMedia': API_MARKETING.socialMedia,
  'marketing.stats': API_MARKETING.stats,
  'marketing.topCampaigns': API_MARKETING.topCampaigns,
  'marketing.trafficSources': API_MARKETING.trafficSources,

  'realEstate.locations': API_REAL_ESTATE.locations,
  'realEstate.priceDistribution': API_REAL_ESTATE.priceDistribution,
  'realEstate.properties': API_REAL_ESTATE.properties,
  'realEstate.propertyTypes': API_REAL_ESTATE.propertyTypes,
  'realEstate.salesTrends': API_REAL_ESTATE.salesTrends,
  'realEstate.stats': API_REAL_ESTATE.stats,
} as const;

/** Dotted id of any registered endpoint. */
export type ApiEndpointId = keyof typeof API_ENDPOINTS;

/** Path of any registered endpoint. */
export type ApiPath = (typeof API_ENDPOINTS)[ApiEndpointId];
