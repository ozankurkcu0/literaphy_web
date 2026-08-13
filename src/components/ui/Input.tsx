import type { InputHTMLAttributes } from "react";
import { cn, inputBaseClass } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

export function Input({ label, name, error, className, ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground-secondary">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className={cn(inputBaseClass, "h-12", error && "border-danger", className)}
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
