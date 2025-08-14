"use client";

import * as React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number;
    max?: number;
  }
>(({ className, value = 0, max = 100, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-blue-500 transition-all"
      style={{ transform: `translateX(-${100 - (value / max) * 100}%)` }}
    />
  </div>
));
Progress.displayName = "Progress";

export { Progress };
