"use client"

import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption, Table as TableComponent } from "../ui/table";
import { TablePagination } from "../ui/table-pagination";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changeCampaign, changePage, deleteCampaign, getCampaigns, resetPagination } from "@/features/campaigns/campaigns.slice";
import { Spinner } from "../ui/spinner";
import { useDialog } from "@/hooks/use-dialog";
import { formatDate } from "date-fns";
import { CAMPAIGN_STATUS_LABELS } from "@/lib/campaigns.utils";
import CampaignsSheet from "./CampaignsSheet";

export function Table() {
  const dispatch = useAppDispatch();
  const { showSuccess, showFailed, showInfo, showLoading } = useDialog();

  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);

  const campaigns = useAppSelector((state) => state.campaigns.campaigns);
  const campaign = useAppSelector((state) => state.campaigns.campaign);
  const filter = useAppSelector((state) => state.campaigns.filter);
  const pagination = useAppSelector((state) => state.campaigns.pagination);
  const requestState = useAppSelector((state) => state.campaigns.requestState);
  const isLoading = requestState.status === 'loading' && requestState.type === 'getCampaigns' && requestState.data === true;

  const handleDeleteCampaign = (id: string) => {
    showInfo({
      title: "Xác nhận",
      description: "Bạn có chắc chắn muốn xóa chiến dịch này không?",
      onConfirm() {
        dispatch(deleteCampaign(id));
      },
    });
  }

  const handleLoadMore = () => {
    dispatch(changePage(pagination.page + 1));
    dispatch(getCampaigns({ page: pagination.page + 1, limit: pagination.limit }));
  };

  const itemsPerPage = 10;

  const handlePageChange = (page: number) => {
    const neededItems = page * itemsPerPage;

    if (campaigns.length < neededItems && pagination.hasMore) {
      const itemsNeeded = neededItems - campaigns.length;
      const batchesNeeded = Math.ceil(itemsNeeded / pagination.limit);

      if (batchesNeeded > 0) {
        dispatch(getCampaigns({ page: 1, limit: pagination.limit }));
      }
    }

    dispatch(changePage(page));
  };
  const startIndex = (pagination.page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayCampaigns = campaigns.slice(startIndex, endIndex);

  useEffect(() => {
    if (!requestState.type) return;
    if (['deleteCampaign', 'createCampaign', 'updateCampaign'].includes(requestState.type)) {
      const action = requestState.type === 'deleteCampaign' ? 'xóa' : requestState.type === 'createCampaign' ? 'tạo' : 'cập nhật';
      switch (requestState.status) {
        case 'completed':
          showSuccess({
            title: "Thành công",
            description: "Chiến dịch đã được " + action + " thành công.",
            onConfirm() {
              dispatch(resetPagination());
              dispatch(getCampaigns({ page: 1, limit: pagination.limit }));
              setIsSheetOpen(false);
            },
          });
          break;
        case 'failed':
          showFailed({
            title: "Lỗi khi " + action + " chiến dịch",
            description: requestState.error || "Có lỗi xảy ra. Vui lòng thử lại.",
            onConfirm() {
              dispatch(resetPagination());
              dispatch(getCampaigns({ page: 1, limit: pagination.limit }));
              setIsSheetOpen(false);
            },
          });
          break;
        case 'loading':
          showLoading({
            title: "Đang xử lý",
            description: "Vui lòng chờ trong giây lát...",
          });
          break;
      }
    }
  }, [requestState]);

  useEffect(() => {
    dispatch(resetPagination());
    dispatch(getCampaigns({ search: filter.search, status: filter.status, page: pagination.page, limit: pagination.limit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.search, filter.status]);

  useEffect(() => {
    if (!isSheetOpen) {
      dispatch(changeCampaign(null));
    }
  }, [isSheetOpen, setIsSheetOpen]);

  return (
    <Card className="@container/table-card flex flex-col min-h-0 pb-0! gap-2! w-full">
      <CardHeader>
        <CardTitle>Danh sách chiến dịch</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 overflow-hidden min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Spinner className="size-6" />
          </div>
        ) : (
          <>
            <TableComponent className="w-full">
              <TableCaption hidden>A list of your recent invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center w-10">STT</TableHead>
                  <TableHead className="text-left w-40">Tên chiến dịch</TableHead>
                  <TableHead className="text-left w-full">Mô tả</TableHead>
                  <TableHead className="text-left w-40">Trạng thái</TableHead>
                  <TableHead className="text-left w-40">Ngày tạo</TableHead>
                  <TableHead className="text-center w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayCampaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  displayCampaigns.map((campaign, index) => (
                    <TableRow key={campaign._id}>
                      <TableCell className="text-center w-10">{startIndex + index + 1}</TableCell>
                      <TableCell className="text-left w-40">{campaign.campaignName || "-"}</TableCell>
                      <TableCell className="text-left w-full">{campaign.description || "-"}</TableCell>
                      <TableCell className="text-left w-40">{CAMPAIGN_STATUS_LABELS[campaign.status as keyof typeof CAMPAIGN_STATUS_LABELS] || "-"}</TableCell>
                      <TableCell className="text-left w-40">{formatDate(campaign.createdAt, "dd/MM/yyyy") || "-"}</TableCell>
                      <TableCell className="text-center w-24">
                        <div className="flex flex-row gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              dispatch(changeCampaign(campaign));
                              setIsSheetOpen(true);
                            }}>
                            <Eye className="size-4 text-blue-500" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteCampaign(campaign._id)}>
                            <Trash2 className="size-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </TableComponent>
            <TablePagination
              currentPage={pagination.page}
              totalItems={campaigns.length}
              itemsPerPage={itemsPerPage}
              hasMore={pagination.hasMore}
              onLoadMore={handleLoadMore}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </>
        )}
        <CampaignsSheet
          campaign={campaign}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        />
      </CardContent>
    </Card>
  )
}

