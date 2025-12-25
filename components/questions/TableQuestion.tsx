"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "../ui/table";
import { useState, useEffect } from "react";
import { TablePagination } from "../ui/table-pagination";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { getQuestions } from "@/features/questions/questions.slice";
import { Spinner } from "../ui/spinner";
import { QuestionDetailSheet } from "./QuestionDetailSheet";
import { getQuestionTypeLabel } from "@/features/questions/questions.constants";

export function TableQuestion() {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const itemsPerPage = 10;

  const questions = useAppSelector((state) => state.questions.questions);
  const total = useAppSelector((state) => state.questions.total);
  const filter = useAppSelector((state) => state.questions.filter);
  const requestState = useAppSelector((state) => state.questions.requestState);

  const isLoading = requestState.status === 'loading' && requestState.type === 'getQuestions';

  useEffect(() => {
    const params: any = {
      page: 1,
      limit: itemsPerPage,
      status: 'active',
    };

    dispatch(getQuestions(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter.search, filter.questionType]);

  useEffect(() => {
    const params: any = {
      page: currentPage,
      limit: itemsPerPage,
      status: 'active',
    };

    if (filter.search) {
      params.search = filter.search;
    }
    if (filter.questionType) {
      params.questionType = filter.questionType;
    }

    dispatch(getQuestions(params));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setIsSheetOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách câu hỏi</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner className="size-6" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left w-10">STT</TableHead>
                <TableHead className="text-left">Nội dung câu hỏi</TableHead>
                <TableHead className="text-left">Loại câu hỏi</TableHead>
                <TableHead className="text-left w-32">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((question, index) => (
                  <TableRow key={question._id}>
                    <TableCell className="text-center w-10">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>{question.title}</TableCell>
                    <TableCell>{getQuestionTypeLabel(question.questionType)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleViewQuestion(question._id)}
                      >
                        <Eye className="size-4 text-blue-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        <TablePagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </CardContent>
      <QuestionDetailSheet
        questionId={selectedQuestionId}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </Card>
  )
}