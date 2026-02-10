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
import { getAllCoursesWithoutLimit } from "@/service/course";
import { getAllLessons } from "@/service/lessons";
import { createQuiz } from "@/service/quiz";
import { getAllSections } from "@/service/sections";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  sectionId: z.string().optional(),
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

interface Section {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  title: string;
}

export function QuizEditor() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      sectionId: "",
      lessonId: "",
      title: "",
      description: "",
      type: "LESSON",
      passingScore: 70,
      timeLimit: 30,
    },
  });

  const selectedCourseId = form.watch("courseId");
  const selectedSectionId = form.watch("sectionId");

  useEffect(() => {
    // Fetch All Course
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
    // Fetch Sections when Course changes
    const fetchSections = async () => {
      if (!selectedCourseId) {
        setSections([]);
        form.setValue("sectionId", "");
        form.setValue("lessonId", "");
        return;
      }
      setLoadingSections(true);
      try {
        const response = await getAllSections({ courseId: selectedCourseId });
        const data = response?.data?.data || response?.data || [];
        setSections(Array.isArray(data) ? data : []);
        // Reset child selections
        form.setValue("sectionId", "");
        form.setValue("lessonId", "");
      } catch (error) {
        console.error("Failed to fetch sections:", error);
        toast.error("Failed to load sections");
      } finally {
        setLoadingSections(false);
      }
    };
    fetchSections();
  }, [selectedCourseId, form]);

  useEffect(() => {
    // Fetch Lessons when Section changes
    const fetchLessons = async () => {
      if (!selectedSectionId) {
        setLessons([]);
        form.setValue("lessonId", "");
        return;
      }
      setLoadingLessons(true);
      try {
        const response = await getAllLessons({ sectionId: selectedSectionId });
        const data = response?.data?.data || response?.data || [];
        setLessons(Array.isArray(data) ? data : []);
        // Reset child selection
        form.setValue("lessonId", "");
      } catch (error) {
        console.error("Failed to fetch lessons:", error);
        toast.error("Failed to load lessons");
      } finally {
        setLoadingLessons(false);
      }
    };
    fetchLessons();
  }, [selectedSectionId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    showLoading("Creating quiz...");

    try {
      const body = {
        lessonId: values.lessonId,
        courseId: values.courseId,
        title: values.title,
        description: values.description || "",
        type: values.type,
        passingScore: values.passingScore,
        timeLimit: values.timeLimit ?? 1,
      };

      const res = await createQuiz(body);
      toast.dismiss();

      if (res.success) {
        showSuccess({ message: res.message || "Quiz created successfully" });
        router.push("/dashboard/quiz");
        form.reset({
          courseId: "",
          lessonId: "",
          title: "",
          description: "",
          type: "LESSON",
          passingScore: 70,
          timeLimit: null,
        });
      } else {
        showError({ message: res.message || "Failed to create quiz" });
      }
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

  return (
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
            <h2 className="text-2xl font-bold text-foreground">
              Create New Quiz
            </h2>
            <p className="text-sm text-muted-foreground">
              Set up quiz details and add questions
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
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            <Send className="w-4 h-4" />
            Publish
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

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="courseId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Assign to Course{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("sectionId", "");
                            form.setValue("lessonId", "");
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  loadingCourses
                                    ? "Loading courses..."
                                    : "Select a course"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sectionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Filter by Section <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("lessonId", "");
                          }}
                          defaultValue={field.value}
                          disabled={!selectedCourseId || loadingSections || (!loadingSections && sections.length === 0)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !selectedCourseId
                                    ? "Select a course first"
                                    : loadingSections
                                      ? "Loading sections..."
                                      : sections.length === 0
                                        ? "No section available"
                                        : "Select a section"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sections.length > 0 ? (
                              sections.map((section) => (
                                <SelectItem key={section.id} value={section.id}>
                                  {section.title}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-sections" disabled>
                                No sections found
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
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
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedSectionId || loadingLessons || (!loadingLessons && lessons.length === 0)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  !selectedSectionId
                                    ? "Select a section first"
                                    : loadingLessons
                                      ? "Loading lessons..."
                                      : lessons.length === 0
                                        ? "No lesson available"
                                        : "Select a lesson"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {lessons.length > 0 ? (
                              lessons.map((lesson) => (
                                <SelectItem key={lesson.id} value={lesson.id}>
                                  {lesson.title}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-lessons" disabled>
                                No lessons found
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
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
