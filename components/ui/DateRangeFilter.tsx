"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  format,
} from "date-fns";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  dateRange?: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
  className?: string;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  dateRange,
  onDateChange,
  className,
}) => {
  const [open, setOpen] = useState(false);

  const formatDate = (date?: Date): string => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };

  const handleDateChange = (range: DateRange | undefined) => {
    onDateChange(range);
    setOpen(false);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Date Range Picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-12 w-full justify-start text-left font-normal bg-white hover:bg-gray-50"
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="mr-2 w-6 h-6" />
            <div className="flex flex-col items-start">
              {dateRange?.from && dateRange?.to ? (
                <span className="text-sm flex flex-row items-center gap-1">
                  Từ
                  <span>{formatDate(dateRange.from)}</span>{" "}
                  Đến
                  <span>{formatDate(dateRange.to)}</span>
                </span>
              ) : (
                <span className="text-sm">
                  Chọn ngày
                </span>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange as DateRange}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeFilter;
