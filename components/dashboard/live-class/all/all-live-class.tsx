"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CalendarClock,
  Clock3,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface CourseSummary {
  id: string;
  title: string;
}

interface LiveClass {
  id: string;
  courseId: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  meetingLink: string;
  meetingId: string;
  meetingPassword: string;
  status?: string;
  course?: CourseSummary;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

const AllLiveClass = () => {
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const sortBy = "scheduledAt";
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchInput]);

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
      }
    };
    fetchCourses();
  }, []);

  const fetchLiveClasses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", meta.page.toString());
      params.set("limit", meta.limit.toString());
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);

      if (searchTerm) {
        params.set("searchTerm", searchTerm);
      }

      if (courseFilter !== "all") {
        params.set("courseId", courseFilter);
      }

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/live-class?${params.toString()}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch live classes");
      }

      const data = await response.json();
      if (data.success) {
        setLiveClasses(data.data || []);
        setMeta({
          page: data.meta?.page ?? meta.page,
          limit: data.meta?.limit ?? meta.limit,
          total: data.meta?.total ?? 0,
          totalPages: data.meta?.totalPages ?? 0,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [
    meta.page,
    meta.limit,
    sortBy,
    sortOrder,
    searchTerm,
    courseFilter,
    statusFilter,
  ]);

  useEffect(() => {
    fetchLiveClasses();
  }, [fetchLiveClasses]);

  const handlePageChange = (newPage: number) => {
    setMeta((prev) => ({ ...prev, page: newPage }));
  };

  const totalPages =
    meta.totalPages && meta.totalPages > 0
      ? meta.totalPages
      : Math.ceil(meta.total / meta.limit || 1);

  const formatDateTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getStatusBadge = (liveClass: LiveClass) => {
    if (liveClass.status) {
      return liveClass.status;
    }
    const now = new Date();
    const scheduled = new Date(liveClass.scheduledAt);
    const end = new Date(scheduled.getTime() + liveClass.duration * 60000);

    if (now < scheduled) return "UPCOMING";
    if (now >= scheduled && now <= end) return "LIVE";
    return "COMPLETED";
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          All Live Classes
        </h1>
        <Button asChild>
          <Link href="/dashboard/live-class/create">
            <Video className="w-4 h-4 mr-2" />
            Schedule Live Class
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between border-b">
          <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or description"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <Select
                value={courseFilter}
                onValueChange={(value) => {
                  setCourseFilter(value);
                  setMeta((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue placeholder="Filter by course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setMeta((prev) => ({ ...prev, page: 1 }));
                }}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="LIVE">Live</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Course
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Title
                  </th>
                  <th
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                    onClick={() =>
                      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                  >
                    Schedule
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Duration
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {liveClasses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No live classes found.
                    </td>
                  </tr>
                ) : (
                  liveClasses.map((liveClass) => (
                    <tr
                      key={liveClass.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {liveClass.course?.title ||
                              courses.find(
                                (course) => course.id === liveClass.courseId
                              )?.title ||
                              "Untitled course"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {liveClass.courseId}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium line-clamp-2">
                            {liveClass.title}
                          </span>
                          <span className="text-xs text-muted-foreground line-clamp-1">
                            {liveClass.description}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1">
                            <CalendarClock className="w-3 h-3" />
                            {formatDateTime(liveClass.scheduledAt)}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="flex items-center gap-1">
                          <Clock3 className="w-3 h-3" />
                          {liveClass.duration} min
                        </span>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge>
                          {getStatusBadge(liveClass)}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          {liveClass.meetingLink && (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="hidden sm:inline-flex"
                            >
                              <a
                                href={liveClass.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Join
                              </a>
                            </Button>
                          )}
                          <Button asChild size="sm" variant="outline">
                            <Link
                              href={`/dashboard/live-class/update/${liveClass.id}`}
                            >
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t text-xs sm:text-sm gap-3 flex-col sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              Page {meta.page} of {totalPages || 1}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AllLiveClass;
