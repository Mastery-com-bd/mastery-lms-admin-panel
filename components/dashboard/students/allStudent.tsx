"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  CloudDownload,
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePhoto: string;
  address: string;
  role: string;
  status: string;
  dateOfBirth: string;
  isEmailVerified: boolean;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

const AllStudent = ({ users, meta }: { users: User[]; meta: Meta }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derived state from URL
  const page = Number(searchParams.get("page")) || 1;
  const searchTermParam = searchParams.get("searchTerm") || "";
  const statusFilter = searchParams.get("status") || "all";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  // Local state for search input
  const [searchTerm, setSearchTerm] = useState(searchTermParam);

  // Sync local search term with URL param
  useEffect(() => {
    setSearchTerm(searchTermParam);
  }, [searchTermParam]);

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== searchTermParam) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchTerm) {
          params.set("searchTerm", searchTerm);
        } else {
          params.delete("searchTerm");
        }
        params.set("page", "1"); // Reset page on search
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, router, pathname, searchParams, searchTermParam]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortBy === field) {
      params.set("sortOrder", sortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortBy", field);
      params.set("sortOrder", "asc");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  const totalPages = meta?.total
    ? Math.ceil(meta.total / (meta.limit || 10))
    : 1;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <h1 className="text-2xl font-semibold tracking-tight">
          List of students
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </motion.div>

      <Card className="border-none shadow-sm">
        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between border-b"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center flex-1">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name or email..."
                className="pl-9 bg-muted/30 border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full md:w-40 border-none bg-muted/30">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="BLOCKED">Blocked</SelectItem>
              </SelectContent>
            </Select>

            {/* Email Verified Filter */}
            <Select
              value={searchParams.get("isEmailVerified") || "all"}
              onValueChange={(value) =>
                handleFilterChange("isEmailVerified", value)
              }
            >
              <SelectTrigger className="w-full md:w-40 border-none bg-muted/30">
                <SelectValue placeholder="Email Verified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Not Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative w-full overflow-auto"
        >
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("fullName")}
                    className="flex items-center gap-1 p-0 hover:bg-transparent"
                  >
                    Name
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("email")}
                    className="flex items-center gap-1 p-0 hover:bg-transparent"
                  >
                    Email
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Address
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Date of birth
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Phone
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
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No students found.
                  </td>
                </tr>
              ) : (
                users.map((student, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                    key={student.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                          {student.profilePhoto ? (
                            <Image
                              src={student.profilePhoto}
                              alt={student.fullName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-medium">
                              {student.fullName?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {student.fullName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      <div className="flex flex-col">
                        <span>{student.email}</span>
                        {student.isEmailVerified && (
                          <span className="text-[10px] text-green-600 font-medium flex items-center gap-0.5">
                            Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-muted-foreground whitespace-nowrap">
                      {student.address || "N/A"}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {student.dateOfBirth
                        ? new Date(student.dateOfBirth).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-4 align-middle text-muted-foreground">
                      {student.phoneNumber || "N/A"}
                    </td>
                    <td className="p-4 align-middle">
                      <Badge
                        variant={
                          student.status === "ACTIVE"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {student.status}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit student</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-t">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AllStudent;
