export interface IconProps {
  name: string
  className?: string
  filled?: boolean
  size?: number
  color?: string
}

export default function Icon({ name, className = '', filled = false, size = 24, color }: IconProps) {
  const style: React.CSSProperties = {
    fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
    fontSize: size,
    ...(color && { color }),
  }

  return (
    <span className={`material-symbols-outlined ${className}`} style={style}>
      {name}
    </span>
  )
}
