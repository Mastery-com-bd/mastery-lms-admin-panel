"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { showError, showSuccess } from "@/lib/toast";
import { error } from "console";

interface Category {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const AllCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isActive, setIsActive] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: meta.page.toString(),
        limit: meta.limit.toString(),
        sortBy,
        sortOrder,
      });

      if (debouncedSearch) {
        queryParams.append("searchTerm", debouncedSearch);
      }

      if (isActive !== "all") {
        queryParams.append(
          "isActive",
          isActive === "active" ? "true" : "false"
        );
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/category?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      setCategories(data.data || []); // Adjust based on actual API response structure
      setMeta(data.meta || { page: 1, limit: 10, total: 0, totalPages: 0 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, debouncedSearch, isActive, sortBy, sortOrder]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const handleDelete = async (categoryId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/category/${categoryId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

     

      const { data } = await response.json();
      console.log("Category deleted:", data);
      showSuccess({ message: data.message || "Category deleted successfully" });
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.dismiss();
      showError({
        message:
          error instanceof Error ? error.message : "Failed to delete category",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          All Categories
        </h1>
      </div>

      <Card className="border-none shadow-sm">
        {/* Filters Bar */}
        <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search categories..."
                className="pl-9 bg-muted/30 border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={isActive} onValueChange={setIsActive}>
              <SelectTrigger className="w-full md:w-[150px] bg-muted/30 border-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchCategories()}
              disabled={loading}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="relative w-full overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Description
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center gap-1">
                      Created At
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle font-medium">
                        <div className="flex items-center gap-2">
                          {category.iconUrl && (
                            <img
                              src={category.iconUrl}
                              alt=""
                              className="h-6 w-6 object-contain"
                            />
                          )}
                          {category.name}
                        </div>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground max-w-[300px] truncate">
                        {category.description}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={category.isActive ? "default" : "secondary"}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dashboard/categories/update?id=${category.id}`}
                              >
                                Edit category
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(category.id)}
                            >
                              Delete category
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-t">
          <div className="text-sm text-muted-foreground">
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
            entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={meta.page === 1 || loading}
              onClick={() => handlePageChange(meta.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={meta.page >= meta.totalPages || loading}
              onClick={() => handlePageChange(meta.page + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AllCategory;
