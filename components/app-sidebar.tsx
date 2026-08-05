"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  Backpack,
  GitBranch,
  BarChart2,
  Tag,
} from "lucide-react"

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const data = {
  teams: [
    {
      name: "Admin Panel",
      plan: "Quản lý khảo sát",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Kênh phân phối",
      url: "/kenh-phan-phoi",
      icon: GitBranch,
    },
    {
      title: "Thị phần sản lượng",
      url: "/thi-phan-san-luong",
      icon: BarChart2,
    },
    {
      title: "Chỉ số giá bán lẻ",
      url: "/chi-so-gia-ban-le",
      icon: Tag,
    },
    {
      title: "Quản lý chiến dịch",
      url: "/campaigns",
      icon: Backpack,
    },
    {
      title: "Quản lý lịch trình",
      url: "/schedule",
      icon: Calendar,
    },
    {
      title: "Danh sách câu trả lời",
      url: "/pending-review",
      icon: FileText,
    },
    // {
    //   title: "Danh sách câu hỏi",
    //   url: "/questions",
    //   icon: List,
    // },
    {
      title: "Danh sách nhân sự",
      url: "/staffs",
      icon: Users,
    },
    {
      title: "Danh sách điểm bán",
      url: "/sales-points",
      icon: FileText,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}