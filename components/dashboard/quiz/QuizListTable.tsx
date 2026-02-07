"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showError, showLoading, showSuccess } from "@/lib/toast";
import { getAllCoursesWithoutLimit } from "@/service/course";
import { deleteQuiz } from "@/service/quiz";
import { format } from "date-fns";
import {
  FileText,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface Quiz {
  id: string;
  title: string;
  description: string;
  courseId: string;
  lessonId: string;
  type: string;
  passingScore: number;
  timeLimit: number | null;
  questions?: unknown[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // courseName might not be in API, we can derive it or it might be there
  courseName?: string;
}

interface Course {
  id: string;
  title: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface QuizListTableProps {
  quizzes: Quiz[];
  meta?: Meta;
}

export function QuizListTable({ quizzes, meta }: QuizListTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);

  // Derived state from URL search params
  const statusFilter = searchParams.get("isActive") || "all";
  const courseFilter = searchParams.get("courseId") || "all";
  const searchTermParam = searchParams.get("searchTerm") || "";

  // Local state for search input to allow typing
  const [searchTerm, setSearchTerm] = useState(searchTermParam);

  // Debounce search update
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

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Course for filter options
  const fetchCourses = useCallback(async () => {
    try {
      const response = await getAllCoursesWithoutLimit();
      if (response.success) {
        setCourses(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDeleteClick = (quizId: string) => {
    setQuizToDelete(quizId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!quizToDelete) return;

    showLoading("Deleting quiz...");

    try {
      const res = await deleteQuiz(quizToDelete);

      if (res.success) {
        toast.dismiss();
        router.refresh();
        showSuccess({ message: res.message || "Quiz deleted successfully" });
      } else {
        throw new Error(res.message || "Failed to delete quiz");
      }

      setDeleteDialogOpen(false);
      setQuizToDelete(null);
    } catch (error) {
      toast.dismiss();
      router.refresh();
      showError({
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const onCreateNew = () => {
    router.push("/dashboard/quiz/create");
  };

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 flex-wrap">
          <div className="relative flex-1 min-w-50 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => handleFilterChange("isActive", value)}
          >
            <SelectTrigger className="w-35">
              <SelectValue placeholder="Active Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="false">Draft</SelectItem>
              <SelectItem value="true">Published</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={courseFilter}
            onValueChange={(value) => handleFilterChange("courseId", value)}
          >
            <SelectTrigger className="w-45">
              <SelectValue placeholder="Course" />
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
        <Button onClick={onCreateNew} className="gap-2">
          <Link
            href={"/dashboard/quiz/create"}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Quiz
          </Link>
        </Button>
      </div>

      {/* Quiz Table */}
      <div className="border border-border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quiz Title</TableHead>
              <TableHead>Assigned Course</TableHead>
              <TableHead className="text-center">Questions</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <FileText className="w-12 h-12 opacity-50" />
                    <p>No quizzes found</p>
                    <Button variant="outline" size="sm" onClick={onCreateNew}>
                      Create your first quiz
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              quizzes.map((quiz, idx) => (
                <TableRow key={quiz.id || idx}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {quiz.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {quiz.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {quiz.courseName ||
                        courses.find((c) => c.id === quiz.courseId)?.title ||
                        "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium">
                      {(quiz.questions || []).length}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={quiz.isActive ? "default" : "secondary"}
                      className={
                        quiz.isActive
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-warning/20 text-warning border-warning/30"
                      }
                    >
                      {quiz.isActive ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {quiz.updatedAt
                        ? format(new Date(quiz.updatedAt), "MMM d, yyyy")
                        : "-"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/quiz/update/${quiz.id}`}
                            className="flex items-center cursor-pointer"
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(quiz.id)}
                          className="text-destructive focus:text-destructive cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {meta?.totalPage && meta?.totalPage > 1 && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(meta.page - 1)}
            disabled={meta.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPage}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(meta.page + 1)}
            disabled={meta.page === meta.totalPage}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quiz? This action cannot be
              undone. All questions associated with this quiz will also be
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
