"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { OpenQuestionAnswer } from "@/features/openQuestion16/openQuestion16.types"
import { OPEN_QUESTION_TOPIC_LABELS } from "./topics"

interface Props {
  answers: OpenQuestionAnswer[];
  selectedTopic: string | null;
  selectedTier: 'high' | 'medium' | 'low' | null;
}

export function AnswersTable({ answers, selectedTopic, selectedTier }: Props) {
  const filteredAnswers = useMemo(() => {
    return (answers || []).filter((a) => {
      if (selectedTopic && !a.topics.includes(selectedTopic)) return false;
      if (selectedTier === 'high' && a.confidence < 80) return false;
      if (selectedTier === 'medium' && (a.confidence < 60 || a.confidence >= 80)) return false;
      if (selectedTier === 'low' && a.confidence >= 60) return false;
      return true;
    });
  }, [answers, selectedTopic, selectedTier]);

  const topicLabel = (topic: string) => {
    if (topic.startsWith('OTHER:')) return topic.slice('OTHER:'.length);
    return OPEN_QUESTION_TOPIC_LABELS[topic] || topic;
  };

  return (
    <div className="px-2">
      <Table className="w-full">
        <TableCaption hidden>Câu trả lời Câu 16 đã phân loại</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">ĐIỂM BÁN</TableHead>
            <TableHead className="text-left">NỘI DUNG</TableHead>
            <TableHead className="text-left">CHỦ ĐỀ</TableHead>
            <TableHead className="text-left">ĐỘ TIN CẬY</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAnswers.length === 0 && (
            <TableRow><TableCell colSpan={4} className="text-center text-gray-500">Không có câu trả lời phù hợp</TableCell></TableRow>
          )}
          {filteredAnswers.map((answer) => (
            <TableRow key={answer.submissionId}>
              <TableCell className="font-medium whitespace-nowrap">{answer.storeName || '-'}</TableCell>
              <TableCell className="max-w-md min-w-[220px] whitespace-normal break-words">{answer.text}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {answer.topics.length === 0 && <Badge variant="outline">Không rõ</Badge>}
                  {answer.topics.map((topic) => (
                    <Badge key={topic} variant="outline">{topicLabel(topic)}</Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span>{answer.confidence}%</span>
                  {answer.needsReview && <Badge variant="destructive">Cần kiểm tra</Badge>}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
