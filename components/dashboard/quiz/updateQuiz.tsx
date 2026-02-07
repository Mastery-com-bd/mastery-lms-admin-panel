"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { showError, showLoading, showSuccess } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useParams, useRouter } from "next/navigation";
import { getAllCoursesWithoutLimit } from "@/service/course";
import { updateQuiz } from "@/service/quiz";

const formSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  lessonId: z.string().min(1, "Please select a lesson"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["LESSON", "COURSE"]),
  passingScore: z.number().min(0).max(100),
  timeLimit: z.number().min(1).nullable().optional(),
});

interface Course {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  title: string;
}

export default function UpdateQuiz({ quizId }: { quizId?: string }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      lessonId: "",
      title: "",
      description: "",
      type: "LESSON",
      passingScore: 70,
      timeLimit: 30,
    },
  });

  const selectedCourseId = form.watch("courseId");
  const selectedLessonId = form.watch("lessonId");
  const params = useParams() as Record<string, string>;
  const effectiveQuizId = useMemo(
    () => quizId ?? params?.quizId ?? params?.id,
    [quizId, params],
  );

  useEffect(() => {

    // Fetch Course
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const response = await getAllCoursesWithoutLimit();
        if (response.success) {
          setCourses(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!effectiveQuizId) return;
      setLoadingQuiz(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/quiz/${effectiveQuizId}`,
          { cache: "no-store" },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quiz");
        }
        const resData = await response.json();
        const quiz = resData.data || resData;
        form.reset({
          courseId: quiz.courseId || "",
          lessonId: quiz.lessonId || "",
          title: quiz.title || "",
          description: quiz.description || "",
          type: quiz.type || "LESSON",
          passingScore: Number(quiz.passingScore ?? 70),
          timeLimit:
            quiz.timeLimit === null || quiz.timeLimit === undefined
              ? null
              : Number(quiz.timeLimit),
        });
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        toast.error("Failed to load quiz data");
      } finally {
        setLoadingQuiz(false);
      }
    };
    fetchQuiz();
  }, [effectiveQuizId, quizId, form]);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedCourseId) {
        setLessons([]);
        return;
      }
      setLoadingLessons(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/lesson?courseId=${selectedCourseId}&limit=100`,
        );
        if (response.ok) {
          const data = await response.json();
          setLessons(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        toast.error("Failed to load lessons");
      } finally {
        setLoadingLessons(false);
      }
    };
    fetchLessons();
  }, [selectedCourseId]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    showLoading("Updating quiz...");

    try {
      const body = {
        lessonId: values.lessonId,
        courseId: values.courseId,
        title: values.title,
        description: values.description || "",
        type: values.type,
        passingScore: values.passingScore,
        timeLimit: values.timeLimit ?? null,
      };

      const res = await updateQuiz(effectiveQuizId, body);

      if (!res.success) {
        console.log(res);
        throw new Error(res.message || "Failed to update quiz");
      }

      toast.dismiss();
      router.push("/dashboard/quiz");
      showSuccess({ message: "Quiz updated successfully" });
    } catch (error) {
      console.error(error);
      toast.dismiss();
      showError({
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return loadingQuiz ||
    loadingCourses ||
    (selectedCourseId && loadingLessons) ? (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ) : (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Update Quiz</h2>
            <p className="text-sm text-muted-foreground">
              Edit quiz details and settings
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="outline"
            className="flex-1 sm:flex-none gap-2"
            disabled
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            form="quiz-form"
            className="flex-1 sm:flex-none gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Update
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          id="quiz-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Quiz Title <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter quiz title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter quiz description"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Assign to Course{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <>
                            <input type="hidden" {...field} />
                            <Input
                              value={
                                courses.find(
                                  (course) => course.id === selectedCourseId,
                                )?.title || ""
                              }
                              disabled
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lessonId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Lesson <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <>
                            <input type="hidden" {...field} />
                            <Input
                              value={
                                lessons.find(
                                  (lesson) => lesson.id === selectedLessonId,
                                )?.title || ""
                              }
                              disabled
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quiz Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quiz type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LESSON">Lesson Quiz</SelectItem>
                          <SelectItem value="COURSE">Course Quiz</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Limit (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="No limit"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : null,
                            )
                          }
                          min={1}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Leave empty for no time limit
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passing Score (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : 0,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
