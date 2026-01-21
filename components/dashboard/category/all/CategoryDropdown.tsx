/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { deleteCategory } from "@/service/category";
import { toast } from "sonner";
import DeleteComponent from "@/components/ui/DeleteComponent";

const CategoryDropdown = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (
    id: string,
    setOpen: Dispatch<SetStateAction<boolean>>,
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/categories/update?id=${id}`}>
            Edit category
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={(e) => e.preventDefault()}
        >
          <DeleteComponent id={id} onDelete={handleDelete} loading={loading} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDropdown;
