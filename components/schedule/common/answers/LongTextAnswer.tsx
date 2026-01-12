"use client"

interface LongTextAnswerProps {
  answerValue: any;
}

export function LongTextAnswer({ answerValue }: LongTextAnswerProps) {
  if (!answerValue) return null;

  const text = typeof answerValue === "string" ? answerValue : answerValue.value ?? "";
  if (!text) return null;

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed">
      {text}
    </p>
  );
}

