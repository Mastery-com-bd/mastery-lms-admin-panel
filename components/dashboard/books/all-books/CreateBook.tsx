"use client";

import z from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string({
    message: "price is required.",
  }),
  sku: z.string({
    message: "sku is required.",
  }),
  stock: z.string({
    message: "stock is required.",
  }),
  productStatus: z.enum(
    ["PUBLISHED", "DRAFT", "DISCONTINUED"],
    "product status is required",
  ),
  productCategoryId: z.string({
    message: "product category is required",
  }),
});

const CreateBook = () => {
  return <div>this is product create</div>;
};

export default CreateBook;
