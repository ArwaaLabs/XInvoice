import * as React from "react"

import { cn } from "@/lib/utils"
import { useAutoDirection } from "@/lib/textUtils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  autoDirection?: boolean; // Enable automatic text direction detection
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoDirection = true, value, ...props }, ref) => {
    // Auto-detect text direction based on content
    const { dir, style: autoStyle } = useAutoDirection(autoDirection ? String(value || '') : '');
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
Textarea.displayName = "Textarea"

export { Textarea }
