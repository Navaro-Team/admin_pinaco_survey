import { Check, ChevronDownIcon, ChevronsUpDown, LucideProps, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";

type ComboboxMultipleProps = {
	options: {
		label: string;
		value: string;
	}[];
	value: string[];
	setValue: (update: ((prevValue: string[]) => string[]) | string[]) => void;
	className?: string;
	placeholder?: string;
	disabled?: boolean;
	maxDisplayItems?: number;
	Icon?: string | React.ComponentType<LucideProps>;
	label?: string;
	required?: boolean;
	getData?: () => void;
};

export function ComboboxMultiple({
	options,
	value,
	setValue,
	className,
	placeholder = "Select items...",
	disabled,
	maxDisplayItems = 3,
}: ComboboxMultipleProps) {
	const [open, setOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [popoverWidth, setPopoverWidth] = useState<number | undefined>();
	const [search, setSearch] = useState<string>("");

	useEffect(() => {
		if (buttonRef.current) {
			setPopoverWidth(buttonRef.current.offsetWidth);
		}
	}, [open]);

	const selectedOptions = options.filter((option) => value.includes(option.value));
	const isAllSelected = options.length > 0 && selectedOptions.length === options.length;

	const handleSelectAll = () => {
		if (isAllSelected) {
			setValue([]);
		} else {
			setValue(options.map((option) => option.value));
		}
	};

	const handleSelect = (optionValue: string) => {
		setValue((prevValue) => {
			if (prevValue.includes(optionValue)) {
				return prevValue.filter((val) => val !== optionValue);
			} else {
				return [...prevValue, optionValue];
			}
		});
	};

	const handleRemove = useCallback(
		(optionValue: string, e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			setTimeout(() => {
				setValue((prevValue) => {
					const newValue = prevValue.filter((val) => val !== optionValue);
					return newValue;
				});
			}, 0);
		},
		[setValue]
	);

	const displayItems = selectedOptions.slice(0, maxDisplayItems);
	const remainingCount = selectedOptions.length - maxDisplayItems;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					disabled={disabled}
					className={cn("w-80 justify-between h-10", className)}>
					{selectedOptions.length > 0 ? (
						<div className="flex flex-wrap gap-1 w-full">
							{displayItems.map((option, index) => (
								<div
									key={`${option.value}-${index}`}
									className="flex items-center gap-1 px-2 text-xs bg-secondary rounded-[3px] border py-1"
									onClick={(e) => e.stopPropagation()}
								>
									<span className="truncate max-w-30 text-[#424242]">{option.label}</span>
									<div
										className="h-3 w-3 cursor-pointer hover:text-destructive flex items-center justify-center"
										style={{ pointerEvents: "auto" }}
										onMouseDown={(e) => handleRemove(option.value, e)}>
										<X className="h-3 w-3 text-red-400" />
									</div>
								</div>
							))}
							{remainingCount > 0 && (
								<div className="px-2 text-xs bg-outline rounded-[3px] border flex items-center">+{remainingCount} more</div>
							)}
						</div>
					) : (
						<span className="text-[#384252]/65 font-medium text-[13px]">{placeholder}</span>
					)}
					<ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className={cn(
					"w-auto min-w-fit max-w-lg p-0",
					"[&_[cmdk-list]]:scrollbar-thin [&_[cmdk-list]]:scrollbar-thumb-gray-400 [&_[cmdk-list]]:scrollbar-track-gray-100"
				)}
				style={{
					width: popoverWidth,
					pointerEvents: "auto",
					zIndex: 201,
					transform: "translateX(8px)",
				}}>
				<Command>
					<CommandInput value={search} placeholder="Search..." onValueChange={setSearch} />
					<CommandList
						className="max-h-48 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
						style={{
							scrollbarWidth: "thin",
							scrollbarColor: "#9ca3af #f3f4f6",
						}}>
						<CommandEmpty>{search === "" ? "" : "No data found."} </CommandEmpty>
						<CommandGroup>
							<CommandItem
								key="select_all"
								value="select_all"
								onSelect={handleSelectAll}
								className="border my-1 capitalize cursor-pointer"
							>
								<div className="border border-gray-400 size-4 flex items-center justify-center mr-2">
									<Check className={cn("h-3 w-3", isAllSelected ? "opacity-100" : "opacity-0")} />
								</div>
								<p className="line-clamp-1 flex-1">Chọn tất cả</p>
							</CommandItem>
							{options.map((option, index) => {
								const isSelected = value.includes(option.value);
								return (
									<CommandItem
										key={`${option.value}-${index}`}
										value={option.value}
										onSelect={() => handleSelect(option.value)}
										className="border my-1 capitalize cursor-pointer"
									>
										<div className="border border-gray-400 size-4 flex items-center justify-center mr-2">
											<Check className={cn("h-3 w-3", isSelected ? "opacity-100" : "opacity-0")} />
										</div>
										<p className="line-clamp-1 flex-1">{option.label}</p>
									</CommandItem>
								);
							})}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
