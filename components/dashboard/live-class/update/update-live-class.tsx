"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  CalendarClock,
  Link2,
  KeyRound,
} from "lucide-react";
import { useEffect, useState } from "react";
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

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startTime: z.string().min(1, "Please select a date and time"),
  endTime: z.string().min(1, "Please select a date and time"),
  duration: z.string().min(1, "Duration is required"),
  meetingUrl: z.string().url("Please enter a valid meeting link"),
  meetingId: z.string().min(1, "Meeting ID is required"),
  meetingPassword: z.string().min(1, "Meeting password is required"),
});

interface LiveClass {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  duration: number;
  meetingUrl: string;
  meetingId: string;
  meetingPassword: string;
}

interface UpdateLiveClassProps {
  liveClassId: string;
}

export default function UpdateLiveClass({ liveClassId }: UpdateLiveClassProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      duration: "",
      meetingUrl: "",
      meetingId: "",
      meetingPassword: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const liveClassResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/live-class/${liveClassId}`
        );

        
        const liveClassData = await liveClassResponse.json();
        const liveClass: LiveClass = liveClassData.data || liveClassData;
        console.log("liveClassResponse:", liveClass);

        form.reset({
          title: liveClass.title,
          description: liveClass.description,
          startTime: liveClass.startTime,
          endTime: liveClass.endTime,
          duration: String(liveClass.duration || 60),
          meetingUrl: liveClass.meetingUrl,
          meetingId: liveClass.meetingId,
          meetingPassword: liveClass.meetingPassword,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
        showError({ message: "Failed to load live class data" });
      } finally {
        setIsLoading(false);
      }
    };

    if (liveClassId) {
      fetchData();
    }
  }, [liveClassId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    showLoading("Updating live class...");

    try {
      const body = {
        title: values.title,
        description: values.description,
        startTime: values.startTime,
        endTime: values.endTime,
        duration: Number(values.duration) || 60,
        meetingUrl: values.meetingUrl,
        meetingId: values.meetingId,
        meetingPassword: values.meetingPassword,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/live-class/${liveClassId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );
      
      console.log("Success response:", await response.json());

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update live class");
      }

      toast.dismiss();
      const data = await response.json().catch(() => null);
      showSuccess({
        message: data?.message || "Live class updated successfully",
      });
      router.push("/dashboard/live-class");
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
          <CardTitle>Update Live Class</CardTitle>
        </div>
        <CardDescription>
          Modify live class schedule and meeting details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Live Q&A Session" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what will be covered in this live class"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                          type="datetime-local"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date & Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CalendarClock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                          type="datetime-local"
                          className="pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingUrl"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Meeting Link</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                          type="url"
                          className="pl-9"
                          placeholder="https://"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter meeting ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meetingPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        <Input
                          type="text"
                          className="pl-9"
                          placeholder="Enter meeting password"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                Update Live Class
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
