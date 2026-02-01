"use client";

export function PendingReviewHeader() {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Duyệt khảo sát</h1>
        <p className="text-base text-muted-foreground">
          Xem, lọc và quản lý danh sách các khảo sát đã được gửi về
        </p>
      </div>
      <div />
    </div>
  );
}


