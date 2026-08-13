import type { TextareaHTMLAttributes } from "react";
import { cn, inputBaseClass } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  error?: string;
}

export function Textarea({ label, name, error, className, ...rest }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground-secondary">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={5}
        className={cn(inputBaseClass, "min-h-32 resize-y py-3", error && "border-danger", className)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${name}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
