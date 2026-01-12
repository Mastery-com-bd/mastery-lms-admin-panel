"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Upload, ImageIcon } from "lucide-react";
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
import { showError, showLoading, showSuccess } from "@/lib/toast";
import Image from "next/image";

// Constants for select options
const COURSE_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];
const LANGUAGES = [
  "ENGLISH",
  "SPANISH",
  "FRENCH",
  "GERMAN",
  "CHINESE",
  "JAPANESE",
  "HINDI",
  "BENGALI",
  "ARABIC",
  "RUSSIAN",
];
const LEARNING_TYPES = ["RECORDED", "LIVE", "ONLINE", "OFFLINE"];

const COURSE_STATUS = ["DRAFT", "PUBLISHED", "ARCHIVED"];

// Zod Schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subtitle: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
  shortDescription: z.string().optional(),
  categoryId: z.string().min(1, "Please select a category"),
  price: z.string().min(1, "Price must be a positive number"),
  discountPrice: z.string().optional(),
  isFeatured: z.boolean().optional(),
  level: z.string().min(1, "Please select a level"),
  status: z.string().optional(),
  language: z.string().min(1, "Please select a language"),
  courseLeaningType: z.string().min(1, "Please select a learning type"),
  duration: z.string().optional(),
});

export default function CreateCourse() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [thumbnail, setThumbnail] = useState<File | null>(null);
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
      isFeatured: false,
      level: "BEGINNER",
      language: "BENGALI",
      courseLeaningType: "ONLINE",
      status: "DRAFT",
      duration: "",
    },
  });

  // Fetch Categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/category?limit=100`
        );

        const data = await response.json();
        setCategories(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        showError({ message: "Failed to load categories" });
      }
    }
    fetchCategories();
  }, []);

  // Handle Thumbnail Preview

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        showError({ message: "Please select a valid image file" });
        return;
      }
      // Check file size (1MB limit)
      if (file.size > 1 * 1024 * 1024) {
        showError({ message: "Image size must be less than 1MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(file);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnail(null);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    if (!thumbnail) {
      showError({ message: "Please upload a thumbnail image" });
      setIsSubmitting(false);
      return;
    }

    if (!values.price || Number(values.price) <= 0) {
      showError({ message: "Price must be a positive number" });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      showLoading("Creating course...");

      // Append text fields
      Object.entries(values).forEach(([key, value]) => {
        // Skip undefined or null values
        if (value === undefined || value === null || value === "") return;

        // Convert price, discountPrice and duration to numbers if needed, or just append as string
        if (key === "price" || key === "discountPrice" || key === "duration") {
          formData.append(key, String(Number(value)));
        } else {
          formData.append(key, String(value));
        }
      });

      // Append thumbnail once
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      // Debug: Log form data entries

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/course`,
        {
          method: "POST",
          // Content-Type is set automatically by browser with boundary for FormData
          body: formData,
          credentials: "include",
        }
      );

      toast.dismiss();
      showSuccess({
        message:
          (await response.json().then((data) => data.message)) ||
          "Course created successfully",
      });
      router.push("/dashboard/courses");
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
    <div className="flex justify-center items-start min-h-screen p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
          <CardDescription>
            Fill in the details below to create a new course.
          </CardDescription>
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
                              <SelectValue
                                defaultValue={field.value}
                                placeholder="Select status"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COURSE_STATUS.map((status) => (
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
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Featured Course</FormLabel>
                        <FormControl>
                          <label className="inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900">
                              {field.value ? "Yes" : "No"}
                            </span>
                          </label>
                        </FormControl>
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
                          className="min-h-37.5"
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
                          <Input type="number" min="0" {...field} />
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
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Media Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Course Media</h3>

                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("thumbnail-upload")?.click()
                          }
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Image
                        </Button>
                        <Input
                          id="thumbnail-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailChange}
                        />
                        <span className="text-sm text-muted-foreground">
                          {thumbnail ? thumbnail.name : "No file selected"}
                        </span>
                      </div>

                      {thumbnail && (
                        <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border">
                          <Image
                            fill
                            src={URL.createObjectURL(thumbnail)}
                            alt="Thumbnail preview"
                            className="object-cover w-full h-full max-w-150"
                          />
                        </div>
                      )}
                      {!thumbnail && (
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
                    1MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
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
                  Create Course
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
