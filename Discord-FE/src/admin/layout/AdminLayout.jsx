import * as React from "react";
import { Command, ImageOff, Server, User, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuItem,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../../components/ui/sidebar";
import { Separator } from "../../../components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb";

import { NavMain } from "../components/nav-main";
import { NavSecondary } from "../components/nav-secondary";
import { NavUser } from "../components/nav-user";

import {
  ChartColumnIncreasing,
  CircleUserRound,
  Utensils,
  LifeBuoy,
  Send,
} from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    role: "Admin",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navManagement: [
    { title: "Thống kê", url: "/dashboard", icon: ChartColumnIncreasing },
    { title: "Quản lý người dùng", url: "/users-management", icon: Users },
    { title: "Quản lý server", url: "/servers-management", icon: Server },
  ],
  navSecondary: [
    { title: "Hướng dẫn sử dụng!", url: "#", icon: LifeBuoy },
    { title: "Báo cáo lỗi", url: "#", icon: Send },
  ],
};

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <SidebarProvider>
        <Sidebar variant="inset"  collapsible="none">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem size="lg">
                <span>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">EchoNet</span>
                  </div>
                </span>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <NavMain items={data.navManagement} title="Quản lý" />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </SidebarContent>
          <SidebarFooter>
            <NavUser user={data.user} />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
