"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changePage } from "@/features/submission/submission.slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TablePagination } from "@/components/ui/table-pagination";
import { SubmissionStatus, SubmissionStatusBadge } from "./StatusBadge";
import { formatUTCDate } from "@/lib/utils";

export function PendingReviewTable() {
  const dispatch = useAppDispatch();
  const submissions = useAppSelector((state) => state.submission.submissions);
  const pagination = useAppSelector((state) => state.submission.pagination);
  const filter = useAppSelector((state) => state.submission.filter);
  const requestState = useAppSelector((state) => state.submission.requestState);

  const isLoading =
    requestState.status === "loading" && requestState.type === "getPendingSubmissions";

  // Filter submissions by store name (client-side)
  const filteredSubmissions = useMemo(() => {
    if (!filter.store) return submissions;
    const storeLower = filter.store.toLowerCase();
    return submissions.filter((s) =>
      s.store?.name?.toLowerCase().includes(storeLower)
    );
  }, [submissions, filter.store]);

  const startIndex = (pagination.page - 1) * pagination.limit;
  const displaySubmissions = filteredSubmissions.slice(startIndex, startIndex + pagination.limit);

  const handlePageChange = (newPage: number) => {
    dispatch(changePage(newPage));
  };

  return (
    <Card className="flex flex-col flex-1 min-h-0 pb-0!">
      <CardHeader>
        <CardTitle>Danh sách câu trả lời đang chờ duyệt</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-0 overflow-hidden min-h-0">
        <div className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="border-b px-4">
            <table className="w-full caption-bottom text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center w-10">STT</TableHead>
                  <TableHead className="text-left flex-1">Cửa hàng</TableHead>
                  <TableHead className="text-left w-32">Trạng thái</TableHead>
                  <TableHead className="text-left w-32">Check-in</TableHead>
                  <TableHead className="text-left w-32">Check-out</TableHead>
                  <TableHead className="text-center w-24"></TableHead>
                </TableRow>
              </TableHeader>
            </table>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full caption-bottom text-sm">
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={`pending-skeleton-${index}`}>
                      <TableCell className="text-center w-10">
                        <Skeleton className="h-4 w-10" />
                      </TableCell>
                      <TableCell className="text-left flex-1">
                        <Skeleton className="h-4 w-full flex-1" />
                      </TableCell>
                      <TableCell className="text-left w-32">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-left w-32">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-left w-32">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-center w-24">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : displaySubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Không có submission nào phù hợp
                    </TableCell>
                  </TableRow>
                ) : (
                  displaySubmissions.map((submission, index) => {
                    const actualIndex = startIndex + index + 1;

                    return (
                      <TableRow key={submission._id}>
                        <TableCell className="text-center w-10">
                          {actualIndex}
                        </TableCell>
                        <TableCell className="text-left flex-1">
                          <div className="flex flex-col gap-1">
                            <span>{submission.store?.name || "-"}</span>
                            {submission.store?.location?.address && (
                              <span className="text-xs text-muted-foreground">
                                {submission.store.location.address}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-left w-32">
                          {submission.status ?
                            submission.status === SubmissionStatus.SUBMITTED ? (<SubmissionStatusBadge status={submission.reviewAction} />) : (
                              <SubmissionStatusBadge status={submission.status} />
                            ) : (
                              "-"
                            )}
                        </TableCell>
                        <TableCell className="text-left w-32">
                          {submission.checkinTime
                            ? formatUTCDate(submission.checkinTime, 'HH:mm')
                            : "-"}
                        </TableCell>
                        <TableCell className="text-left w-32">
                          {submission.checkoutTime
                            ? formatUTCDate(submission.checkoutTime, 'HH:mm')
                            : "-"}
                        </TableCell>
                        <TableCell className="text-center w-24">
                          <div className="flex flex-row gap-2 justify-center">
                            <Link href={`/pending-review/${submission._id}`}>
                              <Button variant="outline" size="icon">
                                <Eye className="size-4 text-blue-500" />
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </table>
          </div>
          <TablePagination
            currentPage={pagination.page}
            totalItems={filteredSubmissions.length}
            itemsPerPage={pagination.limit}
            hasMore={pagination.hasMore}
            onLoadMore={() => undefined}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}


