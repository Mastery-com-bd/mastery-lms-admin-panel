/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TCategory } from "@/types/category.types";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { createBook } from "@/service/books";

const formSchema = z.object({
  name: z
    .string({
      message: "Name is required",
    })
    .min(2, {
      message: "Name must be at least 2 characters.",
    }),
  description: z
    .string({
      message: "description is required",
    })
    .min(10, {
      message: "Description must be at least 10 characters.",
    }),
  price: z
    .string({
      message: "price is required.",
    })
    .min(1, {
      message: "price must be included",
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

type TBooks = z.infer<typeof formSchema>;

const UpdateBook = ({
  categories,
  book,
}: {
  categories: TCategory[];
  book: TBooks;
}) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);

    // Clear the input element manually
    const input = document.getElementById("bookImageInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const onSubmit = async (data: TBooks) => {
    const formData = new FormData();
    const toastId = toast.loading("book creating", { duration: 3000 });
    if (!image) {
      toast.error("book image is required", { id: toastId, duration: 3000 });
      return;
    }
    const payload = {
      ...data,
      sku: `Book-${data.sku}`,
      price: Number(data.price),
      stock: Number(data.stock),
    };
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    formData.append("productImage", image);
    try {
      const result = await createBook(formData);
      console.log(result);
      if (result?.success) {
        toast.success(result?.message, { id: toastId, duration: 3000 });
        form.reset();
        setOpen(false);
        removeImage();
      } else {
        toast.error(result?.message, { id: toastId, duration: 3000 });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset();
        }
        setOpen(isOpen);
        removeImage();
      }}
    >
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Create Book</Button>
      </DialogTrigger>

      {/* 🧾 Modal Content */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Book</DialogTitle>
          <DialogDescription>Add a new book for courses.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Web Development" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="enter price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="enter sku" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="enter stock"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Select Status</FormLabel>
                <Controller
                  name="productStatus"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {["PUBLISHED", "DRAFT", "DISCONTINUED"].map(
                          (item, i) => {
                            const formatted =
                              item.charAt(0).toUpperCase() +
                              item.slice(1).toLowerCase();

                            return (
                              <SelectItem key={i} value={item}>
                                {formatted}
                              </SelectItem>
                            );
                          },
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.productStatus && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.productStatus.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <FormLabel>Select Category</FormLabel>
                <Controller
                  name="productCategoryId"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Product Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((item, i) => {
                          return (
                            <SelectItem key={i} value={item?.id}>
                              {item?.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.productCategoryId && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.productCategoryId.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Image</Label>
                <div className="flex gap-4 items-center">
                  {preview ? (
                    <div className="relative">
                      <Image
                        height={50}
                        width={50}
                        alt="file"
                        src={preview}
                        className="w-20 h-20 rounded object-cover border"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 cursor-pointer"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Learn web development..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateBook;
