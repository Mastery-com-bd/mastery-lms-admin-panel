"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Loader2,
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
import { Badge } from "@/components/ui/badge";

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

const AllLesson = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });
  const [loading, setLoading] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sectionId, setSectionId] = useState<string>("all");
  const [isPreview, setIsPreview] = useState<string>("all");
  const [sortBy, setSortBy] = useState("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Sections for filter
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/section?limit=100`
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

  // Fetch Lessons
  const fetchLessons = useCallback(async () => {
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

      if (sectionId !== "all") {
        queryParams.append("sectionId", sectionId);
      }

      if (isPreview !== "all") {
        queryParams.append("isPreview", isPreview);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/lesson?${queryParams.toString()}`,
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch lessons");
      }

      const data = await response.json();
      if (data.success) {
        setLessons(data.data || []);
        setMeta(data.meta || { page: 1, limit: 10, total: 0 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load lessons");
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, debouncedSearch, sectionId, isPreview, sortBy, sortOrder]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

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

  const handleDelete = async (lessonId: string) => {
    try {
      showLoading("Deleting lesson...");
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/lesson/${lessonId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      toast.dismiss();
      showSuccess({ message: "Lesson deleted successfully" });
      fetchLessons(); // Refresh the lesson list
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

            <Select value={sectionId} onValueChange={setSectionId}>
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

            <Select value={isPreview} onValueChange={setIsPreview}>
              <SelectTrigger className="w-full md:w-[150px] bg-muted/30 border-none">
                <SelectValue placeholder="Preview Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Preview</SelectItem>
                <SelectItem value="false">Locked</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchLessons()}
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
                        <Badge variant={lesson.isPreview ? "default" : "secondary"}>
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
                              <Link href={`/dashboard/lesson/update/${lesson.id}`}>
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

export default AllLesson;
