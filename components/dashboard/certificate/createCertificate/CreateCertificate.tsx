"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Upload, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { showError, showLoading, showSuccess } from "@/lib/toast";
import { config } from "@/config";
import { getAllUsers } from "@/service/user";

// Define simplified interfaces for props
interface User {
  id: string;
  name?: string;
  email?: string;
}

interface Course {
  id: string;
  title: string;
}

interface CreateCertificateProps {
  users: User[];
  courses: Course[];
}

const formSchema = z.object({
  userId: z.string().min(1, "Please select a user"),
  courseId: z.string().min(1, "Please select a course"),
  certificatImage: z.any().optional(),
});

const CreateCertificate = ({ users: initialUsers, courses }: CreateCertificateProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // States for student search
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      courseId: "",
      certificatImage: undefined,
    },
  });

  // Debounced search for users
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        setIsSearching(true);
        try {
          // Fetch users with searchTerm and limit 10
          const res = await getAllUsers({ 
            searchTerm: searchTerm, 
            limit: 10, 
            role: "STUDENT" 
          });
          if (res?.data) {
            setUsers(res.data);
          }
        } catch (error) {
          console.error("Failed to search users:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        // Reset to initial users if search is cleared
        setUsers(initialUsers);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, initialUsers]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation
      if (file.size > 10 * 1024 * 1024) {
        showError({ message: "File size must be less than 10MB" });
        return;
      }

      form.setValue("certificatImage", file);
      
      // Preview if image
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    showLoading("Creating certificate...");

    try {
      const formData = new FormData();
      formData.append("userId", values.userId);
      formData.append("courseId", values.courseId);
      
      if (values.certificatImage instanceof File) {
        formData.append("certificatImage", values.certificatImage);
      }

      const response = await fetch(`${config.next_public_base_url}/certificate`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create certificate");
      }

      toast.dismiss();
      showSuccess({ message: "Certificate created successfully" });
      router.push("/dashboard/certificate");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.dismiss();
      showError({
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Create Certificate</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Details</CardTitle>
          <CardDescription>
            Issue a new certificate for a student.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Selection with Combobox */}
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Student</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? users.find((user) => user.id === field.value)?.name ||
                                  users.find((user) => user.id === field.value)?.email ||
                                  "Select student"
                                : "Select student"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command shouldFilter={false}>
                            <CommandInput 
                              placeholder="Search student by name..." 
                              value={searchTerm}
                              onValueChange={setSearchTerm}
                            />
                            <CommandList>
                              {isSearching ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">
                                  <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                                  Searching...
                                </div>
                              ) : (
                                <>
                                  <CommandEmpty>No student found.</CommandEmpty>
                                  <CommandGroup>
                                    {users.map((user) => (
                                      <CommandItem
                                        key={user.id}
                                        value={user.id} // We use ID as value for selection, but display Name
                                        onSelect={() => {
                                          form.setValue("userId", user.id);
                                          setOpen(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            user.id === field.value
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span>{user.name || "Unknown Name"}</span>
                                          <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Course Selection */}
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
                          {courses.length > 0 ? (
                            courses.map((course) => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.title}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground text-center">
                              No courses found
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <FormLabel>Certificate File (Optional)</FormLabel>
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer relative">
                  <Input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    accept="image/*,application/pdf"
                  />
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Image or PDF (max 10MB)
                      </p>
                    </div>
                    {form.getValues("certificatImage") && (
                      <div className="mt-2 text-sm font-medium text-green-600">
                        Selected: {(form.getValues("certificatImage") as File).name}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Preview */}
                {filePreview && (
                  <div className="mt-4 border rounded-lg overflow-hidden max-w-md">
                    <img 
                      src={filePreview} 
                      alt="Certificate Preview" 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Certificate"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCertificate;
