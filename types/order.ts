export interface IOrderItem {
  id?: string;
  productId: string;
  quantity: number;
  price?: number;
  product?: {
    id: string;
    title: string;
    price: number;
    sku?: string;
  };
}

export interface IOrder {
  id: string;
  customerId?: string | null;
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  shippingAddress?: string | null;
  billingAddress?: string | null;
  paymentMethod?: string | null;
  status: number;
  totalAmount?: number;
  orderItems: IOrderItem[];
  createdById?: string | null;
  modifiedById?: string | null;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  Refunded = 6,
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Pending',
  [OrderStatus.Processing]: 'Processing',
  [OrderStatus.Shipped]: 'Shipped',
  [OrderStatus.Delivered]: 'Delivered',
  [OrderStatus.Cancelled]: 'Cancelled',
  [OrderStatus.Refunded]: 'Refunded',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'yellow',
  [OrderStatus.Processing]: 'blue',
  [OrderStatus.Shipped]: 'orange',
  [OrderStatus.Delivered]: 'green',
  [OrderStatus.Cancelled]: 'red',
  [OrderStatus.Refunded]: 'gray',
};

// Helper function to safely get status label
export const getOrderStatusLabel = (status: number): string => {
  return ORDER_STATUS_LABELS[status as OrderStatus] || 'Unknown';
};

// Helper function to safely get status color
export const getOrderStatusColor = (status: number): string => {
  return ORDER_STATUS_COLORS[status as OrderStatus] || 'gray';
};
