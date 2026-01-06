"use client"

import { useEffect } from "react";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { TablePagination } from "../ui/table-pagination";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changePage, clearSalesPointsState, deleteStore, getStores, resetPagination } from "@/features/sales-points/sales-points.slice";
import { Spinner } from "../ui/spinner";
import { useDialog } from "@/hooks/use-dialog";

export function Table() {
  const dispatch = useAppDispatch();
  const { showSuccess, showFailed, showInfo, showLoading } = useDialog();

  const stores = useAppSelector((state) => state.salesPoints.stores);
  const filter = useAppSelector((state) => state.salesPoints.filter);
  const pagination = useAppSelector((state) => state.salesPoints.pagination);
  const requestState = useAppSelector((state) => state.salesPoints.requestState);

  const isLoading = requestState.status === 'loading' && requestState.type === 'getStores' && requestState.data === true;
  const error = requestState.status === 'failed' && requestState.type === 'getStores' ? requestState.error : null;

  useEffect(() => {
    dispatch(resetPagination());
    dispatch(getStores({ page: pagination.page, limit: pagination.limit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(resetPagination());
    dispatch(getStores({ page: pagination.page, limit: pagination.limit }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.search, filter.area]);

  const filteredStores = stores.filter((store) => {
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      const nameMatch = store.name?.toLowerCase().includes(searchLower);
      const codeMatch = store.code?.toLowerCase().includes(searchLower);
      if (!nameMatch && !codeMatch) {
        return false;
      }
    }

    if (filter.area) {
      if (store.area !== filter.area) {
        return false;
      }
    }

    return true;
  });

  const handleDeleteStore = (id: string) => {
    showInfo({
      title: "Xác nhận",
      description: "Bạn có chắc chắn muốn xóa điểm bán này không?",
      onConfirm() {
        dispatch(deleteStore(id));
      },
    });
  }

  const handleLoadMore = () => {
    dispatch(changePage(pagination.page + 1));
    dispatch(getStores({ page: pagination.page + 1, limit: pagination.limit }));
  };

  const itemsPerPage = 10;

  const handlePageChange = (page: number) => {
    const neededItems = page * itemsPerPage;

    if (stores.length < neededItems && pagination.hasMore) {
      const itemsNeeded = neededItems - stores.length;
      const batchesNeeded = Math.ceil(itemsNeeded / pagination.limit);

      if (batchesNeeded > 0) {
        dispatch(getStores({ page: 1, limit: pagination.limit }));
      }
    }

    dispatch(changePage(page));
  };
  const startIndex = (pagination.page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayStores = filteredStores.slice(startIndex, endIndex);

  useEffect(() => {
    if (!requestState.type) return;
    if (['deleteStore'].includes(requestState.type)) {
      switch (requestState.status) {
        case 'completed':
          showSuccess({
            title: "Thành công",
            description: "Điểm bán đã được xóa thành công.",
            onConfirm() {
              dispatch(resetPagination());
              dispatch(getStores({ page: 1, limit: pagination.limit }));
            },
          });
          break;
        case 'failed':
          showFailed({
            title: "Lỗi khi xóa điểm bán",
            description: requestState.error || "Có lỗi xảy ra. Vui lòng thử lại.",
            onConfirm() {
              dispatch(resetPagination());
              dispatch(getStores({ page: 1, limit: pagination.limit }));
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

  const getAddress = (store: any) => {
    if (store.location?.address) {
      return store.location.address;
    }
    if (store.province) {
      return store.province;
    }
    return "-";
  };

  return (
    <Card className="flex flex-col flex-1 min-h-0 pb-0!">
      <CardHeader>
        <CardTitle>Danh sách điểm bán</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-0 overflow-hidden min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Spinner className="size-6" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center flex-1 text-red-500">
            {error}
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden min-h-0">
            <div className="border-b px-4">
              <table className="w-full caption-bottom text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-10">STT</TableHead>
                    <TableHead className="text-left w-30">Mã điểm bán</TableHead>
                    <TableHead className="text-left flex-1">Tên cửa hàng</TableHead>
                    <TableHead className="text-left w-64">Địa chỉ</TableHead>
                    <TableHead className="text-left w-32">Khu vực</TableHead>
                    <TableHead className="text-left w-32">Số điện thoại</TableHead>
                    <TableHead className="text-center w-24"></TableHead>
                  </TableRow>
                </TableHeader>
              </table>
            </div>
            <div className="flex-1 overflow-y-auto min-h-0 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full caption-bottom text-sm">
                <TableBody>
                  {displayStores.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayStores.map((store, index) => (
                      <TableRow key={store.id}>
                        <TableCell className="text-center w-10">{startIndex + index + 1}</TableCell>
                        <TableCell className="text-left w-30">{store.code || "-"}</TableCell>
                        <TableCell className="text-left flex-1">{store.name || "-"}</TableCell>
                        <TableCell className="text-left w-64">
                          <span className="text-sm">{getAddress(store)}</span>
                        </TableCell>
                        <TableCell className="text-left w-32">{store.area || "-"}</TableCell>
                        <TableCell className="text-left w-32">{store.phone || "-"}</TableCell>
                        <TableCell className="text-center w-24">
                          <div className="flex flex-row gap-2 justify-center">
                            <Link href={`/sales-points/${store.id}`}>
                              <Button variant="outline" size="icon">
                                <Eye className="size-4 text-blue-500" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteStore(store.id)}>
                              <Trash2 className="size-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </table>
            </div>
            <TablePagination
              currentPage={pagination.page}
              totalItems={stores.length}
              itemsPerPage={itemsPerPage}
              hasMore={pagination.hasMore}
              onLoadMore={handleLoadMore}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

