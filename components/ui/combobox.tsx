"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

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
import { useEffect, useState } from "react"

export function Combobox({
  className,
  options,
  value,
  onChange,
  placeholder = "Select option...",
}: {
  className?: string
  options: { value: string, label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value)

  const handleSelect = (value: string) => {
    setSelectedValue(value)
    onChange(value)
    setOpen(false)
  }

  useEffect(() => {
    setSelectedValue(value)
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
      <PopoverContent className={cn("p-0 !w-[var(--radix-popper-anchor-width)]", className)}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
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
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}