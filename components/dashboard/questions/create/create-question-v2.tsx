"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion, Reorder } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { showError, showLoading, showSuccess } from "@/lib/toast";

interface Lesson {
  id: string;
  title: string;
}

interface Quiz {
  id: string;
  title: string;
  lessonId: string;
}

interface AnswerOption {
  id: string;
  text: string;
}

interface QuestionItem {
  id: string;
  question: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  explanation?: string;
  points: number;
  order: number;
  options: AnswerOption[];
  correctOptionId: string;
}

const formSchema = z.object({
  lessonId: z.string().min(1, "Please select a lesson"),
  quizId: z.string().min(1, "Please select a quiz"),
  question: z.string().min(5, "Question must be at least 5 characters"),
  questionType: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE"]),
  explanation: z.string().optional(),
  points: z.string().min(1, "Points is required"),
  order: z.string().min(1, "Order is required"),
});

export default function CreateQuestionV2() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [options, setOptions] = useState<AnswerOption[]>([
    { id: "opt_1", text: "" },
    { id: "opt_2", text: "" },
    { id: "opt_3", text: "" },
    { id: "opt_4", text: "" },
  ]);
  const [correctOptionId, setCorrectOptionId] = useState<string>("");
  const [optionsError, setOptionsError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lessonId: "",
      quizId: "",
      question: "",
      questionType: "MULTIPLE_CHOICE",
      explanation: "",
      points: "",
      order: "1",
    },
  });

  const selectedLessonId = form.watch("lessonId");

  useEffect(() => {
    const fetchLessons = async () => {
      setLoadingLessons(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/lesson?limit=100`
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
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoadingQuizzes(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/quiz?limit=100`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await response.json();
        const items = Array.isArray(data) ? data : data.data || [];
        setQuizzes(items);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        toast.error("Failed to load quizzes");
      } finally {
        setLoadingQuizzes(false);
      }
    };
    fetchQuizzes();
  }, []);

  const filteredQuizzes = useMemo(() => {
    if (!selectedLessonId) return quizzes;
    return quizzes.filter((quiz) => quiz.lessonId === selectedLessonId);
  }, [quizzes, selectedLessonId]);

  const validateOptions = () => {
    if (options.some((opt) => !opt.text.trim())) {
      setOptionsError("All options are required");
      setActiveTab("questions");
      return false;
    }
    if (!correctOptionId) {
      setOptionsError("Please select the correct answer");
      setActiveTab("questions");
      return false;
    }
    setOptionsError(null);
    return true;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (questions.length === 0) {
      toast.error("Add at least one question");
      return;
    }
    setIsSubmitting(true);
    try {
      const questionPayload = questions.map((q) => ({
        quizId: values.quizId,
        question: q.question,
        questionType: q.questionType,
        explanation: q.explanation || "",
        points: q.points,
        order: q.order,
        options: q.options.map((opt) => ({
          text: opt.text,
          isCorrect: opt.id === q.correctOptionId,
        })),
      }));
      console.log(questionPayload);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleOptionsReorder = (newOptions: AnswerOption[]) => {
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (value: string) => {
    setCorrectOptionId(value);
    setOptionsError(null);
  };

  const handleQuestionReorder = (newQuestions: QuestionItem[]) => {
    const updated = newQuestions.map((q, index) => ({
      ...q,
      order: index + 1,
    }));
    setQuestions(updated);
  };

  const addQuestion = async () => {
    const isValidFields = await form.trigger([
      "question",
      "questionType",
      "points",
      "explanation",
    ]);
    if (!isValidFields || !validateOptions()) {
      return;
    }
    const values = form.getValues();
    const newOrder = questions.length + 1;
    const newQuestion: QuestionItem = {
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      question: values.question,
      questionType: values.questionType,
      explanation: values.explanation,
      points: Number(values.points),
      order: newOrder,
      options: options.map((opt) => ({ ...opt })),
      correctOptionId,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    form.setValue("order", (newOrder + 1).toString());
    form.setValue("question", "");
    form.setValue("explanation", "");
    form.setValue("questionType", "MULTIPLE_CHOICE");
    setOptions([
      { id: "opt_1", text: "" },
      { id: "opt_2", text: "" },
      { id: "opt_3", text: "" },
      { id: "opt_4", text: "" },
    ]);
    setCorrectOptionId("");
    setOptionsError(null);
    setActiveTab("questions");
  };

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
            type="button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Create New Question
            </h2>
            <p className="text-sm text-muted-foreground">
              Link a quiz, define question details, and add answer options
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            type="submit"
            form="create-question-form"
            className="flex-1 sm:flex-none gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Question
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          id="create-question-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-card border">
              <TabsTrigger value="info" className="gap-2">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="questions" className="gap-2">
                Question
                <Badge variant="secondary" className="ml-1">
                  4 options
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Question Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="lessonId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Lesson <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={loadingLessons}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a lesson" />
                                </SelectTrigger>
                                <SelectContent>
                                  {lessons.map((lesson) => (
                                    <SelectItem
                                      key={lesson.id}
                                      value={lesson.id}
                                    >
                                      {lesson.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quizId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Quiz <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={
                                  loadingQuizzes || filteredQuizzes.length === 0
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a quiz" />
                                </SelectTrigger>
                                <SelectContent>
                                  {filteredQuizzes.map((quiz) => (
                                    <SelectItem key={quiz.id} value={quiz.id}>
                                      {quiz.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Question{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter the question text"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="questionType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Question Type{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MULTIPLE_CHOICE">
                                    Multiple Choice
                                  </SelectItem>
                                  <SelectItem value="TRUE_FALSE">
                                    True / False
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="explanation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Explanation</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Optional explanation for the correct answer"
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scoring & Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="points"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Points{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                placeholder="Enter points for this question"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="order"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Order{" "}
                              <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                placeholder="1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="questions" className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Added questions: {questions.length}
                </p>
                <Button type="button" onClick={addQuestion}>
                  Add Question
                </Button>
              </div>

              {questions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Questions (drag to reorder)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Reorder.Group
                      axis="y"
                      values={questions}
                      onReorder={handleQuestionReorder}
                      className="space-y-3"
                    >
                      {questions.map((q) => (
                        <Reorder.Item
                          key={q.id}
                          value={q}
                          className="list-none"
                        >
                          <div className="p-3 rounded-lg border bg-card space-y-1">
                            <div className="text-xs text-muted-foreground">
                              Order {q.order}
                            </div>
                            <div className="font-medium truncate">
                              {q.question || "Untitled question"}
                            </div>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Answer Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Options (drag to reorder)</Label>
                    <RadioGroup
                      value={correctOptionId}
                      onValueChange={handleCorrectOptionChange}
                    >
                      <Reorder.Group
                        axis="y"
                        values={options}
                        onReorder={handleOptionsReorder}
                        className="space-y-3"
                      >
                        {options.map((option, index) => (
                          <Reorder.Item
                            key={option.id}
                            value={option}
                            className="list-none"
                          >
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                              <div className="flex items-center gap-2">
                                <RadioGroupItem
                                  value={option.id}
                                  id={option.id}
                                />
                              </div>
                              <div className="flex-1">
                                <Input
                                  placeholder={`Option ${index + 1}`}
                                  value={option.text}
                                  onChange={(e) => {
                                    const newText = e.target.value;
                                    setOptions((prev) =>
                                      prev.map((opt) =>
                                        opt.id === option.id
                                          ? { ...opt, text: newText }
                                          : opt
                                      )
                                    );
                                    setOptionsError(null);
                                  }}
                                />
                              </div>
                            </div>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </RadioGroup>
                  </div>

                  {optionsError && (
                    <p className="text-sm text-destructive flex items-center gap-2">
                      {optionsError}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </motion.div>
  );
}
