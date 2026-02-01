"use client";

import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { 
  getPendingSubmissions, 
  resetPagination
} from "@/features/submission/submission.slice";
import { PendingReviewHeader } from "@/components/pending-review/Header";
import { PendingReviewFilter } from "@/components/pending-review/Filter";
import { PendingReviewTable } from "@/components/pending-review/Table";

export default function PagePendingReview() {
  const dispatch = useAppDispatch();
  const pagination = useAppSelector((state) => state.submission.pagination);
  const filter = useAppSelector((state) => state.submission.filter);

  // Load initial data
  useEffect(() => {
    dispatch(resetPagination());
    dispatch(getPendingSubmissions({ 
      skip: 0, 
      limit: pagination.limit, 
      status: filter.status || undefined 
    }));
  }, []);

  // Reload when filter changes
  useEffect(() => {
    dispatch(resetPagination());
    dispatch(getPendingSubmissions({ 
      skip: 0, 
      limit: pagination.limit, 
      status: filter.status || undefined 
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.status]);

  // Load more when page changes (if not page 1)
  useEffect(() => {
    if (pagination.page > 1) {
      const skip = (pagination.page - 1) * pagination.limit;
      dispatch(getPendingSubmissions({ 
        skip, 
        limit: pagination.limit, 
        status: filter.status || undefined 
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page]);

  return (
    <div className="h-[calc(100vh-var(--header-height))] overflow-hidden flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <PendingReviewHeader />
      <PendingReviewFilter />
      <PendingReviewTable />
    </div>
  );
}