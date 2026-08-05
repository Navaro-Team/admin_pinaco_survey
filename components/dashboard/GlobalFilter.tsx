"use client"

import { RotateCcw } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { ComboboxMultiple } from "@/components/ui/combobox-multiple"

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

const REGION_OPTIONS = [
  { value: "", label: "Tất cả khu vực" },
  { value: "mien-nam", label: "Miền Nam" },
  { value: "mien-dong", label: "Miền Đông" },
  { value: "mien-tay", label: "Miền Tây" },
]

const STAFF_OPTIONS = [
  { value: "", label: "Tất cả nhân viên" },
  { value: "nv-01", label: "Nguyễn Văn A" },
  { value: "nv-02", label: "Trần Thị B" },
  { value: "nv-03", label: "Lê Văn C" },
]

const BUSINESS_TYPE_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "chuyen-aq-oto", label: "Chuyên AQ ô tô" },
  { value: "gara-oto", label: "Gara ô tô" },
  { value: "xe-may", label: "Xe máy" },
]

const CATEGORY_OPTIONS = [
  { value: "oto", label: "Ô tô" },
  { value: "xe-may", label: "Xe máy" },
  { value: "xe-tai", label: "Xe tải" },
  { value: "xe-dien", label: "Xe điện" },
]

const DEFAULT_FILTER: GlobalFilterState = {
  region: "",
  staff: "",
  businessType: "",
  categories: [],
}

export function GlobalFilter({ value, onChange }: Props) {
  const handleReset = () => onChange(DEFAULT_FILTER)

  return (
    <div className="bg-white border rounded-xl px-3 py-2.5 mx-2 lg:mx-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-blue-700 uppercase tracking-wide">Bộ lọc toàn cục</h2>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
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
            options={REGION_OPTIONS}
            value={value.region}
            onChange={(v) => onChange({ ...value, region: v })}
            placeholder="Tất cả khu vực"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Nhân viên<span className="text-xs"> (Theo khu vực được chọn)</span></label>
          <Combobox
            className="w-full"
            options={STAFF_OPTIONS}
            value={value.staff}
            onChange={(v) => onChange({ ...value, staff: v })}
            placeholder="Tất cả nhân viên"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Loại hình kinh doanh</label>
          <Combobox
            className="w-full"
            options={BUSINESS_TYPE_OPTIONS}
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
              options={CATEGORY_OPTIONS}
              value={value.categories}
              setValue={(v) =>
                onChange({
                  ...value,
                  categories: typeof v === "function" ? v(value.categories) : v,
                })
              }
              placeholder="Tất cả"
            />
            <span className="text-xs text-gray-500 whitespace-nowrap">{value.categories.length} đã chọn</span>
          </div>
        </div>
      </div>
    </div>
  )
}
