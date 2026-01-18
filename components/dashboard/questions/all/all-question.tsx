"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { showError, showLoading, showSuccess } from "@/lib/toast";
import { toast } from "sonner";

interface QuizSummary {
  id: string;
  title: string;
}

interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  questionType: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
  order: number;
  quiz?: QuizSummary;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

const AllQuestion = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const [sortBy, setSortBy] = useState("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Fetch all questions on component load
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/quiz-question?limit=100`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await response.json();
        setQuestions(data.data || []);
      } catch (error) {
        console.log("Failed to fetch quizzes:", error);
      }
    };
    fetchQuizzes();
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", meta.page.toString());
      params.set("limit", meta.limit.toString());
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      if (searchTerm) {
        params.set("searchTerm", searchTerm);
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/quiz-question?${params.toString()}`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch quiz questions");
      }
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data || []);
        setMeta({
          page: data.meta?.page ?? meta.page,
          limit: data.meta?.limit ?? meta.limit,
          total: data.meta?.total ?? 0,
          totalPages: data.meta?.totalPages ?? 0,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, sortBy, sortOrder, searchTerm]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const handleQuestionDelete = async (questionId: string) => {
    try {
      showLoading("Deleting question...");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/quiz-question/${questionId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete question");
      }
      const data = await response.json();
      if (data.success) {
        setQuestions((prev) =>
          prev.filter((question) => question.id !== questionId)
        );
        toast.dismiss();
        showSuccess({ message: "Question deleted successfully" });
      }
    } catch (error) {
      console.log("Failed to delete question:", error);
      toast.dismiss();
      showError({ message: "Failed to delete question" });
    }
  };

  const totalPages =
    meta.totalPages && meta.totalPages > 0
      ? meta.totalPages
      : Math.ceil(meta.total / meta.limit || 1);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          All Quiz Questions
        </h1>
        <Button asChild className="bg-primary text-primary-foreground">
          <Link href="/dashboard/questions/create">Create Question</Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search question or explanation"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer">
                    <div className="flex items-center gap-1">Order</div>
                  </th>
                 
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer">
                    <div className="flex items-center gap-1">Question</div>
                  </th>

                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer">
                    <div className="flex items-center gap-1">Points</div>
                  </th>
                   <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Quiz
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {questions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No questions found.
                    </td>
                  </tr>
                ) : (
                  questions.map((q, idx) => (
                    <tr
                      key={idx}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">{idx + 1}</td>

                      <td className="p-4 align-middle">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium line-clamp-2 truncate max-w-75">
                            {q.question || "No question provided"}
                          </span>
                          <Badge variant="default">
                            {String.fromCharCode(65 + q.correctAnswer)}.{" "}
                            {q.options[q.correctAnswer]}
                          </Badge>
                        </div>
                      </td>
                      
                      <td className="p-4 align-middle">{q.points}</td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium truncate max-w-75">
                            {q.quiz?.title || "Untitled quiz"}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-75">
                            {q.explanation || "No explanation provided"}
                          </span>
                        </div>
                      </td>
                      <tr>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon">
                              <Link
                                href={`/dashboard/questions/update/${q.id}`}
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the question.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleQuestionDelete(q.id)}
                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                  >
                                    Confirm
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t text-xs sm:text-sm gap-3 flex-col sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Page {meta.page} of {totalPages || 1}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AllQuestion;
