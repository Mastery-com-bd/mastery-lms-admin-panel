'use client';

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
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  Bell,
  FileText,
  Headset,
  LayoutDashboard,
  LightbulbIcon,
  Moon,
  Settings,
  Sun,
  User,
  Users,
  Video
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { memo } from 'react';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { title: 'Payments', icon: BarChart3, href: '/dashboard/analytics' },
  { title: 'Students', icon: Users, href: '/dashboard/students' },
  { title: 'Courses', icon: FileText, href: '/dashboard/content' },
  { title: 'Quiz', icon: LightbulbIcon, href: '/dashboard/quiz' },
  { title: 'Supports', icon: Headset, href: '/dashboard/supports' },
  { title: 'Live', icon: Video, href: '/dashboard/database' },
  { title: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
  { title: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export const AdminSidebar = memo(() => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link prefetch={false} href="#dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Mastary LMS</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem  key={item.href}>
                    <SidebarMenuButton  className={`${pathname === item.href ? 'bg-primary text-white border rounded-md' : ''} hover:bg-primary/70 hover:text-white`} asChild>
                      <Link prefetch={false} href={item.href}>
                        <Icon />
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
            <SidebarMenuButton
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link prefetch={false} href="#profile">
                <User />
                <span>Admin Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
});

AdminSidebar.displayName = 'AdminSidebar';
