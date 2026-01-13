"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

// Types based on API response
interface Course {
  id: string;
  title: string;
}

interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  courseId: string;
  course: Course;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
}

const AllSection = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);

  // Filters state
  const [courseId, setCourseId] = useState<string>("all");
  const [sortBy, setSortBy] = useState("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch Courses for filter
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/course?limit=100`
        );
        if (response.ok) {
          const data = await response.json();

          setCourses(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };
    fetchCourses();
  }, []);

  // Fetch Sections
  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: meta.page.toString(),
        limit: meta.limit.toString(),
        sortBy,
        sortOrder,
      });

      if (courseId !== "all") {
        queryParams.append("courseId", courseId);
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/section?${queryParams.toString()}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }

      const data = await response.json();
      if (data.success) {
        setSections(data.data || []);
        setMeta(data.meta || { page: 1, limit: 10, total: 0 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sections");
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, courseId, sortBy, sortOrder]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

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

  const handleDelete = async (sectionId: string) => {
    try {
      showLoading("Deleting section...");
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/section/${sectionId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      toast.dismiss();
      showSuccess({ message: "Section deleted successfully" });
      fetchSections(); // Refresh the section list
    } catch (error) {
      console.error(error);
      showError({ message: "Failed to delete section" });
    }
  };

  const totalPages = Math.ceil(meta.total / meta.limit);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">All Sections</h1>
      </div>

      <Card className="border-none shadow-sm">
        {/* Filters Bar */}
        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger className="w-full md:w-[250px] bg-muted/30 border-none">
                <SelectValue placeholder="Filter by Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchSections()}
              disabled={loading}
            >
              <RefreshCcw className="h-4 w-4" />
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
                    Course
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
                {sections.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No sections found.
                    </td>
                  </tr>
                ) : (
                  sections.map((section) => (
                    <tr
                      key={section.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle font-medium">
                        {section.order}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col max-w-[300px]">
                          <span
                            className="font-medium truncate"
                            title={section.title}
                          >
                            {section.title}
                          </span>
                          <span
                            className="text-xs text-muted-foreground truncate"
                            title={section.description}
                          >
                            {section.description}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {section.course?.title || "Unknown Course"}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {new Date(section.createdAt).toLocaleDateString()}
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
                              <Link href={`/dashboard/section/id/${section.id}`}>
                                Edit section
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:bg-rose-600 focus:text-white"
                              onClick={() => handleDelete(section.id)}
                            >
                              Delete section
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
            <div className="text-sm font-medium">
              Page {meta.page} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={meta.page >= totalPages || loading}
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

export default AllSection;
