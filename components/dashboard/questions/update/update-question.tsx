"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { showError, showLoading, showSuccess } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { getQuestionDetailsById, updateQuestion } from "@/service/questions";

const formSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters"),
  option0: z.string().min(1, "Option A is required"),
  option1: z.string().min(1, "Option B is required"),
  option2: z.string().min(1, "Option C is required"),
  option3: z.string().min(1, "Option D is required"),
  correctAnswer: z.string().min(1, "Please select the correct answer"),
  explanation: z.string().optional(),
  points: z.string().min(1, "Points is required"),
});

interface QuizInfo {
  id: string;
  title: string;
  courseTitle?: string;
}

interface QuizQuestionResponse {
  id: string;
  quizId: string;
  question: string;
  questionType: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
  order: number;
  quiz?: {
    id: string;
    title: string;
    course?: {
      id: string;
      title: string;
    };
  };
}

interface UpdateQuestionProps {
  questionId: string;
}

const UpdateQuestion = ({ questionId }: UpdateQuestionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      option0: "",
      option1: "",
      option2: "",
      option3: "",
      correctAnswer: "",
      explanation: "",
      points: "5",
    },
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      try {
        const response = await getQuestionDetailsById(questionId);
        console.log("Question Data :", response);

        if (!response.success) {
          throw new Error("Failed to fetch question details");
        }

        const questionData: QuizQuestionResponse = response.data || response;

        const options = questionData.options || [];

        form.reset({
          question: questionData.question,
          option0: options[0] || "",
          option1: options[1] || "",
          option2: options[2] || "",
          option3: options[3] || "",
          correctAnswer: String(
            typeof questionData.correctAnswer === "number"
              ? questionData.correctAnswer
              : 0,
          ),
          explanation: questionData.explanation || "",
          points: String(questionData.points ?? 5),
        });

        if (questionData.quiz) {
          setQuizInfo({
            id: questionData.quiz.id,
            title: questionData.quiz.title,
            courseTitle: questionData.quiz.course?.title,
          });
        }
      } catch (error) {
        console.error("Failed to fetch question:", error);
        showError({ message: "Failed to load question data" });
      } finally {
        setIsLoading(false);
      }
    };

    if (questionId) {
      fetchQuestion();
    }
  }, [questionId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const options = [
      values.option0,
      values.option1,
      values.option2,
      values.option3,
    ];

    const correctAnswerIndex = Number(values.correctAnswer);

    if (
      Number.isNaN(correctAnswerIndex) ||
      correctAnswerIndex < 0 ||
      correctAnswerIndex > 3
    ) {
      showError({ message: "Please select a valid correct answer" });
      return;
    }

    setIsSubmitting(true);
    showLoading("Updating question...");

    try {
      const body = {
        question: values.question,
        options,
        correctAnswer: correctAnswerIndex,
        explanation: values.explanation || "",
        points: Number(values.points),
      };

      const res = await updateQuestion({
        payload: body,
        questionId,
      });

      if (res.success) {
        toast.dismiss();
        router.push(`/dashboard/questions`);
        showSuccess({
          message: res?.message || "Question updated successfully",
        });
      } else {
        toast.dismiss();
        showError({
          message: res?.message || "Failed to update question",
        });
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              Update Question
            </h2>
            {quizInfo && (
              <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                <span>Quiz:</span>
                <span className="font-medium">{quizInfo.title}</span>
                {quizInfo.courseTitle && (
                  <Badge variant="outline">{quizInfo.courseTitle}</Badge>
                )}
              </p>
            )}
          </div>
        </div>
        
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="update-question-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Enter the question text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Options</FormLabel>
                  <Badge variant="secondary">Multiple choice</Badge>
                </div>

                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="option0"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option A</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter option A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="option1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option B</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter option B" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="option2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option C</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter option C" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="option3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Option D</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter option D" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="correctAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Answer</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="0" id="opt-a" />
                          <Label htmlFor="opt-a">Option A</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="opt-b" />
                          <Label htmlFor="opt-b">Option B</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2" id="opt-c" />
                          <Label htmlFor="opt-c">Option C</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3" id="opt-d" />
                          <Label htmlFor="opt-d">Option D</Label>
                        </div>
                      </RadioGroup>
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
                        rows={3}
                        placeholder="Optional explanation for the correct answer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem className="max-w-[200px]">
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateQuestion;
