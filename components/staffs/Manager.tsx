import React, { useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { Label } from '../ui/label';
import { SearchableCombobox } from '../ui/searchable-combobox';
import { changeManager, searchUsers, updateUserManager } from '@/features/staffs/staffs.slice';
import { User } from '@/model/User.model';
import { useParams } from 'next/navigation';
import { useDialog } from '@/hooks/use-dialog';

export default function Manager() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const dispatch = useAppDispatch();
  const { showSuccess, showFailed, showLoading } = useDialog();
  const manager = useAppSelector((state) => state.staffs.manager);
  const staffs = useAppSelector((state) => state.staffs.staffs);
  const managerRequestState = useAppSelector((state) => state.staffs.requestState);
  const staffsRequestState = useAppSelector((state) => state.staffs.requestState);
  const isSubmitting = managerRequestState.status === 'loading' && managerRequestState.type === 'updateUserManager';

  const handleUpdateManager = () => {
    if (!id) return;
    if (!manager?.id) return;
    dispatch(updateUserManager({ id: id, managerId: manager.id }));
  };

  const handleChangeManager = (value: string) => {
    const selectedStaff = staffs.find((staff: User) => staff?.id === value);
    if (selectedStaff) {
      dispatch(changeManager(selectedStaff));
    } else {
      dispatch(changeManager(null));
    }
  };

  const handleSearchManagers = (searchValue: string) => {
    const trimmedSearch = searchValue.trim();
    const params: any = {
      page: 1,
    };

    if (trimmedSearch) {
      params.q = trimmedSearch;
    } else {
      params.limit = 50;
    }

    dispatch(searchUsers(params));
  };

  useEffect(() => {
    dispatch(searchUsers({ page: 1, limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    if (managerRequestState.type == 'updateUserManager') {
      switch (managerRequestState.status) {
        case 'completed':
          const responseData = managerRequestState.data;
          const manager = staffs.find((staff: User) => staff?.id === responseData?.managerId);
          if (manager) {
            dispatch(changeManager(manager));
          } else {
            dispatch(changeManager(null));
          }
          showSuccess({
            title: "Thành công",
            description: "Quản lý đã được cập nhật thành công.",
          });
          break;
        case 'failed':
          showFailed({
            title: "Lỗi khi cập nhật quản lý",
            description: managerRequestState.error || "Có lỗi xảy ra. Vui lòng thử lại.",
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

  }, [managerRequestState, dispatch, id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin người quản lý</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-0!">
        <div className="flex flex-row gap-2 justify-start items-center md:w-1/2 w-full">
          <Label htmlFor="managerId" className="text-sm w-fit">
            Quản lý:
          </Label>
          <SearchableCombobox
            options={staffs.map(staff => ({
              value: staff.id,
              label: [staff.code, staff.name].filter(Boolean).join(' - '),
            }))}
            value={manager?.id || ""}
            onChange={handleChangeManager}
            placeholder="Chọn quản lý"
            className="flex-1"
            isLoading={staffsRequestState.status === 'loading' && staffsRequestState.type === 'searchUsers'}
            onSearch={handleSearchManagers}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          className="bg-main text-white hover:bg-main/90"
          disabled={isSubmitting}
          onClick={handleUpdateManager}
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2" />
              Đang xử lý...
            </>
          ) : (
            "Cập nhật"
          )}
        </Button>
      </CardFooter>
    </Card >
  )
}