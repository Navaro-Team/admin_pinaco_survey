"use client"

import { Badge } from "@/components/ui/badge";

interface MultiChoiceAnswerProps {
  question: any;
  answerValue: any;
}

export function MultiChoiceAnswer({ answerValue }: MultiChoiceAnswerProps) {
  if (!answerValue || (Array.isArray(answerValue) && answerValue.length === 0)) return null;

  if (Array.isArray(answerValue) && answerValue.length > 0 && typeof answerValue[0] === "object") {
    return (
      <div className="flex flex-wrap gap-2">
        {answerValue.map((item: any, idx: number) => {
          const label =
            item.brandName ||
            item.categoryName ||
            item.text ||
            item.name ||
            item.label ||
            item.brandCode ||
            item.category ||
            item.code ||
            JSON.stringify(item);
          return (
            <Badge key={idx} variant="secondary" className="text-xs px-2 py-1">
              {label}
            </Badge>
          );
        })}
      </div>
    );
  }

  if (Array.isArray(answerValue)) {
    return (
      <div className="flex flex-wrap gap-2">
        {answerValue.map((val, idx) => (
          <Badge key={idx} variant="secondary" className="text-xs px-2 py-1">
            {String(val)}
          </Badge>
        ))}
      </div>
    );
  }

  return null;
}

