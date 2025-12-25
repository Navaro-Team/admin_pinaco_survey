"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Combobox } from "../ui/combobox";
import { changeQuestionType, changeSearch, clearFilter, getQuestions } from "@/features/questions/questions.slice";
import { Button } from "../ui/button";
import { FilterIcon, X } from "lucide-react";
import { QUESTION_TYPE_OPTIONS } from "@/features/questions/questions.constants";

export function Filter() {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.questions.filter.search);
  const questionType = useAppSelector((state) => state.questions.filter.questionType);

  const handleFilter = () => {
    const params: any = {
      page: 1,
      limit: 10,
      status: 'active',
    };

    if (search) {
      params.search = search;
    }
    if (questionType) {
      params.questionType = questionType;
    }

    dispatch(getQuestions(params));
  };

  const handleClearFilter = () => {
    dispatch(clearFilter());
    dispatch(getQuestions({
      page: 1,
      limit: 10,
      status: 'active',
    }));
  };

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 md:items-end w-full">
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <Label>Nội dung câu hỏi</Label>
            <Input
              placeholder="Nhập nội dung câu hỏi"
              value={search}
              onChange={(e) => dispatch(changeSearch(e.target.value))} />
          </div>
          <div className="w-full md:w-96 min-w-0 flex flex-col gap-2">
            <Label>Loại câu hỏi</Label>
            <Combobox
              className="w-full"
              options={QUESTION_TYPE_OPTIONS}
              value={questionType}
              placeholder="Chọn loại câu hỏi"
              onChange={(value) => dispatch(changeQuestionType(value))} />
          </div>
          <Button 
            variant="outline" 
            className="w-full md:w-24 h-10 md:self-end"
            onClick={handleFilter}
          >
            <FilterIcon className="size-4" />
            Lọc
          </Button>
          <Button 
            variant="outline" 
            className="w-full md:w-24 h-10 md:self-end"
            onClick={handleClearFilter}
          >
            <X className="size-4" />
            Xoá lọc
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}