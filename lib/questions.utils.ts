/**
 * Predefined order of question codes for sorting surveys.
 * This order defines the canonical sequence in which questions should appear.
 */
export const QUESTION_CODE_ORDER: readonly string[] = [
  'PINACO_SIGNAGE_USAGE',
  'PINACO_BRAND_FILTER',
  'BRANDS_CARRIED',
  'BUSINESS_TYPE',
  'PRODUCT_CATEGORIES',
  'SCALE_QUOTA_CHECK',
  'STORE_AUDIT_STOCK',
  'VELOCITY_CHECK',
  'SALES_PROPORTION',
  'PERCEIVED_MARKET_SHARE',
  'PRICE_CHECK',
  'PINACO_DISTRIBUTOR_EVAL',
  'PINACO_GUARANTEE_EVAL',
  'PINACO_DELIVERIES_EVAL',
  'VERIFICATION_PHOTO',
  'FEEDBACK',
] as const;

/**
 * Sort an array of questions by their `code` field based on the predefined
 * QUESTION_CODE_ORDER. Questions whose codes are not in the predefined list
 * will be placed at the end, preserving their original relative order.
 *
 * @param questions - Array of objects that have a `code` string property
 * @returns A new sorted array (does not mutate the original)
 *
 * @example
 * ```ts
 * const sorted = sortQuestionsByCode(survey.surveyData.questions);
 * ```
 */
export function sortQuestionsByCode<T extends { code: string }>(questions: T[]): T[] {
  const orderMap = new Map<string, number>();
  QUESTION_CODE_ORDER.forEach((code, index) => {
    orderMap.set(code, index);
  });

  const MAX_INDEX = QUESTION_CODE_ORDER.length;

  return [...questions].sort((a, b) => {
    const indexA = orderMap.get(a.code) ?? MAX_INDEX;
    const indexB = orderMap.get(b.code) ?? MAX_INDEX;
    return indexA - indexB;
  });
}