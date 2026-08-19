import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function CopyButton({
  value,
  label = "Copy",
  className,
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-md px-3 text-sm text-muted transition-colors duration-150 hover:bg-elevated hover:text-fg",
        className,
      )}
    >
      <span className="relative size-4">
        <Copy
          className={cn(
            "absolute inset-0 size-4 transition-opacity duration-200",
            copied ? "opacity-0" : "opacity-100",
          )}
          strokeWidth={1.75}
        />
        <Check
          className={cn(
            "absolute inset-0 size-4 transition-opacity duration-200",
            copied ? "opacity-100" : "opacity-0",
          )}
          strokeWidth={1.75}
        />
      </span>
      {copied ? "Copied" : label}
    </button>
  );
}
