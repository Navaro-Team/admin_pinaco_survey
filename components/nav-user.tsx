"use client"

import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { clearAuthState, logout } from "@/features/auth/auth.slice"
import { useEffect } from "react"
import { useToastContext } from "@/context/ToastContext"
import Link from "next/link"
import { clearUser, setIsLogged } from "@/features/app/app.slice"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { error } = useToastContext();
  const dispatch = useAppDispatch();
  const requestState = useAppSelector((state) => state.auth.requestState);
  const user = useAppSelector((state) => state.app.user);

  const handleLogout = async () => {
    await dispatch(logout())
      .unwrap()
      .then(() => {
        dispatch(clearUser());
        dispatch(setIsLogged(false));
        window.location.href = '/login'
      }).catch((err: any) => {
        console.log('error: ', err)
        dispatch(clearUser());
        dispatch(setIsLogged(false));
        dispatch(clearAuthState());
        window.location.href = '/login'
      });
  }

  useEffect(() => {
    if (requestState?.type === 'logout') {
      switch (requestState?.status) {
        case 'completed':
          dispatch(clearAuthState());
          break;
        case 'failed':
          error("Lỗi", requestState.error || 'Vui lòng thử lại');
          dispatch(clearAuthState());
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestState]);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "")}/assets/${user?.avatar}` || ''} alt={user?.name} />
                <AvatarFallback className="rounded-lg">{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="truncate text-xs">{user?.email || '-'}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={`${process.env.NEXT_PUBLIC_directusApiURL}/assets/${user?.avatar}` || ''} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email || '-'}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/account">
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
