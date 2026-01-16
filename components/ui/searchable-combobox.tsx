"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState, useRef, useCallback } from "react"

export interface SearchableComboboxProps {
  className?: string
  options: { value: string, label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  isLoading?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  onSearch?: (value: string) => void // Callback khi search thay đổi (sau debounce)
  debounceMs?: number // Thời gian debounce (mặc định 300ms)
}

export function SearchableCombobox({
  className,
  options,
  value,
  onChange,
  placeholder = "Select option...",
  isLoading = false,
  searchValue,
  onSearchChange,
  onSearch,
  debounceMs = 300,
}: SearchableComboboxProps) {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value)
  const [internalSearch, setInternalSearch] = useState("")
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    onChange(value)
    setOpen(false)
  }

  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  const displaySearch = searchValue !== undefined
  const currentSearch = displaySearch ? searchValue : internalSearch

  const handleSearchChange = useCallback((newValue: string) => {
    if (displaySearch) {
      onSearchChange?.(newValue)
    } else {
      setInternalSearch(newValue)
    }

    if (onSearch) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        onSearch(newValue)
      }, debounceMs)
    }
  }, [displaySearch, onSearchChange, onSearch, debounceMs])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return (
    <Popover modal={false} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-80 justify-between h-10", className)}>
          <p className="text-sm text-gray-600">{selectedValue
            ? options.find((option) => option.value === selectedValue)?.label
            : placeholder}</p>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        onWheelCapture={(e) => e.stopPropagation()}
        className={cn("p-0 w-(--radix-popper-anchor-width)! pointer-events-auto", className)}>
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder={placeholder}
            value={currentSearch}
            onValueChange={handleSearchChange}
          />
          <CommandList className="max-h-60 overflow-y-auto">
            <CommandEmpty>Không tìm thấy tùy chọn.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}>
                  <div className="flex flex-row justify-between w-full">
                    {option.label}
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === option.value ? "opacity-100" : "opacity-0"
                      )} />
                  </div>
                </CommandItem>
              ))}
              {isLoading && (
                <CommandItem disabled>
                  <div className="flex items-center justify-center w-full py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
                  </div>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

