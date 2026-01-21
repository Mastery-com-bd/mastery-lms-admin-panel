"use client";

import { ArrowUpDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const CategorySorting = ({ name, sort }: { name: string; sort: string }) => {
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const handleSort = (field: string) => {
    let newOrder: "asc" | "desc" = "asc";
    if (sortBy === field) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(field);
    setSortOrder(newOrder);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", field);
    params.set("sortOrder", newOrder);

    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  };

  return (
    <div onClick={() => handleSort(sort)} className="flex items-center gap-1">
      {name}
      <ArrowUpDown className="h-3 w-3" />
    </div>
  );
};

export default CategorySorting;
