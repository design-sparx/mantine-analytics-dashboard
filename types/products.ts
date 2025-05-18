import { IUser } from '@/types/user';

export interface IProduct {
  id: string;
  title: any;
  description: any;
  price: number;
  quantityInStock: number;
  sku: any;
  imageUrl: any;
  isActive: boolean;
  status: number;
  category: IProductCategory;
  categoryId: string;
  categoryName: any;
  created: string;
  modified: string;
  createdById: any;
  createdBy: IUser;
  modifiedById: any;
  modifiedBy: IUser;
}

export interface IProductCategory {
  id: string;
  title: any;
  description: any;
  created: string;
  modified: string;
  createdById: any;
  createdBy: IUser;
  modifiedById: any;
  modifiedBy: IUser;
  productCount: number;
}
