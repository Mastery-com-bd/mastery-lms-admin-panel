"use client";
import { Badge } from "@/components/ui/badge";
import { TCategory } from "@/types/category.types";
import { convertDate } from "@/utills/convertDate";
import { ColumnDef } from "@tanstack/react-table";
import CategoryDropdown from "./CategoryDropdown";
import CategorySorting from "./CategorySorting";

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
      return <CategoryDropdown id={id} />;
    },
  },
];
