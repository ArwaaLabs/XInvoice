import * as React from "react"

import { cn } from "@/lib/utils"
import { useAutoDirection } from "@/lib/textUtils"

interface InputProps extends React.ComponentProps<"input"> {
  autoDirection?: boolean; // Enable automatic text direction detection
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, autoDirection = true, value, ...props }, ref) => {
    // Auto-detect text direction based on content
    const { dir, style: autoStyle } = useAutoDirection(autoDirection ? String(value || '') : '');
    
    // h-9 to match icon buttons and default buttons.
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
