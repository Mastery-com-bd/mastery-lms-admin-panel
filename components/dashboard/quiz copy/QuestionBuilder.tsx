import { useState } from "react";
import { motion, AnimatePresence, Reorder } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
import {
  Plus,
  Trash2,
  GripVertical,
  AlertCircle,
  Check,
} from "lucide-react";
import { AdminQuizQuestion, generateQuestionId, generateOptionId } from "@/constants/adminQuizMockData";

interface QuestionBuilderProps {
  questions: AdminQuizQuestion[];
  onChange: (questions: AdminQuizQuestion[]) => void;
}

export function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const addNewQuestion = () => {
    const newQuestion: AdminQuizQuestion = {
      id: generateQuestionId(),
      questionText: "",
      options: [
        { id: generateOptionId(), text: "" },
        { id: generateOptionId(), text: "" },
        { id: generateOptionId(), text: "" },
        { id: generateOptionId(), text: "" },
      ],
      correctOptionId: "",
    };
    onChange([...questions, newQuestion]);
    setEditingQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, updates: Partial<AdminQuizQuestion>) => {
    onChange(
      questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    );
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    onChange(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) =>
                opt.id === optionId ? { ...opt, text } : opt
              ),
            }
          : q
      )
    );
  };

  const handleDeleteClick = (questionId: string) => {
    setQuestionToDelete(questionId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (questionToDelete) {
      onChange(questions.filter((q) => q.id !== questionToDelete));
      if (editingQuestion === questionToDelete) {
        setEditingQuestion(null);
      }
      setQuestionToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const isQuestionValid = (question: AdminQuizQuestion) => {
    return (
      question.questionText.trim() !== "" &&
      question.options.every((opt) => opt.text.trim() !== "") &&
      question.correctOptionId !== ""
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Questions</h3>
          <p className="text-sm text-muted-foreground">
            Add and manage quiz questions. Drag to reorder.
          </p>
        </div>
        <Button onClick={addNewQuestion} variant="outline" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Question
        </Button>
      </div>

      {questions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center mb-4">
              No questions added yet. Add at least one question to save the quiz.
            </p>
            <Button onClick={addNewQuestion} className="gap-2">
              <Plus className="w-4 h-4" />
              Add First Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Reorder.Group
          axis="y"
          values={questions}
          onReorder={onChange}
          className="space-y-3"
        >
          <AnimatePresence>
            {questions.map((question, index) => (
              <Reorder.Item
                key={question.id}
                value={question}
                className="list-none"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className={`border transition-colors ${
                      editingQuestion === question.id
                        ? "border-primary shadow-md"
                        : isQuestionValid(question)
                        ? "border-border"
                        : "border-warning/50"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="cursor-grab active:cursor-grabbing">
                          <GripVertical className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            {index + 1}
                          </span>
                          <CardTitle className="text-base font-medium flex-1">
                            {question.questionText || (
                              <span className="text-muted-foreground italic">
                                Untitled question
                              </span>
                            )}
                          </CardTitle>
                          {isQuestionValid(question) && (
                            <div className="flex items-center gap-1 text-success text-sm">
                              <Check className="w-4 h-4" />
                              <span>Valid</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setEditingQuestion(
                                editingQuestion === question.id ? null : question.id
                              )
                            }
                          >
                            {editingQuestion === question.id ? "Collapse" : "Edit"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteClick(question.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <AnimatePresence>
                      {editingQuestion === question.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CardContent className="space-y-4 pt-0">
                            <div className="space-y-2">
                              <Label>Question Text</Label>
                              <Textarea
                                placeholder="Enter your question..."
                                value={question.questionText}
                                onChange={(e) =>
                                  updateQuestion(question.id, {
                                    questionText: e.target.value,
                                  })
                                }
                                rows={2}
                              />
                            </div>

                            <div className="space-y-3">
                              <Label>Answer Options</Label>
                              <RadioGroup
                                value={question.correctOptionId}
                                onValueChange={(value) =>
                                  updateQuestion(question.id, {
                                    correctOptionId: value,
                                  })
                                }
                              >
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={option.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                      question.correctOptionId === option.id
                                        ? "border-success bg-success/5"
                                        : "border-border"
                                    }`}
                                  >
                                    <RadioGroupItem
                                      value={option.id}
                                      id={option.id}
                                      className="border-muted-foreground"
                                    />
                                    <span className="text-sm font-medium text-muted-foreground w-6">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    <Input
                                      placeholder={`Option ${String.fromCharCode(
                                        65 + optIndex
                                      )}`}
                                      value={option.text}
                                      onChange={(e) =>
                                        updateOption(
                                          question.id,
                                          option.id,
                                          e.target.value
                                        )
                                      }
                                      className="flex-1"
                                    />
                                    {question.correctOptionId === option.id && (
                                      <span className="text-xs text-success font-medium px-2 py-1 bg-success/10 rounded">
                                        Correct
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </RadioGroup>
                              <p className="text-xs text-muted-foreground">
                                Click the radio button to mark the correct answer
                              </p>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
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
