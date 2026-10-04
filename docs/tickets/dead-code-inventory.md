# Dead code inventory — for ticket 08 (dedup, naming, page metadata)

Recorded while migrating the mock routes in ticket 03. Nothing here was deleted
or changed; this is what the next cleanup ticket needs to know.

## Mock routes no page or component fetches

**None.** All 70 registered endpoints have at least one call site. The
`API_PENDING` set in `src/routes/api.ts` tracks the opposite problem: endpoints
that _are_ called but are not implemented.

So there is no unreferenced-route cleanup to do. The candidates for removal are
mock JSON files rather than routes.

## Mock JSON fixtures with no owning route

Every route reads exactly one fixture, and no two routes read the same fixture
(verified during ticket 03). Fixtures under `public/mocks` that no route
references are therefore free of an owner and are the real candidates:

- `student-enrollment.json` — note the near-duplicate of
  `education-enrollment.json`, which `/api/education/enrollment` does read.

Worth reviewing the whole directory before deleting anything; the naming is not
consistent enough to infer intent from it.

## Hooks in `src/lib/hooks/useApi.ts`

11 of the 16 exports have no importer:

| Unused                               | Note                                                      |
| ------------------------------------ | --------------------------------------------------------- |
| `useApiGet`                          | the generic wrapper every other hook is built on          |
| `useInvoices`                        |                                                           |
| `useProducts`                        | shadows a richer implementation used by the products page |
| `useSales`                           | `any`-typed                                               |
| `useTasks`                           |                                                           |
| `useSales`, `useStats`, `useTraffic` | `useStats`/`useTraffic` are `any`-typed                   |

Still imported somewhere, so leave alone for now:

`useProjects`, `useOrders`, `useCustomers`, `useEmails`, `useNotifications`,
`useChats`, `useChatMessages`, `useProfile`, `useLanguages`, `useStats`,
`useTraffic`

Note that `useStats`, `useTraffic`, and `useLanguages` are imported yet
`any`-typed, so "imported" does not mean "typed".

Once ticket 05 has moved the page call sites over to `useApiGet`, this whole
module should be deletable in one commit.

## Endpoints called but not implemented

`/api/product-categories` is called from six places across the product pages and
has no route, so those pages receive a 404 today. Declared in `API_PENDING`.
Creating it is ticket 06.

Six dynamic references (`/api/invoices/${id}`, `/api/tasks/${task.id}`,
`/api/products/${product.id}`, `/api/product-categories/${productCategory.id}`,
and the two `.../${id}` detail paths) have no matching `[id]` route either.
`apiDetailPath` exists in the registry for when they land.
