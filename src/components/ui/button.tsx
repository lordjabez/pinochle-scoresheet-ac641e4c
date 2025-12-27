import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex appearance-none touch-manipulation select-none [-webkit-tap-highlight-color:transparent] items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors outline-none shadow-none ring-0 ring-offset-0 focus:outline-none focus:shadow-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 [&:focus]:outline-none [&:focus-visible]:outline-none active:opacity-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary active:bg-primary focus:bg-primary focus-visible:bg-primary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive active:bg-destructive focus:bg-destructive focus-visible:bg-destructive",
        outline:
          "border border-input bg-background text-foreground hover:bg-background hover:text-foreground active:bg-background active:text-foreground focus:bg-background focus:text-foreground focus-visible:bg-background focus-visible:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary active:bg-secondary focus:bg-secondary focus-visible:bg-secondary",
        ghost:
          "bg-transparent text-foreground hover:bg-transparent hover:text-foreground active:bg-transparent active:text-foreground focus:bg-transparent focus:text-foreground focus-visible:bg-transparent focus-visible:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "no-press-effect":
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground active:bg-primary active:text-primary-foreground active:opacity-100 active:filter-none focus:bg-primary focus:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground [&]:active:opacity-100 [&]:active:brightness-100 [&]:active:contrast-100 [-webkit-filter:none]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
