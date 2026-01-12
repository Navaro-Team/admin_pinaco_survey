"use client"

interface LikertScaleAnswerProps {
  question: any;
  answerValue: any;
}

export function LikertScaleAnswer({ question, answerValue }: LikertScaleAnswerProps) {
  if (answerValue === null || answerValue === undefined) return null;

  const value = typeof answerValue === "number" ? answerValue : Number(answerValue);
  if (isNaN(value)) return null;

  // Check if it's a star rating (has label array) or scale (has scale array)
  const isStarRating = question.label && Array.isArray(question.label) && question.label.length === 2;
  const scale = question.scale && Array.isArray(question.scale) && question.scale.length > 0 
    ? question.scale 
    : null;

  if (isStarRating) {
    // Display as star rating
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground min-w-[80px] text-right">
          {question.label[0]}
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-2xl ${star <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm font-medium text-muted-foreground min-w-[80px] text-left">
          {question.label[1]}
        </span>
        <span className="text-lg font-semibold ml-2">{value}/5</span>
      </div>
    );
  }

  if (scale) {
    // Display with scale label
    const scaleItem = scale.find((s: any) => s.value === value);
    return (
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold">{value}</span>
        {scaleItem && (
          <span className="text-sm text-muted-foreground">({scaleItem.label})</span>
        )}
      </div>
    );
  }

  // Default: display as number with stars (backward compatibility)
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-2xl ${star <= value ? "text-yellow-400" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{value}/5</span>
      </div>
    </div>
  );
}

