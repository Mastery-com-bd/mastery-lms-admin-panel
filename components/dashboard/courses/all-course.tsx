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
  BookOpen,
  RefreshCcw,
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
import Image from "next/image";
import Link from "next/link";
import { showError, showLoading, showSuccess } from "@/lib/toast";

// Types based on API response
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  price: number;
  discountPrice: number | null;
  status: string;
  level: string;
  courseLeaningType: string;
  language: string;
  category: Category;
  createdAt: string;
  totalLessons: number;
  enrolledCount: number;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
}

const AllCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Courses
  const fetchCourses = useCallback(async () => {
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

      if (status !== "all") {
        queryParams.append("status", status);
      }

      if (level !== "all") {
        queryParams.append("level", level);
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/course?${queryParams.toString()}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      if (data.success) {
        setCourses(data.data || []);
        setMeta(data.meta || { page: 1, limit: 10, total: 0 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  }, [
    meta.page,
    meta.limit,
    debouncedSearch,
    status,
    level,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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

  const totalPages = Math.ceil(meta.total / meta.limit);

  const handleDelete = async (courseId: string) => {
    try {
      showLoading("Deleting course...");
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${courseId}`, {
        method: "DELETE",
        credentials: "include",
      });

      toast.dismiss();
      showSuccess({ message: "Course deleted successfully" });
      fetchCourses(); // Refresh the course list
    } catch (error) {
      console.error(error);
      showError({ message: "Failed to delete course" });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">All Courses</h1>
      </div>

      <Card className="border-none shadow-sm">
        {/* Filters Bar */}
        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
            <div className="relative w-full md:w-75">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="pl-9 bg-muted/30 border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full md:w-37.5 bg-muted/30 border-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>

            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-full md:w-37.5 bg-muted/30 border-none">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchCourses()}
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
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-1">
                      Course
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Category
                  </th>
                  <th
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    <div className="flex items-center gap-1">
                      Price
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Level
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
                {courses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No courses found.
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr
                      key={course.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-16 overflow-hidden rounded-md bg-muted">
                            {course.thumbnail ? (
                              <Image
                                width={64}
                                height={40}
                                src={course.thumbnail}
                                alt={course.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col max-w-50 md:max-w-75">
                            <span
                              className="font-medium truncate"
                              title={course.title}
                            >
                              {course.title}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                              {course.totalLessons} lessons •{" "}
                              {course.enrolledCount} enrolled
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {course.category?.name || "Uncategorized"}
                      </td>
                      <td className="p-4 align-middle font-medium">
                        ${course.price}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={
                            course.status === "PUBLISHED"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {course.status}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground text-xs uppercase">
                        {course.level}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {new Date(course.createdAt).toLocaleDateString()}
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
                                href={`/dashboard/courses/update/${course.id}`}
                              >
                                Edit course
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 focus:bg-rose-600 focus:text-white"
                              onClick={() => handleDelete(course.id)}
                            >
                              Delete course
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

export default AllCourse;
