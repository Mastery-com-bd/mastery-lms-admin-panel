/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { convertDate } from "@/utills/convertDate";
import { ColumnDef } from "@tanstack/react-table";
import CategorySorting from "../../category/all/CategorySorting";
import CategoryDropdown from "../../category/all/CategoryDropdown";
import { TBooks } from "@/types/product.types";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { deleteBooks } from "@/service/books";

export const bookTableColumn = (): ColumnDef<TBooks>[] => [
  {
    id: "name",
    header: () => (
      <div className="flex items-center gap-1">
        <CategorySorting name="Name" sort="name" />
      </div>
    ),
    cell: ({ row }) => {
      const name = row.original?.name;
      const trimedName = name.length > 30 ? name.slice(0, 16) + "..." : name;
      const image = row.original?.productImage;
      return (
        <div className="relative group flex items-center gap-2">
          <Image
            src={image}
            height={50}
            width={50}
            alt={name}
            className="h-10 w-10 rounded-full"
          />
          <h1>{trimedName}</h1>
          <p className="absolute bottom-full left-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-2 py-1 shadow-md whitespace-nowrap z-10">
            {name}
          </p>
        </div>
      );
    },
  },
  {
    id: "description",
    header: "Description",
    cell: ({ row }) => {
      const name = row.original?.description;
      const trimedName = name.length > 50 ? name.slice(0, 16) + "..." : name;
      return (
        <div className="relative group inline-block">
          <h1>{trimedName}</h1>
          <p className="absolute bottom-full left-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-2 py-1 shadow-md whitespace-nowrap z-10">
            {name}
          </p>
        </div>
      );
    },
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original?.productCategory?.name;
      const trimmedCategory =
        category.length > 50 ? category.slice(0, 20) + "..." : category;
      return (
        <div className="relative group inline-block">
          <h1>{trimmedCategory}</h1>
          <p className="absolute bottom-full left-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg px-2 py-1 shadow-md whitespace-nowrap z-10">
            {category}
          </p>
        </div>
      );
    },
  },

  {
    accessorKey: "price",
    header: () => (
      <div className="flex items-center gap-1">
        <CategorySorting name="Price" sort="price" />
      </div>
    ),
    cell: ({ row }) => {
      const price = row.original.price;
      return <h1 className="flex flex-col items-start">{price} TK</h1>;
    },
  },
  {
    accessorKey: "sku",
    header: "Sku",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original?.productStatus;
      return <Badge variant={status ? "default" : "secondary"}>{status}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="flex items-center gap-1">
        <CategorySorting name="Created" sort="createdAt" />
      </div>
    ),
    cell: ({ row }) => {
      const { creationDate, creationTime } = convertDate(
        new Date(row.original?.createdAt),
      );

      return (
        <h1 className="flex flex-col items-start">
          <span>{creationDate}</span>
          <span>{creationTime}</span>
        </h1>
      );
    },
  },

  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const id = row.original?.id;
      const handleDelete = async (
        id: string,
        setOpen: Dispatch<SetStateAction<boolean>>,
        setLoading: Dispatch<SetStateAction<boolean>>,
      ) => {
        setLoading(true);
        const toastId = toast.loading("book deleting", { duration: 3000 });
        try {
          const result = await deleteBooks(id);
          if (result?.success) {
            toast.success(result?.message, { id: toastId, duration: 3000 });
            setLoading(false);
            setOpen(false);
          } else {
            toast.error(result?.message, { id: toastId, duration: 3000 });
            setLoading(false);
          }
        } catch (error: any) {
          console.log(error);
          setLoading(false);
        }
      };
      return (
        <CategoryDropdown
          id={id}
          path={`dashboard/books/${id}`}
          handleDelete={handleDelete}
        />
      );
    },
  },
];
