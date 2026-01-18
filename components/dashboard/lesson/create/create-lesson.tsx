"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Upload, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Switch } from "@/components/ui/switch";
import { showError, showLoading, showSuccess } from "@/lib/toast";

const formSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  sectionId: z.string().min(1, "Please select a section"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  content: z.string().optional(),
  duration: z.string().optional(),
  order: z.string().min(1, "Order must be a positive number"),
  isPreview: z.boolean(),
  videoUrl: z
    .instanceof(File)
    .refine((file) => file !== undefined, "Video file is required")
    .refine(
      (file) => file?.type.startsWith("video/"),
      "File must be a video"
    )
    .refine(
      (file) => file?.size <= 100 * 1024 * 1024,
      "Video size must be less than 100MB"
    ), // 100MB limit example
});

interface Section {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
}

export default function CreateLesson() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectLoading, setSelectLoading] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: "",
      sectionId: "",
      title: "",
      description: "",
      content: "",
      duration: "",
      order: "",
      isPreview: false,
    },
  });

  const selectedCourseId = form.watch("courseId");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/course?limit=100`
        );
        if (response.ok) {
          const data = await response.json();
          setCourses(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        toast.error("Failed to load courses");
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchSections = async () => {
      setSelectLoading(true);
      if (!selectedCourseId) {
        setSections([]);
        setSelectLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/section?courseId=${selectedCourseId}&limit=100`
        );
        if (response.ok) {
          const data = await response.json();
          setSections(data.data || []);
          setSelectLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch sections:", error);
        toast.error("Failed to load sections");
        setSelectLoading(false);
      }
    };
    fetchSections();
  }, [selectedCourseId]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }
      setVideoPreview(URL.createObjectURL(file));
      form.setValue("videoUrl", file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    showLoading("Uploading lesson...");

    try {
      const formData = new FormData();
      formData.append("sectionId", values.sectionId);
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      if (values.content) formData.append("content", values.content);
      formData.append("duration", values.duration || "");
      formData.append("order", values.order);
      formData.append("isPreview", String(values.isPreview));

      if (values.videoUrl) {
        formData.append("videoUrl", values.videoUrl);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/lesson`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create lesson:", errorData);
        throw new Error(errorData.message || "Failed to create lesson");
      }

      toast.dismiss();
      showSuccess({ message: "Lesson created successfully" });

      form.reset({
        courseId: values.courseId,
        sectionId: values.sectionId,
        title: "",
        description: "",
        content: "",
        duration: "",
        order: String(Number(values.order) + 1),
        isPreview: false,
      });
      setVideoPreview(null);
      router.refresh();
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
    <Card className="w-full max-w-3xl mx-auto p-0 my-10">
      <CardHeader>
        <CardTitle>Create Lesson</CardTitle>
        <CardDescription>Add a new lesson to a section.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-5">
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
                name="sectionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!selectedCourseId || sections.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              selectedCourseId
                                ? selectLoading
                                  ? "Loading sections..."
                                  : "Select a section"
                                : "Select a course first"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sections.map((section) => (
                          <SelectItem key={section.id} value={section.id}>
                            {section.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Variables and Data Types"
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
                      <Input {...field} placeholder="e.g. 1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Learn about JavaScript variables"
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
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Lesson content text or notes..."
                      className="min-h-25"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Minutes)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPreview"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Free Preview</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>Video Lesson</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("video-upload")?.click()
                          }
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Video
                        </Button>
                        <Input
                          {...field}
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleVideoChange}
                        />
                        <span className="text-sm text-muted-foreground">
                          {value instanceof File && value.size > 0
                            ? value.name
                            : "No video selected"}
                        </span>
                      </div>

                      {videoPreview && (
                        <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-black">
                          <video
                            src={videoPreview}
                            controls
                            className="w-full h-full"
                          />
                        </div>
                      )}
                      {!videoPreview && (
                        <div className="flex items-center justify-center w-full max-w-md aspect-video rounded-lg border border-dashed bg-muted/50">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Video className="w-8 h-8" />
                            <span className="text-sm">Video Preview</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload a video file for the lesson. Max size 100MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Lesson
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
