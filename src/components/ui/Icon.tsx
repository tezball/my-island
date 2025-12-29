import { cn } from '@/utils/cn'

interface IconProps {
  name: string
  filled?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 'text-[16px]',
  md: 'text-[20px]',
  lg: 'text-[24px]',
  xl: 'text-[32px]',
}

export function Icon({ name, filled = false, size = 'lg', className }: IconProps) {
  return (
    <span
      className={cn(
        'material-symbols-outlined',
        filled && 'filled',
        sizeMap[size],
        className
      )}
    >
      {name}
    </span>
  )
}
