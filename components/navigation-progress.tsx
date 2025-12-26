"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Start loading when route changes
    setLoading(true)

    // Hide loading after a short delay to allow navigation to complete
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 250)

    return () => {
      clearTimeout(timeout)
    }
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
      <Spinner className="size-12 text-main" />
    </div>
  )
}

