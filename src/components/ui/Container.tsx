import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  wide?: boolean;
}

export function Container({ children, className, as: Tag = "div", wide = false }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-10 lg:px-16",
        wide ? "max-w-[1440px]" : "max-w-[1200px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
