"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Inbox,
  Search,
  Send,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SupportRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  subject: string;
  message: string;
  category: "technical" | "billing" | "course" | "general";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  responses: {
    id: string;
    message: string;
    isAdmin: boolean;
    createdAt: string;
  }[];
}

const mockRequests: SupportRequest[] = [
  {
    id: "1",
    userId: "u1",
    userName: "Alice Johnson",
    userEmail: "alice@example.com",
    subject: "Cannot access course videos",
    message:
      "I enrolled in the React course but videos are not loading. Getting a 404 error.",
    category: "technical",
    priority: "high",
    status: "open",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    responses: [],
  },
  {
    id: "2",
    userId: "u2",
    userName: "Bob Smith",
    userEmail: "bob@example.com",
    subject: "Refund request for duplicate purchase",
    message:
      "I accidentally purchased the same course twice. Please refund one of them.",
    category: "billing",
    priority: "medium",
    status: "in_progress",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    responses: [
      {
        id: "r1",
        message:
          "Hi Bob, we're looking into this and will process your refund within 24 hours.",
        isAdmin: true,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "3",
    userId: "u3",
    userName: "Carol Davis",
    userEmail: "carol@example.com",
    subject: "Certificate not generated",
    message: "I completed the Python course but didn't receive my certificate.",
    category: "course",
    priority: "low",
    status: "resolved",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    responses: [
      {
        id: "r2",
        message:
          "We've regenerated your certificate. You should be able to download it from your profile now.",
        isAdmin: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "4",
    userId: "u1",
    userName: "Alice Johnson",
    userEmail: "alice@example.com",
    subject: "Cannot access course videos",
    message:
      "I enrolled in the React course but videos are not loading. Getting a 404 error.",
    category: "technical",
    priority: "high",
    status: "open",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    responses: [],
  },
  {
    id: "5",
    userId: "u2",
    userName: "Bob Smith",
    userEmail: "bob@example.com",
    subject: "Refund request for duplicate purchase",
    message:
      "I accidentally purchased the same course twice. Please refund one of them.",
    category: "billing",
    priority: "medium",
    status: "in_progress",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    responses: [
      {
        id: "r1",
        message:
          "Hi Bob, we're looking into this and will process your refund within 24 hours.",
        isAdmin: true,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "6",
    userId: "u3",
    userName: "Carol Davis",
    userEmail: "carol@example.com",
    subject: "Certificate not generated",
    message: "I completed the Python course but didn't receive my certificate.",
    category: "course",
    priority: "low",
    status: "resolved",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    responses: [
      {
        id: "r2",
        message:
          "We've regenerated your certificate. You should be able to download it from your profile now.",
        isAdmin: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "7",
    userId: "u1",
    userName: "Alice Johnson",
    userEmail: "alice@example.com",
    subject: "Cannot access course videos",
    message:
      "I enrolled in the React course but videos are not loading. Getting a 404 error.",
    category: "technical",
    priority: "high",
    status: "open",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    responses: [],
  },
  {
    id: "8",
    userId: "u2",
    userName: "Bob Smith",
    userEmail: "bob@example.com",
    subject: "Refund request for duplicate purchase",
    message:
      "I accidentally purchased the same course twice. Please refund one of them.",
    category: "billing",
    priority: "medium",
    status: "in_progress",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    responses: [
      {
        id: "r1",
        message:
          "Hi Bob, we're looking into this and will process your refund within 24 hours.",
        isAdmin: true,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "9",
    userId: "u3",
    userName: "Carol Davis",
    userEmail: "carol@example.com",
    subject: "Certificate not generated",
    message: "I completed the Python course but didn't receive my certificate.",
    category: "course",
    priority: "low",
    status: "resolved",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    responses: [
      {
        id: "r2",
        message:
          "We've regenerated your certificate. You should be able to download it from your profile now.",
        isAdmin: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "10",
    userId: "u1",
    userName: "Alice Johnson",
    userEmail: "alice@example.com",
    subject: "Cannot access course videos",
    message:
      "I enrolled in the React course but videos are not loading. Getting a 404 error.",
    category: "technical",
    priority: "high",
    status: "open",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    responses: [],
  },
];

export function SupportRequestsTab() {
  const [requests, setRequests] = useState<SupportRequest[]>(mockRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(
    null
  );
  const [replyMessage, setReplyMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || req.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewRequest = (request: SupportRequest) => {
    setSelectedRequest(request);
    setReplyMessage("");
    setIsDialogOpen(true);
  };

  const handleSendReply = () => {
    if (!selectedRequest || !replyMessage.trim()) return;

    const newResponse = {
      id: Date.now().toString(),
      message: replyMessage,
      isAdmin: true,
      createdAt: new Date().toISOString(),
    };

    setRequests(
      requests.map((r) =>
        r.id === selectedRequest.id
          ? {
              ...r,
              responses: [...r.responses, newResponse],
              status: "in_progress" as const,
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );

    setSelectedRequest({
      ...selectedRequest,
      responses: [...selectedRequest.responses, newResponse],
    });

    setReplyMessage("");
    toast.success("Reply sent", {
      description: "Your response has been sent to the user",
    });
  };

  const handleUpdateStatus = (
    requestId: string,
    newStatus: SupportRequest["status"]
  ) => {
    setRequests(
      requests.map((r) =>
        r.id === requestId
          ? { ...r, status: newStatus, updatedAt: new Date().toISOString() }
          : r
      )
    );
    if (selectedRequest?.id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
    toast.success("Status updated", {
      description: `Request marked as ${newStatus}`,
    });
  };

  const getStatusBadge = (status: SupportRequest["status"]) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            Open
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Resolved
          </Badge>
        );
      case "closed":
        return <Badge variant="secondary">Closed</Badge>;
    }
  };

  const getPriorityBadge = (priority: SupportRequest["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            Medium
          </Badge>
        );
      case "low":
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  const openCount = requests.filter((r) => r.status === "open").length;
  const inProgressCount = requests.filter(
    (r) => r.status === "in_progress"
  ).length;
  const resolvedCount = requests.filter((r) => r.status === "resolved").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-card border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {requests.length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Requests
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          className="bg-card border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {openCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Open</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          className="bg-card border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {inProgressCount}
                  </p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          className="bg-card border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {resolvedCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Requests Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <CardTitle className="text-foreground">Support Requests</CardTitle>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-48"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="billing">Billing</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + idx * 0.1 }}
                    key={request.id}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={request.userAvatar} />
                          <AvatarFallback>
                            {request.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {request.userName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {request.userEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="font-medium text-foreground truncate">
                        {request.subject}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {request.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{getPriorityBadge(request.priority)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleViewRequest(request)}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            {filteredRequests.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                No support requests found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Request Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-4">
              <span className="truncate">{selectedRequest?.subject}</span>
              {selectedRequest && getStatusBadge(selectedRequest.status)}
            </DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="flex-1 overflow-y-auto space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Avatar>
                  <AvatarImage src={selectedRequest.userAvatar} />
                  <AvatarFallback>
                    {selectedRequest.userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {selectedRequest.userName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.userEmail}
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {selectedRequest.category}
                  </Badge>
                  {getPriorityBadge(selectedRequest.priority)}
                </div>
              </div>

              {/* Original Message */}
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </p>
                <p className="text-foreground">{selectedRequest.message}</p>
              </div>

              {/* Responses */}
              {selectedRequest.responses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Responses</h4>
                  {selectedRequest.responses.map((response) => (
                    <div
                      key={response.id}
                      className={`p-4 rounded-lg ${
                        response.isAdmin
                          ? "bg-primary/10 border border-primary/20 ml-8"
                          : "bg-muted/30 border border-border mr-8"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={response.isAdmin ? "default" : "secondary"}
                        >
                          {response.isAdmin ? "Admin" : "User"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(response.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-foreground">{response.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box */}
              {selectedRequest.status !== "closed" && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Type your reply..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <Select
                      value={selectedRequest.status}
                      onValueChange={(value: SupportRequest["status"]) =>
                        handleUpdateStatus(selectedRequest.id, value)
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
