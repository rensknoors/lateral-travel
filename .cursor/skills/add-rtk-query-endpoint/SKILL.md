---
name: add-rtk-query-endpoint
description: Add a new RTK Query endpoint to the shared API layer including types, MSW mock handler, and exported hook. Use when asked to add an API endpoint, create a query/mutation, hook up a new backend route, or scaffold RTK Query boilerplate.
---

# Add RTK Query Endpoint

## Overview

This skill adds a complete RTK Query endpoint across 4–6 files:
1. Endpoint definition in the correct `*-api.ts`
2. Response + Args types in the matching `types/<domain>/` folder
3. MSW mock handler + mock data factory
4. Exported hook via `enhanceEndpoints` in `queries/` or `mutations/`

All code lives under `libs/shared/api/src/`.

## Step 0 — Gather info

Determine from the user:
- **URI** (e.g. `/orders/:orderNumber/feasibility-signals-and-violations`)
- **HTTP method** (GET → query, POST/PUT/PATCH/DELETE → mutation)
- **Response shape** (or ask for a sample)
- **Args/params** (path params, query params, body)
- **Which API** — derive from URI prefix or ask:

| URI pattern | API file | baseUrl |
|---|---|---|
| `/new/...` or no `/tfx/v1/` prefix | `bff-new/bff-new-api.ts` | `bff.url + "/new"` |
| `/tfx/v1/...` | `bff/bff-api.ts` | `bff.url` |
| `/asset-management/...` | `asset-management/domain-api.ts` | varies |
| other | check `apis/*/constants.ts` | varies |

## Step 1 — Types

File: `apis/<api>/types/<domain>/<kebab-name>.ts`

Rules:
- Response type ends with `*Response`, args type ends with `*Args`
- Both in the same file
- Use `type` not `interface`
- Import shared types from `@tfx-frontend/shared/types` when available
- Import sibling domain types with relative `./` imports

```typescript
// Example: apis/bff-new/types/planning/feasibility-signals-and-violations.ts
import type { SignalSeverity } from "@tfx-frontend/shared/types";

export type FeasibilitySignalsAndViolationsResponse = {
  orderNumber: string;
  items: Array<{ code: string; severity: SignalSeverity }>;
};

export type FeasibilitySignalsAndViolationsArgs = {
  orderNumber: string;
};
```

Then re-export from the domain barrel:
```typescript
// types/<domain>/index.ts
export * from "./<kebab-name>";
```

## Step 2 — Endpoint definition

File: `apis/<api>/<api-name>-api.ts`

Add the endpoint inside `endpoints: (builder) => ({})`:
- **query** for GET, **mutation** for POST/PUT/PATCH/DELETE
- Import the types and add them to the existing import block from `"./types"`
- Place endpoint in the correct `#region` section
- Generic params: `builder.query<ResponseType, ArgsType>` or `builder.mutation<ResponseType, ArgsType>`
- Use `void` for args when none are needed

```typescript
getFeasibilitySignalsAndViolations: builder.query<
  FeasibilitySignalsAndViolationsResponse,
  FeasibilitySignalsAndViolationsArgs
>({
  query: ({ orderNumber }) => ({
    url: `/orders/${orderNumber}/feasibility-signals-and-violations`,
    method: "GET",
  }),
}),
```

If adding a new cache tag, add it to the `tagTypes` object in the same file.

## Step 3 — Hook export via enhanceEndpoints

Queries → `apis/<api>/queries/<domain>/get-<name>.ts`
Mutations → `apis/<api>/mutations/<domain>/<name>.ts`

```typescript
// Query example
import { bffNewApi, bffNewApiTagTypes } from "../../bff-new-api";

export const { useGetFeasibilitySignalsAndViolationsQuery } = bffNewApi.enhanceEndpoints({
  endpoints: {
    getFeasibilitySignalsAndViolations: {
      providesTags: [bffNewApiTagTypes.FeasibilitySignals],
      keepUnusedDataFor: 0,
    },
  },
});
```

```typescript
// Mutation example
import { bffNewApi, bffNewApiTagTypes } from "../../bff-new-api";

export const { useHideViolationMutation } = bffNewApi.enhanceEndpoints({
  endpoints: {
    hideViolation: {
      invalidatesTags: [bffNewApiTagTypes.Violations],
    },
  },
});
```

Hook naming:
- Queries: `useGet<Name>Query` — condense long URIs to the essence of what the endpoint does
- Mutations: `use<Name>Mutation`
- Example: URI `/orders/:id/feasibility-signals-and-violations` → `useGetFeasibilitySignalsAndViolationsQuery`
- Example: URI `/buildings/home/catalog/furniture-catalog/home-furniture-item-by-unique-id/:id` → `useGetFurnitureItemQuery`

Re-export from the domain barrel:
```typescript
// queries/<domain>/index.ts  or  mutations/<domain>/index.ts
export * from "./get-<name>";
```

## Step 4 — MSW mock handler

### Mock data factory

File: `mocks/handlers/<api>/<domain>/mock-data/mock-get-<name>-data.ts`

- Export a factory function: `mockGet<Name>Data` (returns response type)
- Use `@faker-js/faker` for realistic random data
- Import types from `../../../../../apis/<api>`
- Use `satisfies` for type safety on literals

```typescript
import { faker } from "@faker-js/faker";
import type { FeasibilitySignalsAndViolationsResponse } from "../../../../../apis/bff-new";

export const mockGetFeasibilitySignalsAndViolationsData = (): FeasibilitySignalsAndViolationsResponse => ({
  orderNumber: faker.number.int({ min: 100, max: 900 }).toString(),
  items: [],
});
```

Re-export from `mock-data/index.ts`.

### Handler

File: `mocks/handlers/<api>/<domain>/get-<name>-handler.ts`

```typescript
import { HttpResponse, http } from "msw";
import { Config } from "@tfx-frontend/shared/config";
import { mockGetFeasibilitySignalsAndViolationsData } from "./mock-data";

const { api } = Config?.services?.["bff"] ?? {};

export const getFeasibilitySignalsAndViolationsHandler = http.get(
  `${api.url}/new/orders/:orderNumber/feasibility-signals-and-violations`,
  async () => {
    return HttpResponse.json(mockGetFeasibilitySignalsAndViolationsData(), { status: 200 });
  }
);
```

URL construction:
- `bff-new` api → `${api.url}/new/<path>`
- `bff` api → `${api.url}/tfx/v1/<path>`
- Use `http.get`, `http.post`, `http.put`, `http.patch`, `http.delete` matching the method

Re-export handler from `<domain>/index.ts` and add to the handlers array. Re-export mock data from `mock-data/index.ts`.

## Step 5 — Barrel updates

Ensure all new files are re-exported through every barrel (`index.ts`) in the chain:

1. `types/<domain>/index.ts` — new type file
2. `queries/<domain>/index.ts` or `mutations/<domain>/index.ts` — new hook file
3. `mocks/handlers/<api>/<domain>/index.ts` — new handler
4. `mocks/handlers/<api>/<domain>/mock-data/index.ts` — new mock data

## Checklist

```
- [ ] Types file created with *Response and *Args types
- [ ] Types re-exported from domain barrel
- [ ] Endpoint added to api definition
- [ ] Type imports added to api file
- [ ] Hook file created with enhanceEndpoints (providesTags or invalidatesTags)
- [ ] Hook re-exported from queries/mutations barrel
- [ ] Mock data factory created with faker
- [ ] MSW handler created with correct URL
- [ ] Handler + mock data re-exported from barrels
- [ ] Cache tag added if new (to tagTypes object + handler providesTags/invalidatesTags)
```
