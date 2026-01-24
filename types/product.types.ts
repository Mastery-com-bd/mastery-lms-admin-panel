export type TBooks = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  sku: string;
  stock: number | string;
  productStatus: "PUBLISHED" | "DRAFT" | "DISCONTINUED";
  productImage: string;
  productCategoryId: string;
  orderItems?: [];
  productCategory: {
    id: string;
    name: string;
  };
  createdAt: string;
};
