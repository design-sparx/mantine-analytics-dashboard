export interface CustomerDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  avatar?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  lastOrderDate?: string;
}

export type CustomerStatus = 1 | 2 | 3;

// Status mapping: 1 = Active, 2 = Inactive, 3 = Blocked
