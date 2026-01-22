/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createCourseLearning,
  updateourseLearning,
} from "@/service/courseLearning";
import { TCourse } from "@/types/course.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import RichTextEditor from "@/components/ui/RichTextEditor";
import { TCourseLearningData } from "@/types/courseLearning.types";

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
});

export type TCourseLearning = z.infer<typeof formSchema>;

const CreateCourseLearning = ({
  course,
  courseLearning,
}: {
  course: TCourse[];
  courseLearning?: TCourseLearningData;
}) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: courseLearning?.course?.id ?? undefined,
      content: courseLearning?.content ?? undefined,
      order: courseLearning?.order.toString() ?? undefined,
    },
  });

  const onSubmit = async (data: TCourseLearning) => {
    const toastId = toast.loading("course learning creating", {
      duration: 3000,
    });
    const payload = {
      ...data,
      order: Number(data.order),
    };
    try {
      let result;
      if (courseLearning) {
        result = await updateourseLearning(payload, courseLearning?.id);
      } else {
        result = await createCourseLearning(payload);
      }

      if (result?.success) {
        toast.success(result?.message, { id: toastId, duration: 3000 });
        form.reset();
        setOpen(false);
      } else {
        toast.error(result?.message, { id: toastId, duration: 3000 });
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          form.reset();
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        {courseLearning ? (
          <Button
            variant="secondary"
            className="cursor-pointer bg-transparent p-2 "
          >
            Update
          </Button>
        ) : (
          <Button className="cursor-pointer">Create Course Learning</Button>
        )}
      </DialogTrigger>

      {/* 🧾 Modal Content */}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Course Learning</DialogTitle>
          <DialogDescription>Add a course learning outline.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Select Category</FormLabel>
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

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="cursor-pointer"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourseLearning;
