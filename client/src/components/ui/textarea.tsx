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
          "flex min-h-[100px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm transition-all duration-200 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 hover:border-ring/50 resize-none",
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
