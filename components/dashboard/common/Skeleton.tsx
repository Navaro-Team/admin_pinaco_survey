"use client"

import React from "react"
import { cn } from "@/lib/utils"

// ─── Base block ───────────────────────────────────────────────────────────────

export function SkeletonBlock({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={cn("bg-gray-200 animate-pulse rounded", className)} style={style} />
}

// ─── Card wrapper shared by KPI skeletons ─────────────────────────────────────

function SkeletonCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-xl px-4 py-3 flex flex-col gap-2">
      {children}
    </div>
  )
}

// ─── KPI row — 4 cards ────────────────────────────────────────────────────────

const COL_CLASS: Record<number, string> = {
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
}

export function SkeletonKPIRow({ cols = 4 }: { cols?: number }) {
  return (
    <div className={`grid grid-cols-2 ${COL_CLASS[cols] ?? "lg:grid-cols-4"} gap-3`}>
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonCard key={i}>
          <SkeletonBlock className="h-3.5 w-2/3" />
          <SkeletonBlock className="h-8 w-1/2 mt-1" />
          <SkeletonBlock className="h-3 w-3/4" />
        </SkeletonCard>
      ))}
    </div>
  )
}

// ─── Table — header + N rows ──────────────────────────────────────────────────

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5 flex flex-col gap-2">
      <SkeletonBlock className="h-4 w-48 mb-2" />
      <div className="flex gap-2 mb-1">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBlock key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2 py-1 border-t border-gray-100">
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonBlock
              key={j}
              className={cn("h-4 flex-1", j === 0 ? "w-28" : "")}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Chart panel ──────────────────────────────────────────────────────────────

export function SkeletonChart({ height = 220 }: { height?: number }) {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5 flex flex-col gap-2">
      <SkeletonBlock className="h-4 w-40 mb-1" />
      <SkeletonBlock className="w-full rounded-lg" style={{ height: `${height}px` }} />
    </div>
  )
}

// ─── Donut chart panel ────────────────────────────────────────────────────────

export function SkeletonDonut() {
  return (
    <div className="bg-white border rounded-xl px-4 py-3 flex flex-col items-center gap-3">
      <SkeletonBlock className="h-4 w-40 self-start" />
      <div className="relative">
        <SkeletonBlock className="w-[180px] h-[180px] rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[100px] h-[100px] rounded-full bg-white" />
        </div>
      </div>
      <div className="flex gap-4">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-3 w-24" />
      </div>
    </div>
  )
}

// ─── Radar chart panel ────────────────────────────────────────────────────────

export function SkeletonRadar() {
  return (
    <div className="bg-white border rounded-xl px-3 py-2.5 flex flex-col items-center gap-2">
      <SkeletonBlock className="h-4 w-48 self-start mb-1" />
      <SkeletonBlock className="w-[240px] h-[240px] rounded-full" />
    </div>
  )
}
