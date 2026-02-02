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

export default function PagePendingReview() {
  const dispatch = useAppDispatch();
  const pagination = useAppSelector((state) => state.submission.pagination);
  const filter = useAppSelector((state) => state.submission.filter);
  const isInitialMount = useRef(true);
  const prevFilterStatus = useRef<string | undefined>(filter.status);
  const prevPage = useRef<number>(pagination.page);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      dispatch(resetPagination());
      dispatch(getPendingSubmissions({ 
        skip: 0, 
        limit: pagination.limit, 
        status: filter.status || undefined 
      }));
      prevFilterStatus.current = filter.status;
      prevPage.current = 1;
      return;
    }

    if (prevFilterStatus.current !== filter.status) {
      prevFilterStatus.current = filter.status;
      dispatch(resetPagination());
      dispatch(getPendingSubmissions({ 
        skip: 0, 
        limit: pagination.limit, 
        status: filter.status || undefined 
      }));
      prevPage.current = 1;
      return;
    }

    if (prevPage.current !== pagination.page && pagination.page > 1) {
      const skip = (pagination.page - 1) * pagination.limit;
      dispatch(getPendingSubmissions({ 
        skip, 
        limit: pagination.limit, 
        status: filter.status || undefined 
      }));
      prevPage.current = pagination.page;
    }
  }, [dispatch, filter.status, pagination.page, pagination.limit]);

  return (
    <div className="h-[calc(100vh-var(--header-height))] overflow-hidden flex flex-col gap-4 p-4 md:gap-6 md:p-6">
      <PendingReviewHeader />
      <PendingReviewFilter />
      <PendingReviewTable />
    </div>
  );
}