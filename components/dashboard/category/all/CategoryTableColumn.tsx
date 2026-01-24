/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Badge } from "@/components/ui/badge";
import { TCategory } from "@/types/category.types";
import { convertDate } from "@/utills/convertDate";
import { ColumnDef } from "@tanstack/react-table";
import CategoryDropdown from "./CategoryDropdown";
import CategorySorting from "./CategorySorting";
import { Dispatch, SetStateAction } from "react";
import { deleteCategory } from "@/service/category";
import { toast } from "sonner";
import CreateCategory from "./CreateCategory";
import Image from "next/image";
import TooltipComponent from "@/components/ui/TooltipComponent";

export const categoryTableColumn = (): ColumnDef<TCategory>[] => [
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
      return (
        <div className=" flex items-center gap-2">
          <Image
            src={
              row.original?.iconUrl ||
              "https://res.cloudinary.com/dbb6nen3p/image/upload/v1762848442/no_image_s3demz.png"
            }
            height={50}
            width={50}
            alt={name}
            className="h-10 w-10 rounded-full"
          />
          <TooltipComponent name={name} trimedName={trimedName} />;
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
      return <TooltipComponent name={name} trimedName={trimedName} />;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original?.isActive;
      return (
        <Badge variant={status ? "default" : "secondary"}>
          {status ? "Active" : "Inactive"}
        </Badge>
      );
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
      const category = row.original;
      const handleDelete = async (
        id: string,
        setOpen: Dispatch<SetStateAction<boolean>>,
        setLoading: Dispatch<SetStateAction<boolean>>,
      ) => {
        setLoading(true);
        const toastId = toast.loading("category deleting", { duration: 3000 });
        try {
          const result = await deleteCategory(id);
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
        <CategoryDropdown id={id} handleDelete={handleDelete}>
          <CreateCategory category={category} />
        </CategoryDropdown>
      );
    },
  },
];
