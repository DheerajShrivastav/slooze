import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-bold transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary text-primary-foreground hover:brightness-110 shadow-md hover:shadow-lg':
              variant === 'primary',
            'bg-secondary text-secondary-foreground hover:brightness-110 shadow-md hover:shadow-lg':
              variant === 'secondary',
            'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground':
              variant === 'outline',
            'bg-transparent text-foreground hover:bg-black/5':
              variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg':
              variant === 'destructive',

            'h-8 px-4 text-sm': size === 'sm',
            'h-12 px-8 text-base': size === 'md',
            'h-14 px-10 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
