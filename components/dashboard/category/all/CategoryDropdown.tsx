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
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import DeleteComponent from "@/components/ui/DeleteComponent";

type TDropdownProps = {
  id: string;
  path?: string;
  handleDelete: (
    id: string,
    setOpen: Dispatch<SetStateAction<boolean>>,
    setLoading: Dispatch<SetStateAction<boolean>>,
  ) => Promise<void>;
  children?: ReactNode;
};

const CategoryDropdown = ({
  id,
  path,
  handleDelete,
  children,
}: TDropdownProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {path && (
          <DropdownMenuItem asChild>
            <Link href={path} className="cursor-pointer">
              Details
            </Link>
          </DropdownMenuItem>
        )}
        {children && <DropdownMenuItem asChild>{children}</DropdownMenuItem>}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={(e) => e.preventDefault()}
        >
          <DeleteComponent
            id={id}
            onDelete={handleDelete}
            loading={loading}
            setLoading={setLoading}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoryDropdown;
