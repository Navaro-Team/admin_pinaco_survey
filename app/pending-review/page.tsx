"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  getPendingSubmissions,
} from "@/features/submission/submission.slice";
import { PendingReviewHeader } from "@/components/pending-review/Header";
import { PendingReviewFilter } from "@/components/pending-review/Filter";
import { PendingReviewTable } from "@/components/pending-review/Table";
import { formatDate } from "date-fns";

export default function PagePendingReview() {
  const dispatch = useAppDispatch();
  const pagination = useAppSelector((state) => state.submission.pagination);
  const filter = useAppSelector((state) => state.submission.filter);

  useEffect(() => {
    dispatch(getPendingSubmissions({
      page: pagination.page,
      limit: pagination.limit,
      q: filter.store || undefined,
      area: filter.area || undefined,
      status: filter.status || undefined,
      dateRange: {
        from: filter.dateRange?.from ? formatDate(filter.dateRange.from, "yyyy-MM-dd") : undefined,
        to: filter.dateRange?.to ? formatDate(filter.dateRange.to, "yyyy-MM-dd") : undefined,
      },
    }));
  }, [dispatch, pagination.page, pagination.limit, filter.store, filter.area, filter.status, filter.dateRange]);

  return (
    <div className="h-[calc(100vh-var(--header-height))] overflow-hidden flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <PendingReviewHeader />
      <PendingReviewFilter />
      <PendingReviewTable />
    </div>
  );
}