"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AdminQuiz,
  AdminQuizQuestion,
  generateQuizId,
  mockCourses,
} from "@/constants/adminQuizMockData";
import {
  AlertCircle,
  ArrowLeft,
  FileText,
  Save,
  Send,
  Settings,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { QuestionBuilder } from "./QuestionBuilder";
// import { QuestionBuilder } from "./QuestionBuilder";

interface QuizEditorProps {
  quiz?: AdminQuiz | null;
}

interface ValidationErrors {
  title?: string;
  courseId?: string;
  questions?: string;
}

export function QuizEditor({ quiz }: QuizEditorProps) {
  const isEditing = !!quiz;

  // Form state
  const [title, setTitle] = useState(quiz?.title || "");
  const [description, setDescription] = useState(quiz?.description || "");
  const [courseId, setCourseId] = useState(quiz?.courseId || "");
  const [timeLimit, setTimeLimit] = useState<number | null>(
    quiz?.timeLimit ?? null
  );
  const [passingScore, setPassingScore] = useState(quiz?.passingScore || 70);
  const [shuffleQuestions, setShuffleQuestions] = useState(
    quiz?.shuffleQuestions || false
  );
  const [questions, setQuestions] = useState<AdminQuizQuestion[]>(
    quiz?.questions || []
  );
  const [activeTab, setActiveTab] = useState("info");
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Derived state
  const selectedCourse = mockCourses.find((c) => c.id === courseId);
  const validQuestions = questions.filter(
    (q) =>
      q.questionText.trim() !== "" &&
      q.options.every((opt) => opt.text.trim() !== "") &&
      q.correctOptionId !== ""
  );

  // Validation
  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!title.trim()) {
      newErrors.title = "Quiz title is required";
    }

    if (!courseId) {
      newErrors.courseId = "Please select a course";
    }

    if (validQuestions.length === 0) {
      newErrors.questions = "At least one valid question is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canPublish = title.trim() && courseId && validQuestions.length > 0;

  const handleSave = (status: "draft" | "published") => {
    if (status === "published" && !validate()) {
      toast.error("Please fix validation errors before publishing");
      return;
    }

    if (status === "draft" && !title.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    const now = new Date().toISOString();
    const quizData: AdminQuiz = {
      id: quiz?.id || generateQuizId(),
      title: title.trim(),
      description: description.trim(),
      courseId,
      courseName: selectedCourse?.title || "",
      timeLimit,
      passingScore,
      shuffleQuestions,
      status,
      questions: validQuestions,
      createdAt: quiz?.createdAt || now,
      updatedAt: now,
    };

    console.log(quizData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
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
              {isEditing ? "Edit Quiz" : "Create New Quiz"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Update quiz information and questions"
                : "Set up quiz details and add questions"}
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            className="flex-1 sm:flex-none gap-2"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave("published")}
            disabled={!canPublish}
            className="flex-1 sm:flex-none gap-2"
          >
            <Send className="w-4 h-4" />
            Publish
          </Button>
        </div>
      </div>

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-destructive">
                  Please fix the following errors:
                </p>
                <ul className="text-sm text-destructive/80 list-disc list-inside">
                  {errors.title && <li>{errors.title}</li>}
                  {errors.courseId && <li>{errors.courseId}</li>}
                  {errors.questions && <li>{errors.questions}</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-card border">
          <TabsTrigger value="info" className="gap-2">
            <FileText className="w-4 h-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="questions" className="gap-2">
            <Settings className="w-4 h-4" />
            Questions
            {questions.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {validQuestions.length}/{questions.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="info" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Quiz Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter quiz title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        if (errors.title)
                          setErrors((prev) => ({ ...prev, title: undefined }));
                      }}
                      className={errors.title ? "border-destructive" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter quiz description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Assign to Course{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={courseId}
                      onValueChange={(value) => {
                        setCourseId(value);
                        if (errors.courseId)
                          setErrors((prev) => ({
                            ...prev,
                            courseId: undefined,
                          }));
                      }}
                    >
                      <SelectTrigger
                        className={errors.courseId ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCourses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            <div className="flex items-center gap-2">
                              <span>{course.title}</span>
                              <Badge variant="outline" className="text-xs">
                                {course.category}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.courseId && (
                      <p className="text-sm text-destructive">
                        {errors.courseId}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      placeholder="No limit"
                      value={timeLimit ?? ""}
                      onChange={(e) =>
                        setTimeLimit(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      min={1}
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty for no time limit
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passingScore">Passing Score (%)</Label>
                    <Input
                      id="passingScore"
                      type="number"
                      value={passingScore}
                      onChange={(e) => setPassingScore(Number(e.target.value))}
                      min={0}
                      max={100}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <Label htmlFor="shuffle">Shuffle Questions</Label>
                      <p className="text-xs text-muted-foreground">
                        Randomize question order
                      </p>
                    </div>
                    <Switch
                      id="shuffle"
                      checked={shuffleQuestions}
                      onCheckedChange={setShuffleQuestions}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quiz Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total Questions
                    </span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Valid Questions
                    </span>
                    <span className="font-medium text-success">
                      {validQuestions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Limit</span>
                    <span className="font-medium">
                      {timeLimit ? `${timeLimit} min` : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pass Score</span>
                    <span className="font-medium">{passingScore}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="mt-6">
          <QuestionBuilder questions={questions} onChange={setQuestions} />
          {errors.questions && (
            <p className="text-sm text-destructive mt-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errors.questions}
            </p>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
