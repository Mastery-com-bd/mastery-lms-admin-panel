"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showError, showLoading, showSuccess } from "@/lib/toast";
import { ArrowUpDown, BookOpen, MoreHorizontal, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

export type ChangeInput =
  | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  | { name: string; value: string };

const AllCourse = ({ courses, meta }: { courses: Course[]; meta: Meta }) => {
  // Filters
  const [status, setStatus] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  
  const handleChange = (input: ChangeInput) => {
    const name = "target" in input ? input.target.name : input.name;
    const value = "target" in input ? input.target.value : input.value;
    const params = new URLSearchParams(searchParams.toString());

    if (name === "status" && value === "all") {
      params.delete(name);
    } else if (name === "level" && value === "all") {
      params.delete(name);
    } else if (name === "status") {
      params.set(name, value);
    } else if (name === "level") {
      params.set(name, value);
    } else if (name === "searchTerm") {
      params.set(name, value);
    } else {
      params.set(name, value);
    }
    router.push(`${pathName}?${params.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    handleChange({ name: "searchTerm", value: debouncedSearch });

  }, [debouncedSearch]);


  const handleReset = () => {
    router.push(`${pathName}`);
    setSearchTerm("");
    setStatus("all");
    setLevel("all");
  };

  const handleDelete = async (courseId: string) => {
    try {
      showLoading("Deleting course...");
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${courseId}`, {
        method: "DELETE",
        credentials: "include",
      });

      toast.dismiss();
      showSuccess({ message: "Course deleted successfully" });
    } catch (error) {
      console.error(error);
      showError({ message: "Failed to delete course" });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">All Courses</h1>
        <Button>
          <Link href="/dashboard/courses/create">
          Create New Course
          </Link>
        </Button>
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
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>

            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                handleChange({ name: "status", value });
              }}
            >
              <SelectTrigger className="w-full md:w-37.5 bg-muted/30 border-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={level}
              onValueChange={(value) => {
                setLevel(value);
                handleChange({ name: "level", value });
              }}
            >
              <SelectTrigger
                name="level"
                className="w-full md:w-37.5 bg-muted/30 border-none"
              >
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

          {/* <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchCourses()}
              disabled={loading}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div> */}
        </div>

        {/* Table */}
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer">
                  <div className="flex items-center gap-1">
                    Course
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Category
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer">
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
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer">
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
              {courses?.length === 0 ? (
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
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/courses/details/${course.id}`}
                            >
                              View details
                            </Link>
                          </DropdownMenuItem>
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
        </div>

        {/* Pagination */}
        {/* <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-t">
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
        </div> */}
      </Card>
    </div>
  );
};

export default AllCourse;
