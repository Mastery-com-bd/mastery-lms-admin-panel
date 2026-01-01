import { DashboardHeader } from "@/components/dashboard/components/dashboard-header";
import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <DashboardHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
