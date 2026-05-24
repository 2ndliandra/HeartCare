import * as React from "react";

import { cn } from "~/lib/utils";

type MockupProps = React.HTMLAttributes<HTMLDivElement>;

export function Mockup({ className, children, ...props }: MockupProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[30px] border border-emerald-950/10 bg-white/92 p-3 shadow-[0_40px_120px_rgba(15,23,42,0.14)] backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <div className="rounded-[22px] border border-emerald-950/8 bg-[#f6fbf8]">
        <div className="flex items-center gap-2 border-b border-emerald-950/8 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <div className="overflow-hidden rounded-b-[22px]">{children}</div>
      </div>
    </div>
  );
}
