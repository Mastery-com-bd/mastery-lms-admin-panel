/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, ImageIcon, X } from "lucide-react";
import { useState } from "react";
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
import Image from "next/image";
import { TCategory } from "@/types/category.types";
import { createCourse } from "@/service/course";
import { TSubject } from "@/types/subject.types";
import { TInstructor } from "@/types/user.types";
import { Badge } from "@/components/ui/badge";

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
const formSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    subtitle: z.string().optional(),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),
    shortDescription: z.string().optional(),

    categoryId: z.string().min(1, "Please select a category"),
    subjectId: z.string().min(1, "Please select a subject"),

    userId: z.string().optional(),

    price: z.string().min(1, "Price must be a positive number"),
    discountPrice: z
      .string()
      .optional()
      .refine((val) => !val || Number(val) >= 0, {
        message: "Discount price must be positive",
      }),

    isFeatured: z.boolean().optional(),

    level: z.string().min(1, "Please select a level"),
    status: z.string().optional(),

    language: z.string().min(1, "Please select a language"),
    courseLeaningType: z.string().min(1, "Please select a learning type"),

    duration: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.discountPrice && Number(data.discountPrice) > Number(data.price)) {
      ctx.addIssue({
        path: ["discountPrice"],
        message: "Discount price cannot be greater than price",
        code: z.ZodIssueCode.custom,
      });
    }
  });

type TCreateCourseProps = {
  categories: TCategory[];
  subjects: TSubject[];
  instructors: TInstructor[];
};

export type TCourseFormSchema = z.infer<typeof formSchema>;

export default function CreateCourse({
  categories,
  subjects,
  instructors,
}: TCreateCourseProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const router = useRouter();

  const form = useForm<TCourseFormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const price = form.watch("price");

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (!file) return;
    if (file) {
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file", { duration: 3000 });
        return;
      }
      // Check file size (1MB limit)
      if (file.size > 1 * 1024 * 1024) {
        toast.error("Image size must be less than 1MB", { duration: 3000 });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setThumbnail(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setThumbnail(null);
    }
  };

  const removeImage = () => {
    setImage(null);
    setThumbnail(null);
    const input = document.getElementById("bookImageInput") as HTMLInputElement;
    if (input) input.value = "";
  };

  const sanitizeTag = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;

    const cleaned = sanitizeTag(tagInput);

    if (!cleaned) return;

    if (!tags.includes(cleaned)) {
      setTags((prev) => [...prev, cleaned]);
    }

    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  async function onSubmit(values: TCourseFormSchema) {
    const formData = new FormData();
    const toastId = toast.loading("Creating course...");
    if (!image) {
      return toast.error("Please upload a thumbnail image", {
        id: toastId,
        duration: 3000,
      });
    }
    formData.append("thumbnail", image);
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    try {
      const result = await createCourse(formData);
      if (result?.success) {
        toast.success(result?.message, { id: toastId, duration: 3000 });
        form.reset();
        router.push("/dashboard/courses");
        // setOpen(false);
        // removeImage();
      } else {
        toast.error(result?.message, { id: toastId, duration: 3000 });
      }
    } catch (error: any) {
      console.log(error);
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* course title */}
                  <div>
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
                  </div>

                  {/* course subtitle */}
                  <div>
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
                  </div>

                  {/* course category */}
                  <div>
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
                                <SelectItem
                                  key={category?.id}
                                  value={category.id}
                                >
                                  {category?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* course subject */}
                  <div>
                    <FormField
                      control={form.control}
                      name="subjectId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem
                                  key={subject?.id}
                                  value={subject?.id}
                                >
                                  {subject?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* course level */}
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

                  {/* course status */}
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

                  {/* select instructor */}
                  {instructors.length > 0 && (
                    <div>
                      <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instructor (Optional)</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value as string}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a Instructor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {instructors.map((instructor) => (
                                  <SelectItem
                                    key={instructor?.id}
                                    value={instructor.id}
                                  >
                                    {instructor?.fullName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* short description */}
                  <div>
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
                  </div>

                  {/* full description */}
                  <div>
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
                </div>
              </div>

              {/* Descriptions Section */}

              {/* Details & Pricing Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Details & Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* set language */}
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

                  {/* course type */}
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

                  {/* course duration */}
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (Hours)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            placeholder="course duration"
                            {...field}
                          />
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
                          <Input
                            type="number"
                            min={0}
                            placeholder="enter price"
                            {...field}
                            onChange={(e) => {
                              const value = Math.max(0, Number(e.target.value));
                              field.onChange(value.toString());

                              // Reset discount if it exceeds price
                              const discount = Number(
                                form.getValues("discountPrice"),
                              );
                              if (discount && discount > value) {
                                form.setValue(
                                  "discountPrice",
                                  value.toString(),
                                );
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Discount Price */}
                  <FormField
                    control={form.control}
                    name="discountPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={price || undefined}
                            {...field}
                            placeholder="enter discount price"
                            onChange={(e) => {
                              const value = Math.max(0, Number(e.target.value));
                              const priceValue = Number(price || 0);

                              // Prevent discount > price
                              const finalValue =
                                value > priceValue ? priceValue : value;

                              field.onChange(finalValue.toString());
                            }}
                            disabled={!price}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* course featured */}
                  <div>
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-3">
                          <FormLabel>Featured Course</FormLabel>
                          <FormControl>
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={field.value}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
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
              </div>

              {/* Media Section */}
              <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-4">
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />

                      {/* Preview / Upload Area */}
                      <div
                        className={`relative w-full max-w-sm aspect-video rounded-lg border border-dashed bg-muted/50 flex items-center justify-center cursor-pointer overflow-hidden`}
                        onClick={() =>
                          document.getElementById("thumbnail-upload")?.click()
                        }
                      >
                        {!thumbnail && (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <ImageIcon className="w-8 h-8" />
                            <span className="text-sm">
                              Click to upload image
                            </span>
                          </div>
                        )}

                        {thumbnail && (
                          <>
                            <Image
                              fill
                              src={thumbnail}
                              alt="Thumbnail preview"
                              className="object-cover w-full h-full"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2 h-6 w-6 cursor-pointer"
                              onClick={() => {
                                removeImage();
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Recommended size: 1280x720 (16:9 aspect ratio). Max size
                    1MB.
                  </FormDescription>
                  <FormMessage />
                </FormItem>

                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>

                  {/* Tags List */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-xs hover:text-red-500"
                          >
                            ✕
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter tag (e.g. react_js)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />

                    <Button type="button" onClick={handleAddTag}>
                      Add
                    </Button>
                  </div>

                  <FormDescription>
                    Only lowercase letters and underscores are allowed.
                  </FormDescription>
                </FormItem>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    removeImage();
                    form.reset();
                    setTagInput("");
                    setTags([]);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && (
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
