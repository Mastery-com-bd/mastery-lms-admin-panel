"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Upload, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
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
    .union([
      z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "Video file is required"),
      z.string(), // Allow string for existing video URL
      z.undefined(),
      z.null(),
    ])
    .optional(),
});

interface Section {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
}

interface UpdateLessonProps {
  lessonId: string;
}

export default function UpdateLesson({ lessonId }: UpdateLessonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [currentCourseTitle, setCurrentCourseTitle] = useState<string>("");
  const [currentSectionTitle, setCurrentSectionTitle] = useState<string>("");
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

  console.log("Fetched Data:", courses, sections);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Courses
        const coursesRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/course?limit=100`
        );
        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setCourses(data.data || []);
        }

        // Fetch Lesson
        const lessonRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/lesson/${lessonId}`
        );
        if (!lessonRes.ok) throw new Error("Failed to fetch lesson");

        const lessonData = await lessonRes.json();
        const lesson = lessonData.data || lessonData;

        // Fetch Sections for the course
        if (lesson.section?.courseId) {
          const sectionsRes = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/section?courseId=${lesson.section.courseId}&limit=100`
          );
          if (sectionsRes.ok) {
            const sectionsData = await sectionsRes.json();
            setSections(sectionsData.data || []);
          }
        }

        // Set form values
        form.reset({
          courseId: lesson.section?.courseId || "",
          sectionId: lesson.sectionId,
          title: lesson.title,
          description: lesson.description || "",
          content: lesson.content || "",
          duration: String(lesson.duration || ""),
          order: String(lesson.order),
          isPreview: lesson.isPreview,
        });

        if (lesson.videoUrl) {
          setVideoPreview(lesson.videoUrl);
        }

        // Set current titles for display
        if (lesson.section?.course) {
          setCurrentCourseTitle(lesson.section.course.title);
        }
        if (lesson.section) {
          setCurrentSectionTitle(lesson.section.title);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load lesson data");
      } finally {
        setIsLoading(false);
      }
    };

    if (lessonId) fetchData();
  }, [lessonId, form]);

  // Fetch sections when course changes manually
  useEffect(() => {
    const fetchSections = async () => {
      if (!selectedCourseId || isLoading) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/section?courseId=${selectedCourseId}&limit=100`
        );
        if (response.ok) {
          const data = await response.json();
          setSections(data.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      }
    };
    fetchSections();
  }, [selectedCourseId, isLoading]);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast.error("Please select a valid video file");
        return;
      }
      setVideoPreview(URL.createObjectURL(file));
      form.setValue("videoUrl", e.target.files as unknown as FileList);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    showLoading("Updating lesson...");

    try {
      const formData = new FormData();
      formData.append("sectionId", values.sectionId);
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      if (values.content) formData.append("content", values.content);
      formData.append("duration", values.duration || "");
      formData.append("order", values.order);
      formData.append("isPreview", String(values.isPreview));

      if (values.videoUrl instanceof FileList && values.videoUrl.length > 0) {
        formData.append("videoUrl", values.videoUrl[0]);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/lesson/${lessonId}`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update lesson");
      }

      toast.dismiss();
      showSuccess({ message: "Lesson updated successfully" });
      router.push("/dashboard/lessonss");
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-100">
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
          <CardTitle>Update Lesson</CardTitle>
        </div>
        <CardDescription>Update existing lesson details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Course</FormLabel>
                <Input value={currentCourseTitle} disabled />
              </FormItem>

              <FormItem>
                <FormLabel>Section</FormLabel>
                <Input value={currentSectionTitle} disabled />
              </FormItem>
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
                          {videoPreview ? "Change Video" : "Upload Video"}
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
                          {value instanceof FileList && value.length > 0
                            ? value[0].name
                            : "Current video"}
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
                    Upload a new video to replace the current one. Max size
                    100MB.
                  </FormDescription>
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
                Update Lesson
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
