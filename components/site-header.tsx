
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function SiteHeader() {
  const pathname = usePathname()

  const formatTitleFromPathname = (path: string) => {
    const cleaned = path.replace(/\//g, " ").replace(/\-/g, " ").trim()
    if (cleaned.length === 0) return "Dashboard"
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase()
  }

  return (
    <header className="flex h-(--header-height) sticky top-0 bg-white shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{formatTitleFromPathname(pathname)}</h1>
        <div className="ml-auto flex items-center gap-2">
          
        </div>
      </div>
    </header>
  )
}
