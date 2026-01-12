"use client"

interface NumericInputAnswerProps {
  question: any;
  answerValue: any;
}

export function NumericInputAnswer({ question, answerValue }: NumericInputAnswerProps) {
  if (answerValue === null || answerValue === undefined || answerValue === "") return null;

  const unit = question.input?.unit || "";

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-semibold">
        {typeof answerValue === "number" ? answerValue.toLocaleString("vi-VN") : answerValue}
      </span>
      {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
    </div>
  );
}

