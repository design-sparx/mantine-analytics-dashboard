// Updated types to match your C# backend models
// Note: For new development, prefer using the OpenAPI-generated types from @/lib/api

export interface IInvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productId?: string | null;
  invoiceId?: string;
  product?: {
    id: string;
    title: string;
    price: number;
    sku?: string;
  };
  created?: string;
  createdById?: string;
  modified?: string;
  modifiedById?: string;
}

export interface IInvoice {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount?: number;
  status: InvoiceStatus;
  notes?: string;

  // Optional order relationship
  orderId?: string | null;
  order?: any; // Define order interface as needed

  // Customer information (for standalone invoices)
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  billingAddress?: string;

  // Pricing details
  subtotal?: number;
  taxRate?: number;
  taxAmount?: number;
  discountAmount?: number;
  paymentTerms?: string;

  // User relationship
  userId?: string;
  user?: any;

  // Invoice items
  items?: IInvoiceItem[]; // Backend uses 'Items'
  invoiceItems?: IInvoiceItem[]; // Frontend compatibility

  // Audit fields
  created?: string;
  createdById?: string;
  createdBy?: any; // Use OpenAPI types for new development
  modified?: string;
  modifiedById?: string;
  modifiedBy?: any; // Use OpenAPI types for new development
}

export enum InvoiceStatus {
  Draft = 0,
  Sent = 1,
  Paid = 2,
  PartiallyPaid = 3,
  Overdue = 4,
  Cancelled = 5,
  Refunded = 6,
}

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  [InvoiceStatus.Draft]: 'Draft',
  [InvoiceStatus.Sent]: 'Sent',
  [InvoiceStatus.Paid]: 'Paid',
  [InvoiceStatus.PartiallyPaid]: 'Partially Paid',
  [InvoiceStatus.Overdue]: 'Overdue',
  [InvoiceStatus.Cancelled]: 'Cancelled',
  [InvoiceStatus.Refunded]: 'Refunded',
};

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  [InvoiceStatus.Draft]: 'gray',
  [InvoiceStatus.Sent]: 'blue',
  [InvoiceStatus.Paid]: 'green',
  [InvoiceStatus.PartiallyPaid]: 'orange',
  [InvoiceStatus.Overdue]: 'red',
  [InvoiceStatus.Cancelled]: 'dark',
  [InvoiceStatus.Refunded]: 'yellow',
};

// Helper function to safely get status label
export const getInvoiceStatusLabel = (status: number): string => {
  return INVOICE_STATUS_LABELS[status as InvoiceStatus] || 'Unknown';
};

// Helper function to safely get status color
export const getInvoiceStatusColor = (status: number): string => {
  return INVOICE_STATUS_COLORS[status as InvoiceStatus] || 'gray';
};

// Alias for consistency with other DTOs
export type InvoiceDto = IInvoice;
