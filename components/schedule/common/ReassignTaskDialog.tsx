"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { Spinner } from "@/components/ui/spinner";
import { useToastContext } from "@/context/ToastContext";
import { getTaskById } from "@/features/schedule/schedule.slice";
import { searchUsers } from "@/features/staffs/staffs.slice";
import { reassignTask } from "@/features/task/task.slice";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Task } from "@/model/Task.model";
import { useState } from "react";

interface ReassignTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReassignTaskDialog({ task, open, onOpenChange }: ReassignTaskDialogProps) {
  const dispatch = useAppDispatch();
  const { error, success } = useToastContext();
  const staffs = useAppSelector((state) => state.staffs.staffs);
  const staffsRequestState = useAppSelector((state) => state.staffs.requestState);
  const [assigneeId, setAssigneeId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentAssigneeId = task.assignee?.id;

  const handleOpenChange = (isOpen: boolean) => {
    if (submitting) return;
    if (isOpen) {
      setAssigneeId("");
      dispatch(searchUsers({ page: 1, limit: 50 } as any));
    }
    onOpenChange(isOpen);
  };

  const handleSearch = (searchValue: string) => {
    const q = searchValue.trim();
    dispatch(searchUsers((q ? { page: 1, q } : { page: 1, limit: 50 }) as any));
  };

  const handleSubmit = async () => {
    if (!assigneeId) {
      error("Vui lòng chọn nhân viên.");
      return;
    }
    setSubmitting(true);
    try {
      await dispatch(reassignTask({ id: task._id, assigneeId })).unwrap();
      await dispatch(getTaskById(task._id)).unwrap();
      success("Thành công", "Đã chuyển lịch trình cho nhân viên mới");
      onOpenChange(false);
    } catch (err: any) {
      error("Thất bại", err?.message || "Chuyển lịch trình thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chuyển lịch trình</DialogTitle>
          <DialogDescription>
            Hiện tại: {task.assignee?.name || "Chưa có"}. Chọn nhân viên mới sẽ thực hiện khảo sát này.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          <Label>Nhân viên</Label>
          <SearchableCombobox
            options={staffs
              .filter((staff) => staff.id !== currentAssigneeId)
              .map((staff) => ({
                value: staff.id,
                label: [staff.code, staff.name].filter(Boolean).join(" - "),
              }))}
            value={assigneeId}
            onChange={setAssigneeId}
            placeholder="Chọn nhân viên"
            className="w-full"
            isLoading={staffsRequestState.status === "loading" && staffsRequestState.type === "searchUsers"}
            onSearch={handleSearch}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" disabled={submitting} onClick={() => handleOpenChange(false)}>
            Huỷ
          </Button>
          <Button disabled={submitting || !assigneeId} onClick={handleSubmit}>
            {submitting && <Spinner className="size-4" />}
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
