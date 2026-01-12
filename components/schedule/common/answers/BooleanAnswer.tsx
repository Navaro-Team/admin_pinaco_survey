"use client"

import { Badge } from "@/components/ui/badge";

interface BooleanAnswerProps {
  answerValue: any;
}

export function BooleanAnswer({ answerValue }: BooleanAnswerProps) {
  const value = Boolean(answerValue);
  
  return (
    <Badge variant={value ? "default" : "secondary"} className="text-sm px-3 py-1">
      {value ? "Có" : "Không"}
    </Badge>
  );
}

