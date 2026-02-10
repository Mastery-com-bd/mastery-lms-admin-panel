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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getYouTubeEmbedUrl } from "@/lib/utils";

const formSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  sectionId: z.string().min(1, "Please select a section"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  content: z.string().optional(),
  duration: z.string().optional(),
  order: z.string().min(1, "Order must be a positive number"),
  isPreview: z.boolean(),
  videoType: z.enum(["upload", "url"]),
  videoUrl: z.union([z.instanceof(File), z.string()]).optional(),
}).superRefine((data, ctx) => {
  if (data.videoType === "upload") {
    if (!(data.videoUrl instanceof File)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Video file is required",
        path: ["videoUrl"],
      });
    } else {
      if (!data.videoUrl.type.startsWith("video/")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File must be a video",
          path: ["videoUrl"],
        });
      }
      if (data.videoUrl.size > 100 * 1024 * 1024) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Video size must be less than 100MB",
          path: ["videoUrl"],
        });
      }
    }
  } else if (data.videoType === "url") {
    if (typeof data.videoUrl !== "string" || data.videoUrl.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Video URL is required",
        path: ["videoUrl"],
      });
    } else {
      try {
        new URL(data.videoUrl);
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid URL",
          path: ["videoUrl"],
        });
      }
    }
  }
});

interface Section {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
}

export default function CreateLesson({ courses }: { courses: Course[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      videoType: "upload",
    },
  });

  const selectedCourseId = form.watch("courseId");
  const videoType = form.watch("videoType");

  

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
      formData.append("videoType", values.videoType);
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
        videoType: "upload",
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
                    <Tabs
                      defaultValue="upload"
                      value={videoType}
                      onValueChange={(val) => {
                        form.setValue("videoType", val as "upload" | "url");
                        form.setValue("videoUrl", undefined);
                        setVideoPreview(null);
                        form.clearErrors("videoUrl");
                      }}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="upload">Upload Video</TabsTrigger>
                        <TabsTrigger value="url">Video URL</TabsTrigger>
                      </TabsList>

                      <TabsContent value="upload" className="mt-0">
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
                        </div>
                      </TabsContent>

                      <TabsContent value="url" className="mt-0">
                        <Input
                          placeholder="Enter video URL (e.g. https://example.com/video.mp4)"
                          {...field}
                          value={typeof value === "string" ? value : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const embedUrl = getYouTubeEmbedUrl(val);
                            if (embedUrl) {
                              field.onChange(embedUrl);
                              setVideoPreview(embedUrl);
                            } else {
                              field.onChange(e);
                              setVideoPreview(val);
                            }
                          }}
                        />
                      </TabsContent>

                      {videoPreview && (
                        <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border bg-black mt-4">
                          {videoPreview.includes("youtube.com/embed") ? (
                            <iframe
                              src={videoPreview}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title="Video preview"
                            />
                          ) : (
                            <video
                              src={videoPreview}
                              controls
                              className="w-full h-full"
                            />
                          )}
                        </div>
                      )}
                      {!videoPreview && (
                        <div className="flex items-center justify-center w-full max-w-md aspect-video rounded-lg border border-dashed bg-muted/50 mt-4">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Video className="w-8 h-8" />
                            <span className="text-sm">Video Preview</span>
                          </div>
                        </div>
                      )}
                    </Tabs>
                  </FormControl>
                  <FormDescription>
                    {videoType === "upload"
                      ? "Upload a video file (max 100MB)."
                      : "Enter a direct video URL."}
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
