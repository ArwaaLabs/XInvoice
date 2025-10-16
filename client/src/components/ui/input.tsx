import * as React from "react"

import { cn } from "@/lib/utils"
import { useAutoDirection } from "@/lib/textUtils"

interface InputProps extends React.ComponentProps<"input"> {
  autoDirection?: boolean; // Enable automatic text direction detection
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(  ({ className, type, autoDirection = true, value, ...props }, ref) => {
    // Auto-detect text direction based on content
    const { dir, style: autoStyle } = useAutoDirection(autoDirection ? String(value || '') : '');
    
    // h-10 to match updated button heights
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition-all duration-200 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 hover:border-ring/50",
          className
        )}
        dir={autoDirection ? dir : undefined}
        style={autoDirection ? autoStyle : undefined}
        value={value}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
