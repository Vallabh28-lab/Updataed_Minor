import { cn } from "@/lib/utils"

const Separator = ({ className, ...props }) => (
  <div
    className={cn("shrink-0 bg-border h-[1px] w-full", className)}
    {...props}
  />
)

export { Separator }