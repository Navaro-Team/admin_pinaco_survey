"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export enum SubmissionStatus {
  SUBMITTED = "SUBMITTED",
  SUPERSEDED = "SUPERSEDED",
  DELETED = "DELETED",
  RESURVEY_REJECTED = "RESURVEY_REJECTED",
  PENDING_REVIEW = "PENDING_REVIEW",
  REJECTED_REVIEW = "REJECTED_REVIEW",
  APPROVED = "APPROVED",
}

interface SubmissionStatusBadgeProps {
  status: SubmissionStatus | string;
  className?: string;
}

const statusConfig: Record<
  SubmissionStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    color: string;
  }
> = {
  [SubmissionStatus.SUBMITTED]: {
    label: "Đã gửi",
    variant: "default",
    color: "bg-green-500 hover:bg-green-600 text-white",
  },
  [SubmissionStatus.SUPERSEDED]: {
    label: "Đã thay thế",
    variant: "secondary",
    color: "bg-gray-500 hover:bg-gray-600 text-white",
  },
  [SubmissionStatus.DELETED]: {
    label: "Đã xóa",
    variant: "destructive",
    color: "bg-red-500 hover:bg-red-600 text-white",
  },
  [SubmissionStatus.RESURVEY_REJECTED]: {
    label: "Đã bị từ chối khảo sát lại",
    variant: "destructive",
    color: "bg-orange-500 hover:bg-orange-600 text-white",
  },
  [SubmissionStatus.PENDING_REVIEW]: {
    label: "Đang chờ duyệt",
    variant: "outline",
    color: "bg-yellow-500 hover:bg-yellow-600 text-white",
  },
  [SubmissionStatus.REJECTED_REVIEW]: {
    label: "Đã bị từ chối",
    variant: "destructive",
    color: "bg-red-600 hover:bg-red-700 text-white",
  },
  [SubmissionStatus.APPROVED]: {
    label: "Đã phê duyệt",
    variant: "default",
    color: "bg-green-500 hover:bg-green-600 text-white"
  }
};

export function SubmissionStatusBadge({
  status,
  className,
}: SubmissionStatusBadgeProps) {
  const config = statusConfig[status as SubmissionStatus];

  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        {status}
      </Badge>
    );
  }

  return (
    <Badge
      variant={config.variant}
      className={cn(className, config.color)}
    >
      {config.label}
    </Badge>
  );
}

