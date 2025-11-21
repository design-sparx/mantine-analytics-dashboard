import type { components } from '@/lib/api';
import type { MockResponse } from '../types';

type InvoiceDto = components['schemas']['InvoiceDto'];
type InvoiceResponse = components['schemas']['InvoiceResponse'];
type InvoiceCreateResponse = components['schemas']['InvoiceCreateResponse'];
type InvoiceUpdateResponse = components['schemas']['InvoiceUpdateResponse'];
type InvoiceDeleteResponse = components['schemas']['InvoiceDeleteResponse'];

// Sample mock invoices
const mockInvoices: InvoiceDto[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    client: 'Acme Corp',
    amount: 2500.0,
    status: 'paid',
    dueDate: '2024-01-15',
    issuedDate: '2024-01-01',
    description: 'Web development services',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    client: 'Tech Solutions Inc',
    amount: 3750.5,
    status: 'pending',
    dueDate: '2024-02-01',
    issuedDate: '2024-01-15',
    description: 'UI/UX design project',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    client: 'Global Enterprises',
    amount: 5000.0,
    status: 'overdue',
    dueDate: '2023-12-30',
    issuedDate: '2023-12-15',
    description: 'Monthly consulting services',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    client: 'StartUp Labs',
    amount: 1250.25,
    status: 'draft',
    dueDate: '2024-02-15',
    issuedDate: '2024-01-20',
    description: 'Logo design and branding',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2024-005',
    client: 'Digital Media Co',
    amount: 4200.0,
    status: 'paid',
    dueDate: '2024-01-30',
    issuedDate: '2024-01-10',
    description: 'Content management system',
  },
];

export const invoicesMockData = {
  list: (): MockResponse<InvoiceDto[]> => ({
    succeeded: true,
    data: mockInvoices,
    errors: [],
    message: 'Mock invoices retrieved successfully',
  }),

  byId: (id: string): MockResponse<InvoiceResponse> => {
    const invoice = mockInvoices.find((inv) => inv.id === id);
    if (!invoice) {
      return {
        succeeded: false,
        data: null as any,
        errors: ['Invoice not found'],
        message: 'Invoice not found',
      };
    }
    return {
      succeeded: true,
      data: invoice as any,
      errors: [],
      message: 'Mock invoice retrieved successfully',
    };
  },

  create: (data: InvoiceDto): MockResponse<InvoiceCreateResponse> => {
    const newInvoice = {
      ...data,
      id: String(mockInvoices.length + 1),
    };
    mockInvoices.push(newInvoice);
    return {
      succeeded: true,
      data: newInvoice as any,
      errors: [],
      message: 'Mock invoice created successfully',
    };
  },

  update: (
    id: string,
    data: Partial<InvoiceDto>,
  ): MockResponse<InvoiceUpdateResponse> => {
    const index = mockInvoices.findIndex((inv) => inv.id === id);
    if (index === -1) {
      return {
        succeeded: false,
        data: null as any,
        errors: ['Invoice not found'],
        message: 'Invoice not found',
      };
    }
    mockInvoices[index] = { ...mockInvoices[index], ...data };
    return {
      succeeded: true,
      data: mockInvoices[index] as any,
      errors: [],
      message: 'Mock invoice updated successfully',
    };
  },

  delete: (id: string): MockResponse<InvoiceDeleteResponse> => {
    const index = mockInvoices.findIndex((inv) => inv.id === id);
    if (index === -1) {
      return {
        succeeded: false,
        data: null as any,
        errors: ['Invoice not found'],
        message: 'Invoice not found',
      };
    }
    mockInvoices.splice(index, 1);
    return {
      succeeded: true,
      data: { success: true } as any,
      errors: [],
      message: 'Mock invoice deleted successfully',
    };
  },
};
