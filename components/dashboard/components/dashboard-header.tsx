"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Download,
  Filter,
  Moon,
  MoreHorizontal,
  RefreshCw,
  Search,
  Sun
} from "lucide-react";
import { motion } from "motion/react";
import { memo, useState } from "react";

export const DashboardHeader = memo(() => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  return (
    <header className="bg-background/95 sticky top-0 z-50 flex h-16 w-full shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        
      </div>

      <div className="ml-auto flex items-center gap-2 px-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const root = document.documentElement;
                const currentTheme = root.classList.contains("dark")
                  ? "dark"
                  : "light";
                root.classList.toggle("dark");
                localStorage.setItem(
                  "theme",
                  currentTheme === "dark" ? "light" : "dark",
                );
              }}
            >
              <span className="hidden dark:inline">
                <Sun className="h-4 w-4" />
              </span>
              <span className="dark:hidden">
                <Moon className="h-4 w-4" />
              </span>
            </Button>
          </div>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSearchQuery("")}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button> */}
        </motion.div>
      </div>
    </header>
  );
});

DashboardHeader.displayName = "DashboardHeader";
