"use client"

import { NumericInputAnswer } from "./NumericInputAnswer";
import { FileUploadAnswer } from "./FileUploadAnswer";
import { LikertScaleAnswer } from "./LikertScaleAnswer";
import { DropdownSelectAnswer } from "./DropdownSelectAnswer";
import { MultiChoiceAnswer } from "./MultiChoiceAnswer";
import { LongTextAnswer } from "./LongTextAnswer";
import { BooleanAnswer } from "./BooleanAnswer";
import { MixedAnswer } from "./MixedAnswer";

interface AnswerRendererProps {
  question: any;
  answerValue: any;
}

export function AnswerRenderer({ question, answerValue }: AnswerRendererProps) {
  if (answerValue === null || answerValue === undefined) return null;

  let questionType = question.questionType || question.type;
  if (
    typeof answerValue === "object" &&
    !Array.isArray(answerValue) &&
    answerValue !== null
  ) {
    const code = question.code;
    if (
      code === "PINACO_SIGNAGE_USAGE" ||
      code === "SCALE_QUOTA_CHECK" ||
      code === "STORE_AUDIT_STOCK" ||
      code === "VELOCITY_CHECK" ||
      code === "SALES_PROPORTION" ||
      code === "PERCEIVED_MARKET_SHARE" ||
      code === "PRICE_CHECK" ||

      (answerValue.level && answerValue.amount) ||
      (answerValue.totalAmount && answerValue.values) ||
      (answerValue.retail && answerValue.wholesale) ||
      (answerValue.brandCode && answerValue.amount && !answerValue.level) ||
      (answerValue.hasSignage !== undefined)
    ) {
      questionType = "MIXED";
    }
  }

  switch (questionType) {
    case "BOOLEAN":
      return <BooleanAnswer answerValue={answerValue} />;
    case "NUMERIC_INPUT":
    case "NUMBER_INPUT":
      if (typeof answerValue === "object" && !Array.isArray(answerValue) && answerValue !== null) {
        return <MixedAnswer question={question} answerValue={answerValue} />;
      }
      return <NumericInputAnswer question={question} answerValue={answerValue} />;
    case "FILE_UPLOAD":
      return <FileUploadAnswer question={question} answerValue={answerValue} />;
    case "LIKERT_SCALE":
      return <LikertScaleAnswer question={question} answerValue={answerValue} />;
    case "LIKERT_SCALE_GROUP":
      return null;
    case "DROPDOWN_SELECT":
    case "DROPDOWN":
      return <DropdownSelectAnswer question={question} answerValue={answerValue} />;
    case "SINGLE_CHOICE":
      if (typeof answerValue === "object" && !Array.isArray(answerValue) && answerValue !== null) {
        const code = question.code;
        if (
          code === "SCALE_QUOTA_CHECK" ||
          (answerValue.level && answerValue.quote && answerValue.amount)
        ) {
          return <MixedAnswer question={question} answerValue={answerValue} />;
        }
      }
      return <DropdownSelectAnswer question={question} answerValue={answerValue} />;
    case "MULTI_CHOICE":
      return <MultiChoiceAnswer question={question} answerValue={answerValue} />;
    case "LONG_TEXT_INPUT":
      return <LongTextAnswer answerValue={answerValue} />;
    case "MIXED":
    case "STORE_AUDIT_STOCK":
      return <MixedAnswer question={question} answerValue={answerValue} />;
    default:
      return <div className="text-sm text-muted-foreground">Không hỗ trợ loại câu hỏi này</div>;
  }
}

