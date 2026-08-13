"use client"

import { RotateCcw } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { ComboboxMultiple } from "@/components/ui/combobox-multiple"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { SearchableCombobox } from "../ui/searchable-combobox"
import { User } from "@/model/User.model"
import { searchUsers, getEmployeesByArea } from "@/features/staffs/staffs.slice"
import { useEffect } from "react"
import { getAreas } from "@/features/dashboard/dashboard.slice"
import { BUSINESS_TYPES, PRODUCT_CATEGORIES } from "@/utils/survey-constants"

export type GlobalFilterState = {
  region: string
  staff: string
  businessType: string
  categories: string[]
}

type Props = {
  value: GlobalFilterState
  onChange: (value: GlobalFilterState) => void
}

const DEFAULT_FILTER: GlobalFilterState = {
  region: "",
  staff: "",
  businessType: "",
  categories: [],
}

export function GlobalFilter({ value, onChange }: Props) {
  const handleReset = () => onChange(DEFAULT_FILTER);
  const dispatch = useAppDispatch();

  const areas = useAppSelector(state => state.dashboard.areas);
  const staffs = useAppSelector((state) => state.staffs.staffs);
  const employees = useAppSelector((state) => state.staffs.employees);
  const staffsRequestState = useAppSelector((state) => state.staffs.requestState);
  const dashboardState = useAppSelector((state) => state.dashboard.requestState);

  const hasRegion = !!value.region;
  const staffOptions = hasRegion
    ? employees.map(e => ({ value: e.id, label: [e.code, e.name].filter(Boolean).join(' - ') }))
    : staffs.map((s: User) => ({ value: s.id, label: [s.code, s.name].filter(Boolean).join(' - ') }));

  const isStaffLoading =
    (staffsRequestState.status === 'loading' && staffsRequestState.type === 'searchUsers') ||
    (staffsRequestState.status === 'loading' && staffsRequestState.type === 'getEmployeesByArea');

  const handleSearchStaffs = (searchValue: string) => {
    if (hasRegion) return;
    const trimmedSearch = searchValue.trim();
    const params: any = { page: 1 };
    if (trimmedSearch) {
      params.q = trimmedSearch;
    } else {
      params.limit = 50;
    }
    dispatch(searchUsers(params));
  };

  const handleChangeStaff = (userId: string) => {
    const pool = hasRegion ? employees : staffs;
    const selectedStaff = pool.find((s: User) => s?.id === userId);
    if (selectedStaff) {
      onChange({ ...value, staff: selectedStaff.id });
    } else {
      onChange({ ...value, staff: "" });
    }
  };

  // Load danh sách nhân viên khi region thay đổi
  useEffect(() => {
    if (value.region) {
      dispatch(getEmployeesByArea(value.region) as any);
      // reset staff nếu không còn trong danh sách khu vực mới
      onChange({ ...value, staff: "" });
    }
  }, [value.region]);

  useEffect(() => {
    dispatch(getAreas({}))
  }, [])

  return (
    <div className="bg-white border rounded-xl px-3 py-2.5 mx-2 lg:mx-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-blue-700 uppercase tracking-wide">Bộ lọc toàn cục</h2>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          Đặt lại
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Khu vực</label>
          <Combobox
            className="w-full"
            disabled={dashboardState.status === "loading" && dashboardState.type === "getAreas"}
            options={areas.map(area => ({ label: area, value: area }))}
            value={value.region}
            onChange={(v) => onChange({ ...value, region: v })}
            placeholder="Tất cả khu vực"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">
            Nhân viên
            {hasRegion
              ? <span className="text-xs text-blue-500"> (theo khu vực)</span>
              : <span className="text-xs text-gray-400"> (tìm kiếm)</span>
            }
          </label>
          <SearchableCombobox
            options={staffOptions}
            value={value.staff}
            onChange={handleChangeStaff}
            placeholder="Tất cả nhân viên"
            className="w-full"
            isLoading={isStaffLoading}
            onSearch={handleSearchStaffs}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Loại hình kinh doanh</label>
          <Combobox
            className="w-full"
            options={BUSINESS_TYPES.map(bt => ({ label: bt.text, value: bt.code }))}
            value={value.businessType}
            onChange={(v) => onChange({ ...value, businessType: v })}
            placeholder="Tất cả"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Ngành hàng</label>
          <div className="flex items-center gap-1">
            <ComboboxMultiple
              className="w-full flex-1"
              options={PRODUCT_CATEGORIES.map(pc => ({ label: pc.categoryName, value: pc.category }))}
              value={value.categories}
              setValue={(v) =>
                onChange({
                  ...value,
                  categories: typeof v === "function" ? v(value.categories) : v,
                })
              }
              placeholder="Tất cả"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
