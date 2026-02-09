"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { deleteSupportRequest, updateSupportRequest } from "@/service/support";
import { ArrowLeft, Send, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SupportRequest {
  id: string;
  userId: string;
  courseId: string;
  subject: string;
  message: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  response?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    instructor?: {
        id: string;
        name: string;
    };
  };
}

export default function SupportDetails({ initialData }: { initialData: SupportRequest }) {
  const router = useRouter();
  const [request, setRequest] = useState<SupportRequest>(initialData);
  const [responseMessage, setResponseMessage] = useState(request.response || "");
  const [status, setStatus] = useState(request.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      const result = await updateSupportRequest(request.id, {
        response: responseMessage,
        status: status,
      });

      if (result.success) {
        toast.success("Support request updated successfully");
        setRequest(result.data);
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update request");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this support request?")) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteSupportRequest(request.id);
      if (result.success) {
        toast.success("Support request deleted successfully");
        router.push("/dashboard/supports");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete request");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: SupportRequest["status"]) => {
    switch (status) {
      case "OPEN":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Open</Badge>;
      case "IN_PROGRESS":
        return <Badge className="bg-warning/10 text-warning border-warning/20">In Progress</Badge>;
      case "RESOLVED":
        return <Badge className="bg-success/10 text-success border-success/20">Resolved</Badge>;
      case "CLOSED":
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: SupportRequest["priority"]) => {
    switch (priority) {
      case "HIGH":
      case "URGENT":
        return <Badge variant="destructive">{priority}</Badge>;
      case "MEDIUM":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Medium</Badge>;
      case "LOW":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  if (!request) {
    return <div className="p-6">Loading or Not Found...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Support Requests
      </Button>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {getStatusBadge(request.status)}
                  {getPriorityBadge(request.priority)}
                  <span className="text-sm text-muted-foreground ml-2">
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                </div>
                <CardTitle className="text-xl">{request.subject}</CardTitle>
              </div>
              <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Message</h3>
                <p className="text-foreground whitespace-pre-wrap">{request.message}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Response / Update Status</h3>
                </div>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={status} onValueChange={(val: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED") => setStatus(val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Message</label>
                    <Textarea
                      placeholder="Type your response here..."
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={6}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleUpdate} disabled={isSubmitting}>
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Updating..." : "Update Request"}
                    </Button>
                  </div>
                </div>

                {request.response && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Previous Response</h3>
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                        <p className="text-sm">{request.response}</p>
                        {request.respondedAt && (
                            <p className="text-xs text-muted-foreground mt-2 text-right">
                                Responded at: {new Date(request.respondedAt).toLocaleString()}
                            </p>
                        )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="w-full md:w-80 space-y-6">
          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar className="w-20 h-20 mb-3">
                  <AvatarFallback className="text-xl">{request.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{request.user?.name}</h3>
                <p className="text-sm text-muted-foreground">{request.user?.email}</p>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono text-xs" title={request.user?.id}>{request.user?.id.substring(0, 8)}...</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Course Title</p>
                  <p className="text-sm text-muted-foreground">{request.course?.title}</p>
                </div>
                {request.course?.instructor && (
                    <div>
                    <p className="text-sm font-medium mb-1">Instructor</p>
                    <p className="text-sm text-muted-foreground">{request.course.instructor.name}</p>
                    </div>
                )}
                <div className="pt-2">
                    <Button variant="outline" className="w-full" size="sm" asChild>
                        <a href={`/dashboard/courses/all-courses/${request.courseId}`} target="_blank" rel="noopener noreferrer">
                            View Course
                        </a>
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
