"use client"

import { Badge } from "@/components/ui/badge";

interface DropdownSelectAnswerProps {
  question: any;
  answerValue: any;
}

export function DropdownSelectAnswer({ question, answerValue }: DropdownSelectAnswerProps) {
  if (answerValue === null || answerValue === undefined || answerValue === "") return null;

  if (typeof answerValue === "object" && !Array.isArray(answerValue) && answerValue.code && answerValue.text) {
    return (
      <Badge variant="secondary" className="text-sm px-3 py-1">
        {answerValue.text}
      </Badge>
    );
  }

  if (typeof answerValue === "string") {
    const options = question.options || [];
    const option = options.find(
      (opt: any) => opt.id === answerValue || opt.code === answerValue || opt.value === answerValue
    );

    if (option) {
      return (
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {option.label || option.text || option.name || answerValue}
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="text-sm px-3 py-1">
        {answerValue}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-sm px-3 py-1">
      {String(answerValue)}
    </Badge>
  );
}

