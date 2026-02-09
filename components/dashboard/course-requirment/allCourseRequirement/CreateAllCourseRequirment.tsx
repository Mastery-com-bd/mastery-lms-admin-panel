/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TCourse } from "@/types/course.types";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCourseRequirment,
  updateCourseRequirment,
} from "@/service/courseRequirment";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { TCourseLearningData } from "@/types/courseLearning.types";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const formSchema = z.object({
  courseId: z.string({
    message: "course is required",
  }),
  content: z
    .string({
      message: "description is required",
    })
    .min(10, {
      message: "Description must be at least 10 characters.",
    }),
  order: z
    .string({
      message: "order is required.",
    })
    .min(1, {
      message: "order must be included",
    }),
  isActive: z.boolean().optional(),
});

export type TCourseRequirment = z.infer<typeof formSchema>;

const CreateAllCourseRequirment = ({
  course,
  courseRequirment,
}: {
  course: TCourse[];
  courseRequirment?: TCourseLearningData;
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: courseRequirment?.course?.id ?? undefined,
      content: courseRequirment?.content ?? undefined,
      order: courseRequirment?.order.toString() ?? undefined,
      isActive: courseRequirment?.isActive ?? undefined,
    },
  });

  const onSubmit = async (data: TCourseRequirment) => {
    const toastId = toast.loading(
      courseRequirment ? "Updating course requirement..." : "Creating course requirement...",
      { duration: 3000 }
    );
    const payload = {
      ...data,
      order: Number(data.order),
    };
    try {
      let result;
      if (courseRequirment) {
        result = await updateCourseRequirment(payload, courseRequirment?.id);
      } else {
        result = await createCourseRequirment(payload);
      }

      if (result?.success) {
        toast.success(result?.message, { id: toastId, duration: 3000 });
        // Redirect to list page
        router.push("/dashboard/course-requirment");
        router.refresh();
      } else {
        toast.error(result?.message, { id: toastId, duration: 3000 });
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{courseRequirment ? "Update Course Requirement" : "Create Course Requirement"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Select Course</FormLabel>
              <Controller
                name="courseId"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {course.map((item, i) => {
                        return (
                          <SelectItem key={i} value={item?.id}>
                            {item?.title}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.courseId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.courseId.message}
                </p>
              )}
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      value={field.value}
                      onChange={field.onChange}
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
                    <Input type="number" placeholder="enter order" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Active Status (Optional)</FormLabel>
                  <FormControl>
                    <Select
                      value={
                        field.value === undefined
                          ? ""
                          : field.value
                            ? "true"
                            : "false"
                      }
                      onValueChange={(value) =>
                        field.onChange(value === "true")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
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
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {courseRequirment ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateAllCourseRequirment;
