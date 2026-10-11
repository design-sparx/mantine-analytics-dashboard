import { NextResponse } from 'next/server';

import type { IApiResponse } from '@/types/api-response';

export type ValidationResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      errors: string[];
      response: NextResponse<IApiResponse<never>>;
    };

export interface FieldAllowList {
  create: string[];
  update: string[];
}

export interface ResourceValidationConfig {
  allowList: FieldAllowList;
  requiredCreate?: string[];
  requiredUpdate?: string[];
}

export const RESOURCE_VALIDATION_CONFIG: Record<
  string,
  ResourceValidationConfig
> = {
  Products: {
    allowList: {
      create: [
        'title',
        'description',
        'price',
        'quantityInStock',
        'sku',
        'imageUrl',
        'isActive',
        'status',
        'categoryId',
        'categoryName',
      ],
      update: [
        'title',
        'description',
        'price',
        'quantityInStock',
        'sku',
        'imageUrl',
        'isActive',
        'status',
        'categoryId',
        'categoryName',
        'modified',
      ],
    },
    requiredCreate: ['title', 'price', 'sku', 'categoryId'],
    requiredUpdate: [],
  },
  ProductCategories: {
    allowList: {
      create: ['title', 'description'],
      update: ['title', 'description', 'modified'],
    },
    requiredCreate: ['title'],
    requiredUpdate: [],
  },
  Invoices: {
    allowList: {
      create: [
        'full_name',
        'email',
        'address',
        'country',
        'status',
        'amount',
        'issue_date',
        'description',
        'client_email',
        'client_address',
        'client_country',
        'client_name',
        'client_company',
      ],
      update: [
        'full_name',
        'email',
        'address',
        'country',
        'status',
        'amount',
        'issue_date',
        'description',
        'client_email',
        'client_address',
        'client_country',
        'client_name',
        'client_company',
      ],
    },
    requiredCreate: [
      'full_name',
      'email',
      'amount',
      'issue_date',
      'client_name',
    ],
    requiredUpdate: [],
  },
  KanbanTasks: {
    allowList: {
      create: ['title', 'status'],
      update: ['title', 'status', 'comments', 'users'],
    },
    requiredCreate: ['title'],
    requiredUpdate: [],
  },
  Projects: {
    allowList: {
      create: ['name', 'start_date', 'end_date', 'state', 'assignee'],
      update: ['name', 'start_date', 'end_date', 'state', 'assignee'],
    },
    requiredCreate: ['name'],
    requiredUpdate: [],
  },
  UserProfile: {
    allowList: {
      create: ['avatar', 'name', 'email', 'job'],
      update: ['avatar', 'name', 'email', 'job'],
    },
    requiredCreate: ['name', 'email'],
    requiredUpdate: [],
  },
};

function pickAllowedFields<T extends Record<string, unknown>>(
  body: T,
  allowedFields: string[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in body) {
      result[key] = body[key];
    }
  }
  return result;
}

function checkRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[],
): string[] {
  const missing: string[] = [];
  for (const field of requiredFields) {
    if (
      !(field in body) ||
      body[field] === undefined ||
      body[field] === null ||
      body[field] === ''
    ) {
      missing.push(field);
    }
  }
  return missing;
}

function createErrorResponse(
  message: string,
  errors: string[],
  status = 400,
): NextResponse<IApiResponse<never>> {
  return NextResponse.json<IApiResponse<never>>(
    {
      succeeded: false,
      data: null,
      errors,
      message,
      timestamp: new Date().toISOString(),
    },
    { status },
  );
}

export function validateWritePayload<T extends Record<string, unknown>>(
  resource: string,
  method: 'POST' | 'PUT' | 'PATCH',
  body: unknown,
  pathId?: string,
): ValidationResult<T> {
  const config = RESOURCE_VALIDATION_CONFIG[resource];
  if (!config) {
    return {
      success: true,
      data: body as T,
    };
  }

  if (!body || typeof body !== 'object') {
    return {
      success: false,
      errors: ['Invalid request body: must be an object'],
      response: createErrorResponse('Invalid request body', [
        'Invalid request body: must be an object',
      ]),
    };
  }

  const bodyObj = body as Record<string, unknown>;

  if ('id' in bodyObj) {
    if (method === 'POST') {
      return {
        success: false,
        errors: ['Client-generated IDs are not allowed'],
        response: createErrorResponse('ID must be server-generated', [
          'Client-generated IDs are not allowed',
        ]),
      };
    }
    if (method === 'PUT' && pathId && bodyObj.id !== pathId) {
      return {
        success: false,
        errors: ['ID in body does not match resource ID'],
        response: createErrorResponse('ID mismatch', [
          'ID in body does not match resource ID',
        ]),
      };
    }
  }

  const allowedFields =
    config.allowList[method === 'POST' ? 'create' : 'update'];
  const requiredFields =
    method === 'POST'
      ? config.requiredCreate ?? []
      : config.requiredUpdate ?? [];

  const missingRequired = checkRequiredFields(bodyObj, requiredFields);
  if (missingRequired.length > 0) {
    const errors = missingRequired.map((f) => `Missing required field: ${f}`);
    return {
      success: false,
      errors,
      response: createErrorResponse('Validation failed', errors),
    };
  }

  const filteredBody = pickAllowedFields(bodyObj, allowedFields);

  return {
    success: true,
    data: filteredBody as T,
  };
}
