"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/hooks/redux";
import { useMemo } from "react";
import { AnswerRenderer } from "./answers/AnswerRenderer";
import { LikertScaleGroupAnswer } from "./answers/LikertScaleGroupAnswer";

export function ResultServey() {
  const survey = useAppSelector((state) => state.survey.survey);
  const submission = useAppSelector((state) => state.submission.submission);

  const answersMap = useMemo(() => {
    const map = new Map();
    if (submission?.answers && Array.isArray(submission.answers)) {
      submission.answers.forEach((answerItem: any) => {
        if (answerItem.code) {
          map.set(answerItem.code, {
            answer: answerItem.answer,
            questionType: answerItem.questionType,
          });
        }
      });
    }
    return map;
  }, [submission]);

  // Get questions from survey data
  const questions = useMemo(() => {
    if (!survey?.surveyData?.questions) return [];
    return survey.surveyData.questions;
  }, [survey]);

  if (!questions.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Kết quả khảo sát</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Kết quả khảo sát</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {questions.map((question: any, index: number) => {
            const answerData = answersMap.get(question.code);
            const answerValue = answerData?.answer;
            const submissionQuestionType = answerData?.questionType;
            const questionNumber = index + 1;

            if (question.type === "LIKERT_SCALE_GROUP") {
              return (
                <div key={question.code || index}>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lg font-semibold">
                        <span className="mr-2">{questionNumber}.</span>
                        {question.instruction || question.title}
                      </h3>
                    </div>
                    <div className="pt-2 border-t">
                      <LikertScaleGroupAnswer question={question} answersMap={answersMap} />
                    </div>
                  </div>
                  {index < questions.length - 1 && (
                    <div className="mt-6 pt-6 border-t" />
                  )}
                </div>
              );
            }

            return (
              <div key={question.code || index}>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">
                      <span className="mr-2">{questionNumber}.</span>
                      {question.instruction || question.title}
                    </h3>
                  </div>
                  <div className="pt-2 border-t">
                    <AnswerRenderer 
                      question={{
                        ...question,
                        questionType: submissionQuestionType || question.type,
                        code: question.code,
                      }} 
                      answerValue={answerValue}
                    />
                  </div>
                </div>
                {index < questions.length - 1 && (
                  <div className="mt-6 pt-6 border-t" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}