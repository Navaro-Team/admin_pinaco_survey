"use client";
import { useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const isLogged = useSelector((state: any) => state.app.isLogged);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const pathNotNeedAuth = ['/register', '/forgot-password', '/auth/password/reset', '/sso-callback'];
  const pathWaiting = ['/login', '/']

  useEffect(() => {
    if (!isLogged) {
      if (query || pathNotNeedAuth.includes(pathname)) {
        return;
      } else {
        router.push(`/login`);
      }
    } else if (pathWaiting.includes(pathname)) {
      router.push("/dashboard");
    }
  }, [isLogged, pathname, query, router]);

  return isLogged ? <SidebarProvider
    style={
      {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties
    }
  >
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          {children}
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider> : <>{children}</>;
}