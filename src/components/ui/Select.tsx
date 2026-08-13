import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn, inputBaseClass } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  error?: string;
}

export function Select({ label, name, options, placeholder, error, className, ...rest }: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-foreground-secondary">
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          className={cn(
            inputBaseClass,
            "h-12 appearance-none pr-10",
            error && "border-danger",
            className,
          )}
          aria-invalid={Boolean(error)}
          defaultValue=""
          {...rest}
        >
          <option value="" disabled>
            {placeholder ?? "Seçiniz"}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-foreground-muted"
          aria-hidden
        />
      </div>
      {error && <p className="text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}
