import * as React from "react"
import { cn } from "../../lib/cn"

const Switch = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "bg-muted",
      "data-[state=checked]:bg-primary",
      className
    )}
    {...props}
  />
))
Switch.displayName = "Switch"

export { Switch }
