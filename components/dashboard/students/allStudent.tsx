"use client";

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
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CloudDownload,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";

// Mock Data
const MOCK_STUDENTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  status: i % 3 === 0 ? "Failed" : "Passed",
  roll: `%0${(i + 1).toString().padStart(2, "0")}`,
  address: "TA-107 Newyork",
  class: "01",
  dob: "02/05/2001",
  phone: "+12313546",
  avatar: `https://i.pravatar.cc/150?u=${i + 1}`,
}));

const TABS = ["cat1", "cat2", "cat3", "cat4"];

const AllStudent = () => {
  const [activeTab, setActiveTab] = useState("cat1");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
          <Button
            variant="outline"
            className="gap-2 bg-emerald-900 text-white hover:bg-emerald-800 hover:text-white border-none"
          >
            <CloudDownload className="h-4 w-4" />
            Students
          </Button>
          <Button className="gap-2 bg-emerald-900 text-white hover:bg-emerald-800">
            <Plus className="h-4 w-4" />
            Students
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
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-62.5">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name"
                className="pl-9 bg-muted/30 border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <Button
              variant="outline"
              className="gap-2 border-none bg-muted/30 text-muted-foreground font-normal"
            >
              Class 9
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-none bg-muted/30 text-muted-foreground font-normal"
            >
              <Calendar className="h-4 w-4 opacity-50" />
              Last 30 days
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Filter className="h-4 w-4" />
            </Button>
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
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Roll
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Address
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Class
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Date of birth
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Phone
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {MOCK_STUDENTS.map((student, idx) => (
                <motion.tr
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                  key={student.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{student.name}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline-block">
                          {student.status === "Failed" && (
                            <span className="text-red-500">Failed</span>
                          )}
                        </span>
                      </div>
                      {/* Mobile Only Status - if needed layout adjustment */}
                    </div>
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {student.roll}
                  </td>
                  <td className="p-4 align-middle text-muted-foreground whitespace-nowrap">
                    {student.address}
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {student.class}
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {student.dob}
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {student.phone}
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
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Pagination */}
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between border-t">
          <div className="text-sm text-muted-foreground">
            1 of 12 members shows
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              <Button
                variant={currentPage === 1 ? "outline" : "ghost"}
                size="sm"
                className={`h-8 w-8 p-0 ${
                  currentPage === 1
                    ? "bg-white text-black border-slate-200"
                    : "text-muted-foreground"
                }`}
                onClick={() => setCurrentPage(1)}
              >
                1
              </Button>
              <Button
                variant={currentPage === 2 ? "outline" : "ghost"}
                size="sm"
                className={`h-8 w-8 p-0 ${
                  currentPage === 2
                    ? "bg-white text-black border-slate-200"
                    : "text-muted-foreground"
                }`}
                onClick={() => setCurrentPage(2)}
              >
                2
              </Button>
              <Button
                variant={currentPage === 3 ? "outline" : "ghost"}
                size="sm"
                className={`h-8 w-8 p-0 ${
                  currentPage === 3
                    ? "bg-white text-black border-slate-200"
                    : "text-muted-foreground"
                }`}
                onClick={() => setCurrentPage(3)}
              >
                3
              </Button>
              <span className="text-muted-foreground px-2">...</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
              onClick={() => setCurrentPage((p) => p + 1)}
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
