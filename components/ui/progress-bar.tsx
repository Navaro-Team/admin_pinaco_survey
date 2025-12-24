import { cn } from "@/lib/utils"

interface ProgressBarProps {
  label: string
  subLabel: string
  current: number
  total: number
  className?: string
}

export function ProgressBar({
  label,
  subLabel,
  current,
  total,
  className,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">{subLabel}</span>
      </div>
      
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-main transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

