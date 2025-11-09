"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { Button } from "./button";

type InputCalendarProps = {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  inputFormat?: string;
};

export function InputCalendar({
  value,
  onChange,
  placeholder = "Select date",
  disabled,
  inputFormat = "dd/MM/yyyy",
}: InputCalendarProps) {
  const [open, setOpen] = useState(false);
  const [internalDate, setInternalDate] = useState<Date | null>(value ?? null);

  const displayValue = useMemo(() => {
    if (!internalDate) return "";
    try {
      return format(internalDate, inputFormat);
    } catch {
      return format(internalDate, "dd/MM/yyyy");
    }
  }, [internalDate, inputFormat]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <Input
          readOnly
          disabled={disabled}
          value={displayValue}
          placeholder={placeholder}
          onClick={() => !disabled && setOpen(true)}
        />
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-7 w-7"
            aria-label="Open calendar"
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent align="start" className="p-0 w-auto">
        <Calendar
          mode="single"
          selected={internalDate ?? undefined}
          onSelect={(date) => {
            setInternalDate(date ?? null);
            onChange?.(date ?? null);
            setOpen(false);
          }}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  );
}
