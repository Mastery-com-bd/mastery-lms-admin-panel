export type TBooks = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sku: string;
  stock: number;
  productStatus: "PUBLISHED" | "DRAFT" | "DISCONTINUED";
  productImage: string;
  productCategory: {
    id: string;
    name: string;
  };
  createdAt: string;
};
