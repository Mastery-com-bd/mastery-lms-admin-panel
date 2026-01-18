"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { motion, Reorder } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";



interface Quiz {
  id: string;
  title: string;
  lessonId: string;
}

interface AnswerOption {
  id: string;
  text: string;
}

const formSchema = z.object({
  quizId: z.string().min(1, "Please select a quiz"),
  question: z.string().min(5, "Question must be at least 5 characters"),
  questionType: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE"]),
  explanation: z.string().optional(),
  points: z.string().min(1, "Points is required"),
  order: z.string().min(1, "Order is required"),
});

export default function CreateQuestion() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [quizSearchTerm, setQuizSearchTerm] = useState("");
  const [options, setOptions] = useState<AnswerOption[]>([
    { id: "opt_1", text: "" },
    { id: "opt_2", text: "" },
    { id: "opt_3", text: "" },
    { id: "opt_4", text: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizId: "",
      question: "",
      questionType: "MULTIPLE_CHOICE",
      explanation: "",
      points: "5",
      order: "1",
    },
  });

  const currentOrder = form.watch("order");

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoadingQuizzes(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", "100");
        if (quizSearchTerm.trim()) {
          params.set("searchTerm", quizSearchTerm.trim());
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/quiz?${params.toString()}`,
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
        console.log("Failed to fetch quizzes:", error);
        toast.error("Failed to load quizzes");
      } finally {
        setLoadingQuizzes(false);
      }
    };
    fetchQuizzes();
  }, [quizSearchTerm]);

  const validateOptions = () => {
    if (options.some((opt) => !opt.text.trim())) {
      setOptionsError("All options are required");
      setActiveTab("questions");
      return false;
    }
    if (correctAnswer === null) {
      setOptionsError("Please select the correct answer");
      setActiveTab("questions");
      return false;
    }
    setOptionsError(null);
    return true;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!validateOptions()) return;

    setIsSubmitting(true);
    showLoading("Creating question...");

    try {
      const body = {
        quizId: values.quizId,
        question: values.question,
        questionType: values.questionType,
        explanation: values.explanation || "",
        points: Number(values.points),
        order: Number(values.order),
        options: options.map((opt) => opt.text),
        correctAnswer: correctAnswer ?? 0,
      };

      console.log("Submission body:", body);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/quiz-question`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message || "Failed to create question");
      }

      toast.dismiss();
      showSuccess({
        message: "Question created successfully",
      });

      const nextOrder = (Number(values.order) || 0) + 1;

      form.reset({
        quizId: values.quizId,
        question: "",
        questionType: "MULTIPLE_CHOICE",
        explanation: "",
        points: values.points,
        order: nextOrder.toString(),
      });
      setOptions([
        { id: "opt_1", text: "" },
        { id: "opt_2", text: "" },
        { id: "opt_3", text: "" },
        { id: "opt_4", text: "" },
      ]);
      setCorrectAnswer(null);
      setActiveTab("info");
    } catch (error) {
      console.log(error);
      toast.dismiss();
      showError({
        message:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleOptionsReorder = (newOptions: AnswerOption[]) => {
    if (correctAnswer !== null) {
      const prevId = options[correctAnswer]?.id;
      if (prevId) {
        const newIndex = newOptions.findIndex((opt) => opt.id === prevId);
        if (newIndex >= 0) {
          setCorrectAnswer(newIndex);
          form.setValue("order", (newIndex + 1).toString());
        } else {
          setCorrectAnswer(null);
        }
      }
    }
    setOptions(newOptions);
  };

  const handleCorrectOptionChange = (value: string) => {
    setOptionsError(null);
    const index = Number(value);
    if (Number.isNaN(index)) {
      if (!currentOrder) {
        form.setValue("order", "1");
      }
      setCorrectAnswer(null);
      return;
    }
    setCorrectAnswer(index);
    form.setValue("order", (index + 1).toString());
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
                        name="quizId"
                        render={({ field }) => (
                          <FormItem className="flex max-w-[300px] flex-col">
                            <FormLabel>
                              Quiz <span className="text-destructive">*</span>
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild className="">
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                      "w-full justify-between",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    disabled={loadingQuizzes}
                                  >
                                    {field.value
                                      ? quizzes.find(
                                          (quiz) => quiz.id === field.value
                                        )?.title
                                      : "Select a quiz"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-0">
                                <Command>
                                  <CommandInput
                                    placeholder="Search quiz..."
                                    value={quizSearchTerm}
                                    onValueChange={setQuizSearchTerm}
                                  />
                                  <CommandEmpty>No quiz found.</CommandEmpty>
                                  <CommandGroup>
                                    {quizzes.map((quiz) => (
                                      <CommandItem
                                        value={quiz.title}
                                        key={quiz.id}
                                        onSelect={() => {
                                          form.setValue("quizId", quiz.id);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            quiz.id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {quiz.title}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
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
                              Points <span className="text-destructive">*</span>
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
                              Order <span className="text-destructive">*</span>
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
              <Card>
                <CardHeader>
                  <CardTitle>Answer Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Options (drag to reorder)</Label>
                    <RadioGroup
                      value={
                        correctAnswer !== null ? String(correctAnswer) : ""
                      }
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
                                  value={String(index)}
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
