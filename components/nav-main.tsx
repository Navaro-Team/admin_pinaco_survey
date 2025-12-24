"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { open } = useSidebar();
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupLabel hidden>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname.includes(item.url);
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                className={`text-sm font-normal p-2! ${isActive ? "bg-blue-100! text-main!" : ""}`}
              >
                <Link className="w-full flex items-center gap-2" href={item.url}>
                  {item.icon && <item.icon className="h-5 w-5" />}
                  {(item.items && item.items.length) || open ? <span>{item.title}</span> : <></>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
