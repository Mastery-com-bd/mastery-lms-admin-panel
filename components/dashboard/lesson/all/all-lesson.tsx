"use client";

import React, { useState, useEffect } from "react";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RefreshCcw,
  Search,
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
import { toast } from "sonner";
import { showError, showLoading, showSuccess } from "@/lib/toast";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { deleteLesson } from "@/service/lessons";

// Types based on API response
interface Section {
  id: string;
  title: string;
  course?: {
    title: string;
  };
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  order: number;
  isPreview: boolean;
  videoUrl: string;
  sectionId: string;
  section: Section;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
}

const AllLesson = ({ lessons, meta }: { lessons: Lesson[]; meta: Meta }) => {
  const [sections, setSections] = useState<Section[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derived state from URL
  const sectionId = searchParams.get("sectionId") || "all";
  const sortBy = searchParams.get("sortBy") || "order";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
  const searchTermParam = searchParams.get("searchTerm") || "";

  // Local state for search input to allow typing
  const [searchTerm, setSearchTerm] = useState(searchTermParam);

  // Sync local search term with URL param
  useEffect(() => {
    setSearchTerm(searchTermParam);
  }, [searchTermParam]);

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== searchTermParam) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
          params.set("searchTerm", searchTerm);
        } else {
          params.delete("searchTerm");
        }
        params.set("page", "1"); // Reset page on search
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, router, pathname, searchParams, searchTermParam]);

  // Fetch Sections for filter (Keep client-side fetching as requested)
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/section?limit=100`,
        );
        if (response.ok) {
          const data = await response.json();
          setSections(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      }
    };
    fetchSections();
  }, []);

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortBy === field) {
      params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", field);
      params.set("sortOrder", "asc");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = async (lessonId: string) => {
    try {
      showLoading("Deleting lesson...");
      const res = await deleteLesson(lessonId);

      toast.dismiss();
      if (res.success) {
        showSuccess({ message: res.message || "Lesson deleted successfully" });
      } else {
        showError({ message: res.message || "Failed to delete lesson" });
      }
    } catch (error) {
      console.error(error);
      showError({ message: "Failed to delete lesson" });
    }
  };

  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">All Lessons</h1>
      </div>

      <Card className="border-none shadow-sm">
        {/* Filters Bar */}
        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search lessons..."
                className="pl-9 bg-muted/30 border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={sectionId}
              onValueChange={(val) => handleFilterChange("sectionId", val)}
            >
              <SelectTrigger className="w-full md:w-[250px] bg-muted/30 border-none">
                <SelectValue placeholder="Filter by Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.course?.title ? `${section.course.title} - ` : ""}
                    {section.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.refresh()}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort("order")}
                >
                  <div className="flex items-center gap-1">
                    Order
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1">
                    Title
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Section
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Duration
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Preview
                </th>
                <th
                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center gap-1">
                    Created
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {lessons.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No lessons found.
                  </td>
                </tr>
              ) : (
                lessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium">
                      {lesson.order}
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex flex-col max-w-[300px]">
                        <span
                          className="font-medium truncate"
                          title={lesson.title}
                        >
                          {lesson.title}
                        </span>
                        <span
                          className="text-xs text-muted-foreground truncate"
                          title={lesson.description}
                        >
                          {lesson.description}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {lesson.section?.title || "Unknown Section"}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {lesson.duration} min
                    </td>
                    <td className="p-4 align-middle">
                      <Badge
                        variant={lesson.isPreview ? "default" : "secondary"}
                      >
                        {lesson.isPreview ? "Preview" : "Locked"}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {new Date(lesson.createdAt).toLocaleDateString()}
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
                              href={`/dashboard/lesson/update/${lesson.id}`}
                            >
                              Edit lesson
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:bg-rose-600 focus:text-white"
                            onClick={() => handleDelete(lesson.id)}
                          >
                            Delete lesson
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
              disabled={meta.page === 1}
              onClick={() => handlePageChange(meta.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {meta.page} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={meta.page >= totalPages}
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

export default AllLesson;
