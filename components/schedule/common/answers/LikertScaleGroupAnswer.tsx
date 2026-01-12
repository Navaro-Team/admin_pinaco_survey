"use client"

import { LikertScaleAnswer } from "./LikertScaleAnswer";

interface LikertScaleGroupAnswerProps {
  question: any;
  answersMap: Map<string, any>;
}

export function LikertScaleGroupAnswer({ question, answersMap }: LikertScaleGroupAnswerProps) {
  if (!question.items || !Array.isArray(question.items)) return null;

  const parentAnswerData = answersMap.get(question.code);
  const parentAnswer = parentAnswerData?.answer;

  if (!parentAnswer || typeof parentAnswer !== "object" || Array.isArray(parentAnswer)) {
    return null;
  }

  return (
    <div className="space-y-6">
      {question.items.map((item: any) => {
        const itemCode = item.code || item.id;
        if (!itemCode) return null;

        const itemValue = parentAnswer[itemCode];
        
        if (itemValue === null || itemValue === undefined) return null;

        const itemQuestion = {
          ...question,
          code: itemCode,
          scale: item.scale || question.scale,
          label: item.label,
        };

        return (
          <div key={itemCode} className="space-y-2">
            <h4 className="text-sm font-medium">{item.title}</h4>
            <LikertScaleAnswer
              question={itemQuestion}
              answerValue={itemValue}
            />
          </div>
        );
      })}
    </div>
  );
}

