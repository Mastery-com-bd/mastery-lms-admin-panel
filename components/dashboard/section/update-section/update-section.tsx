"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { showError, showLoading, showSuccess } from "@/lib/toast";
import { getAllCoursesWithoutLimit } from "@/service/course";
import { updateSection } from "@/service/sections";

const formSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  order: z.string().min(1, "Order must be a positive number"),
});

interface UpdateSectionProps {
  sectionId: string;
}

export default function UpdateSection({ sectionId }: UpdateSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      title: "",
      description: "",
      order: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Courses
        const coursesResponse = await getAllCoursesWithoutLimit();

        if (coursesResponse.success) {
          setCourses(coursesResponse.data || []);
        }

        // Fetch Section
        const sectionResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/section/${sectionId}`,
        );

        if (!sectionResponse.ok) {
          throw new Error("Failed to fetch section details");
        }

        const sectionData = await sectionResponse.json();
        const section = sectionData.data || sectionData;

        form.reset({
          courseId: section.courseId,
          title: section.title,
          description: section.description,
          order: String(section.order),
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        showError({ message: "Failed to load section data" });
      } finally {
        setIsLoading(false);
      }
    };

    if (sectionId) {
      fetchData();
    }
  }, [sectionId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    showLoading("Updating section...");

    try {
      const res = await updateSection({
        payload: {
          ...values,
          order: Number(values.order),
        },
        sectionId,
      });

      toast.dismiss();
      if (res.success) {
        showSuccess({
          message: res.message || "Section updated successfully",
        });
      } else {
        showError({
          message: res.message || "Failed to update section",
        });
      }

      router.push("/dashboard/sections"); // Adjust redirect path as needed
    } catch (error) {
      console.error(error);
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
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto p-0 my-10">
      <CardHeader>
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Update Section</CardTitle>
        </div>
        <CardDescription>Update existing section details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Introduction to JavaScript"
                      {...field}
                    />
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
                      placeholder="e.g. Basic concepts and setup"
                      className="resize-none"
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
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Section
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
