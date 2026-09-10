import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-base font-medium transition-[transform,background-color,opacity] duration-150 ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  {
    variants: {
      variant: {
        primary:
          "bg-wood text-wood-fg shadow-[var(--shadow-border)] hover:bg-wood/90",
        sage: "bg-sage text-primary-fg hover:bg-sage/90",
        outline:
          "bg-surface text-fg shadow-[var(--shadow-border)] hover:bg-surface-2",
        ghost: "text-fg hover:bg-surface-2",
        cream: "bg-surface-2 text-fg hover:bg-border",
      },
      size: {
        md: "h-12 px-5",
        lg: "h-14 px-6 text-lg",
        xl: "h-16 px-6 text-lg",
        icon: "size-12",
        sm: "h-10 px-3 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
