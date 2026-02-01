"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Search,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

const AllLiveClass = ({
  liveClasses,
  meta,
}: {
  liveClasses: LiveClass[];
  meta: Meta;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  
  // Derived state from URL params
  const courseFilter = searchParams.get("courseId") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("searchTerm", searchTerm);
      } else {
        params.delete("searchTerm");
      }
      
      // Only push if changed
      if (params.get("searchTerm") !== (searchParams.get("searchTerm") || null)) {
        params.set("page", "1"); // Reset to page 1 on search
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, router, pathname, searchParams]);

  // Fetch courses for filter (Client-side as requested)
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

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortOrder", newOrder);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <Select
                value={courseFilter}
                onValueChange={(value) => handleFilterChange("courseId", value)}
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
                onValueChange={(value) => handleFilterChange("status", value)}
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
                  onClick={handleSortChange}
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
              disabled={meta.page <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= totalPages}
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
