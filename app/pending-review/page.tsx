"use client";

import { useEffect, useRef } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  getPendingSubmissions,
  resetPagination
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
    const skip = (pagination.page - 1) * pagination.limit;
    dispatch(getPendingSubmissions({ skip, limit: pagination.limit, status: filter.status || undefined, createdAt: formatDate(filter.createdAt, "yyyy-MM-dd") }));
  }, [dispatch, pagination.page, pagination.limit, filter.status, filter.createdAt]);

  return (
    <div className="h-[calc(100vh-var(--header-height))] overflow-hidden flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <PendingReviewHeader />
      <PendingReviewFilter />
      <PendingReviewTable />
    </div>
  );
}