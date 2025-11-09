"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  Settings2,
  LayoutDashboard,
  ShoppingCart,
  Rocket,
  Users,
  ExternalLink,
  HeadphonesIcon,
  FileText
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
import { NavDocuments } from "./nav-documents"

const data = {
  teams: [
    {
      name: "X SaaS",
      logo: GalleryVerticalEnd,
      plan: "Partner Portal",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
      isActive: false
    },
    {
      title: "Deployments",
      url: "/deployments",
      icon: Rocket,
      isActive: false,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: Users,
      isActive: false,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: FileText,
      isActive: false,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2
    },
  ],
  documentation: [
    {
      name: "Support",
      url: "https://support.example.com",
      icon: HeadphonesIcon,
    },
    {
      name: "Documentation",
      url: "https://docs.example.com",
      icon: BookOpen,
    },
    {
      name: "API Reference",
      url: "https://api.example.com",
      icon: ExternalLink,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documentation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}