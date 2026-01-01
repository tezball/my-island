import Icon from './Icon'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: number
  showValue?: boolean
  interactive?: boolean
  onChange?: (rating: number) => void
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1)

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          >
            <Icon
              name="star"
              size={size}
              filled={star <= rating}
              className={star <= rating ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}
            />
          </button>
        ))}
      </div>
      {showValue && (
        <span className="ml-1 font-medium text-slate-900 dark:text-white">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
