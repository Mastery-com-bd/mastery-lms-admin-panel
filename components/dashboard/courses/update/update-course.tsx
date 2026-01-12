"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Upload, ImageIcon, ArrowLeft } from "lucide-react";
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

// Constants for select options
const COURSE_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const LANGUAGES = ["ENGLISH", "SPANISH", "FRENCH", "GERMAN", "HINDI"];
const LEARNING_TYPES = ["ONLINE", "HYBRID", "OFFLINE"];
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

// Zod Schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subtitle: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  price: z.string().min(1, "Price is required"),
  discountPrice: z.string().optional(),
  level: z.string().min(1, "Please select a level"),
  language: z.string().min(1, "Please select a language"),
  courseLeaningType: z.string().min(1, "Please select a learning type"),
  duration: z.string().optional(),
  status: z.string().optional(),
  isFeatured: z.boolean().optional(),
  thumbnail: z
    .union([
      z
        .instanceof(FileList)
        .refine((files) => files?.length === 1, "Thumbnail image is required"),
      z.string(), // Allow string for existing thumbnail URL
      z.undefined(),
      z.null(),
    ])
    .optional(),
});

export default function UpdateCourse({ courseId }: { courseId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      shortDescription: "",
      categoryId: "",
      price: "",
      discountPrice: "",
      level: "BEGINNER",
      language: "ENGLISH",
      courseLeaningType: "ONLINE",
      duration: "",
      status: "DRAFT",
      isFeatured: false,
    },
  });

  // Fetch Course and Categories on mount
  useEffect(() => {
    async function fetchData() {
      if (!courseId) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch Categories
        const categoriesRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/category?limit=100`
        );
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.data || []);
        }

        // Fetch Course
        const courseRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/course/${courseId}`
        );
        if (!courseRes.ok) {
          throw new Error("Failed to fetch course");
        }

        const courseData = await courseRes.json();
        const course = courseData.data || courseData; // Adjust based on actual API response

        // Set form values
        form.reset({
          title: course.title,
          subtitle: course.subtitle || "",
          description: course.description,
          shortDescription: course.shortDescription || "",
          categoryId: course.categoryId,
          price: String(course.price || ""),
          discountPrice: String(course.discountPrice || ""),
          level: course.level,
          language: course.language,
          courseLeaningType: course.courseLeaningType,
          duration: String(course.duration || ""),
          status: course.status,
          isFeatured: course.isFeatured,
        });

        if (course.thumbnail) {
          setThumbnailPreview(course.thumbnail);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        showError({ message: "Failed to load course data" });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [courseId, form]);

  // Handle Thumbnail Preview
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      if (!file.type.startsWith("image/")) {
        showError({ message: "Please select a valid image file" });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showError({ message: "Image size must be less than 5MB" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // Manually set value for validation
      form.setValue("thumbnail", e.target.files as unknown as FileList);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!courseId) return;

    setIsSubmitting(true);
    try {
      showLoading("Updating course...");
      const formData = new FormData();

      // Append text fields
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "thumbnail" && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append file only if a new one is selected
      if (values.thumbnail instanceof FileList && values.thumbnail.length > 0) {
        formData.append("thumbnail", values.thumbnail[0]);
      }

      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/course/${courseId}`, {
        method: "PATCH",
        body: formData,
        credentials: "include",
      });

      toast.dismiss();

      showSuccess({
        message: "Course updated successfully",
      });
      //   toast.success("Course updated successfully")
      router.push("/dashboard/courses");
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
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!courseId) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] gap-4">
        <p className="text-muted-foreground">No course ID provided.</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center gap-4 mb-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Update Course</CardTitle>
          </div>
          <CardDescription>Update existing course details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Course Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Complete JavaScript Course"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. From Beginner to Advanced"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
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
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COURSE_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Descriptions Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Descriptions</h3>
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief overview of the course"
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
                      <FormLabel>Full Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed description of what students will learn..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Details & Pricing Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Details & Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang} value={lang}>
                                {lang}
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
                    name="courseLeaningType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Learning Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LEARNING_TYPES.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
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
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Hours)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discountPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Status & Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Status & Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
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
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Featured Course
                          </FormLabel>
                          <FormDescription>
                            Mark this course as featured to highlight it.
                          </FormDescription>
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
              </div>

              {/* Media Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Course Media</h3>
                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Thumbnail Image</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                document
                                  .getElementById("thumbnail-upload")
                                  ?.click()
                              }
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Change Image
                            </Button>
                            <Input
                              {...field}
                              id="thumbnail-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleThumbnailChange}
                            />
                            <span className="text-sm text-muted-foreground">
                              {value instanceof FileList && value.length > 0
                                ? value[0].name
                                : "Current thumbnail"}
                            </span>
                          </div>

                          {thumbnailPreview && (
                            <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border">
                              <img
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          {!thumbnailPreview && (
                            <div className="flex items-center justify-center w-full max-w-sm aspect-video rounded-lg border border-dashed bg-muted/50">
                              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <ImageIcon className="w-8 h-8" />
                                <span className="text-sm">Image Preview</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Recommended size: 1280x720 (16:9 aspect ratio). Max size
                        5MB.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
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
                  Update Course
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
