/**
 * Question Types Constants
 * Centralized constants for question types used across the application
 */

export const QUESTION_TYPES = {
  BOOLEAN: 'BOOLEAN',
  SINGLE_CHOICE: 'SINGLE_CHOICE',
  MULTI_CHOICE: 'MULTI_CHOICE',
  DROPDOWN: 'DROPDOWN',
  NUMBER_INPUT: 'NUMBER_INPUT',
  MIXED: 'MIXED',
  LONG_TEXT_INPUT: 'LONG_TEXT_INPUT',
  FILE_UPLOAD: 'FILE_UPLOAD',
  LIKERT_SCALE_GROUP: 'LIKERT_SCALE_GROUP',
} as const;

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];

/**
 * Question type labels in Vietnamese
 */
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  [QUESTION_TYPES.BOOLEAN]: 'Câu hỏi đóng',
  [QUESTION_TYPES.SINGLE_CHOICE]: 'Câu hỏi một lựa chọn',
  [QUESTION_TYPES.MULTI_CHOICE]: 'Câu hỏi nhiều lựa chọn',
  [QUESTION_TYPES.DROPDOWN]: 'Câu hỏi dropdown',
  [QUESTION_TYPES.NUMBER_INPUT]: 'Câu hỏi số',
  [QUESTION_TYPES.MIXED]: 'Câu hỏi hỗn hợp',
  [QUESTION_TYPES.LONG_TEXT_INPUT]: 'Câu hỏi mở',
  [QUESTION_TYPES.FILE_UPLOAD]: 'Câu hỏi tải file',
  [QUESTION_TYPES.LIKERT_SCALE_GROUP]: 'Nhóm thang đo Likert',
};

/**
 * Get Vietnamese label for a question type
 */
export const getQuestionTypeLabel = (questionType: string): string => {
  return QUESTION_TYPE_LABELS[questionType as QuestionType] || questionType;
};

/**
 * Question type options for dropdown/select components
 */
export const QUESTION_TYPE_OPTIONS = Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

