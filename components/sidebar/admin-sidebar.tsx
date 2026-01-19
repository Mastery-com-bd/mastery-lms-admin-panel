/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { navigation } from "@/const/navigation";
import { ChevronRight, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { memo } from "react";
import ToggleButton from "../ui/ToggleButton";
import { Button } from "../ui/button";
import { useUser } from "@/provider/AuthContext";
import { toast } from "sonner";
import { logout } from "@/service/auth";

export const AdminSidebar = memo(() => {
  const pathname = usePathname();
  const { setUser, setIsLoading } = useUser();
  const router = useRouter();

  const handleLogOut = async () => {
    const toastId = toast.loading("Logging out...", { duration: 3000 });
    try {
      const res = await logout();
      if (res.success) {
        setIsLoading(true);
        setUser(null);
        toast.success(res.message, { id: toastId, duration: 3000 });
        router.push("/login");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred during logout.", {
        id: toastId,
        duration: 3000,
      });
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link prefetch={false} href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Mastery LMS</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item, i) => {
                if (item.items) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={item.items.some((subItem) =>
                        pathname.startsWith(subItem.url as string),
                      )}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton asChild tooltip={item.title}>
                            <div className="flex items-center gap-2 w-full">
                              {item.icon && <item.icon className="h-4 w-4" />}
                              <span className="flex-1">{item.title}</span>
                              <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </div>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem, i) => (
                              <SidebarMenuSubItem key={i}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                >
                                  <Link href={subItem.url as string}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url || "#"}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ToggleButton />
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Admin Profile">
              <Link prefetch={false} href="/dashboard/profile">
                <User />
                <span>Admin Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Admin Profile">
              <Button
                variant="ghost"
                onClick={handleLogOut}
                className="cursor-pointer flex items-center justify-start gap-1 pl-1"
              >
                <LogOut />
                <span>Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

AdminSidebar.displayName = "AdminSidebar";
