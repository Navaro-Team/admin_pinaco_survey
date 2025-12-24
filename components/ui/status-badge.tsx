"use client"

import { Badge } from "./badge";
import { cn } from "@/lib/utils";

export enum Status {
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS",
  OVERDUE = "OVERDUE",
  PENDING = "PENDING",
}

interface StatusBadgeProps {
  status: Status | string;
  className?: string;
}

const statusConfig: Record<Status, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }> = {
  [Status.COMPLETED]: { label: "Đã hoàn thành", variant: "default", color: "bg-green-500 text-white" },
  [Status.IN_PROGRESS]: { label: "Sắp diễn ra", variant: "secondary", color: "bg-yellow-500 text-white" },
  [Status.PENDING]: { label: "Đã gửi yêu cầu hỗ trợ", variant: "outline", color: "bg-blue-500 text-white" },
  [Status.OVERDUE]: { label: "Quá hạn khảo sát", variant: "destructive", color: "bg-red-500 text-white" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as Status];

  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} className={cn(className, config.color)}>
      {config.label}
    </Badge>
  );
}

