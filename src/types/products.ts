// Updated types to match your C# backend models
// Note: For new development, prefer using the OpenAPI-generated types from @/lib/api

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
  createdBy: any; // Use OpenAPI types for new development
  modifiedById: any;
  modifiedBy: any; // Use OpenAPI types for new development
}

export interface IProductCategory {
  id: string;
  title: any;
  description: any;
  created: string;
  modified: string;
  createdById: any;
  createdBy: any; // Use OpenAPI types for new development
  modifiedById: any;
  modifiedBy: any; // Use OpenAPI types for new development
  productCount: number;
}

// Alias for consistency with other DTOs
export type ProductDto = IProduct;
export type ProductCategoryDto = IProductCategory;
