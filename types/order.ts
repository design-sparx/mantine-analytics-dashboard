export interface OrderDto {
  id: string;
  product: string;
  date: string;
  total: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
}

export type OrderStatus = 1 | 2 | 3 | 4 | 5;
export type PaymentMethod = 1 | 2 | 3 | 4 | 5;

// Status mapping: 1 = Pending, 2 = Processing, 3 = Shipped, 4 = Delivered, 5 = Cancelled
// Payment method mapping: 1 = Credit Card, 2 = Debit Card, 3 = PayPal, 4 = Cash, 5 = Bank Transfer
