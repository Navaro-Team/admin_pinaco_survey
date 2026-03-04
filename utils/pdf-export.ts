import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const formatCurrency = (value: number | string): string => {
  return typeof value === 'number' ? value.toLocaleString('vi-VN') : String(value);
};

/**
 * Render answer as HTML based on question type (matching UI components)
 */
function renderAnswerHTML(question: any, answerValue: any): string {
  if (answerValue === null || answerValue === undefined || answerValue === '') {
    return '<span style="color: #999; font-style: italic;">Không có câu trả lời</span>';
  }

  let questionType = question.questionType || question.type;
  const code = question.code;

  // Check if answerValue should be treated as MIXED based on question code
  if (
    code === 'PINACO_SIGNAGE_USAGE' ||
    code === 'SCALE_QUOTA_CHECK' ||
    code === 'STORE_AUDIT_STOCK' ||
    code === 'VELOCITY_CHECK' ||
    code === 'SALES_PROPORTION' ||
    code === 'PERCEIVED_MARKET_SHARE' ||
    code === 'PRICE_CHECK'
  ) {
    questionType = 'MIXED';
  }
  // Check if answerValue is an object and determine if it should be treated as MIXED
  else if (
    typeof answerValue === 'object' &&
    !Array.isArray(answerValue) &&
    answerValue !== null
  ) {
    if (
      (answerValue.level && answerValue.amount) ||
      (answerValue.totalAmount && answerValue.values) ||
      (answerValue.retail && answerValue.wholesale) ||
      (answerValue.brandCode && answerValue.amount && !answerValue.level) ||
      (answerValue.hasSignage !== undefined)
    ) {
      questionType = 'MIXED';
    }
  }

  switch (questionType) {
    case 'BOOLEAN': {
      const value = Boolean(answerValue);
      const badgeClass = value ? 'background: #007bff; color: white;' : 'background: #e5e7eb; color: #374151;';
      return `<span style="display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; ${badgeClass}">${value ? 'Có' : 'Không'}</span>`;
    }

    case 'NUMERIC_INPUT':
    case 'NUMBER_INPUT': {
      const unit = question.input?.unit || '';
      const value = typeof answerValue === 'number' 
        ? answerValue.toLocaleString('vi-VN') 
        : answerValue;
      return `<div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px; font-weight: 600;">${value}</span>
        ${unit ? `<span style="font-size: 12px; color: #6b7280;">${unit}</span>` : ''}
      </div>`;
    }

    case 'DROPDOWN_SELECT':
    case 'DROPDOWN':
    case 'SINGLE_CHOICE': {
      let displayText = '';
      if (typeof answerValue === 'object' && !Array.isArray(answerValue) && answerValue.text) {
        displayText = answerValue.text;
      } else if (typeof answerValue === 'string') {
        const options = question.options || [];
        const option = options.find(
          (opt: any) => opt.id === answerValue || opt.code === answerValue || opt.value === answerValue
        );
        displayText = option?.label || option?.text || option?.name || answerValue;
      } else {
        displayText = String(answerValue);
      }
      return `<span style="display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; background: #e5e7eb; color: #374151;">${displayText}</span>`;
    }

    case 'MULTI_CHOICE': {
      if (!answerValue || (Array.isArray(answerValue) && answerValue.length === 0)) {
        return '<span style="color: #999; font-style: italic;">Không có câu trả lời</span>';
      }

      let badges: string[] = [];
      if (Array.isArray(answerValue) && answerValue.length > 0 && typeof answerValue[0] === 'object') {
        badges = answerValue.map((item: any) => {
          const label = item.brandName || item.categoryName || item.text || item.name || item.label || item.brandCode || item.category || item.code || JSON.stringify(item);
          return `<span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; background: #e5e7eb; color: #374151; margin: 2px;">${label}</span>`;
        });
      } else if (Array.isArray(answerValue)) {
        const options = question.options || [];
        badges = answerValue.map((val: any) => {
          const option = options.find(
            (opt: any) => opt.id === val || opt.code === val || opt.value === val
          );
          const label = option?.label || option?.text || option?.name || String(val);
          return `<span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; background: #e5e7eb; color: #374151; margin: 2px;">${label}</span>`;
        });
      }

      return `<div style="display: flex; flex-wrap: wrap; gap: 4px;">${badges.join('')}</div>`;
    }

    case 'LONG_TEXT_INPUT': {
      const text = typeof answerValue === 'string' ? answerValue : answerValue.value ?? '';
      if (!text) return '<span style="color: #999; font-style: italic;">Không có câu trả lời</span>';
      return `<p style="white-space: pre-wrap; font-size: 12px; line-height: 1.6; margin: 0;">${escapeHtml(text)}</p>`;
    }

    case 'LIKERT_SCALE': {
      const value = typeof answerValue === 'object' ? answerValue.value : answerValue;
      const numValue = typeof value === 'number' ? value : Number(value);
      if (isNaN(numValue)) return '<span style="color: #999; font-style: italic;">Không có câu trả lời</span>';

      const isStarRating = question.label && Array.isArray(question.label) && question.label.length === 2;
      const scale = question.scale && Array.isArray(question.scale) && question.scale.length > 0 ? question.scale : null;

      if (isStarRating) {
        const stars = [1, 2, 3, 4, 5].map(star => 
          `<span style="font-size: 20px; color: ${star <= numValue ? '#fbbf24' : '#d1d5db'};">★</span>`
        ).join('');
        return `<div style="display: flex; align-items: center; gap: 16px;">
          <span style="font-size: 12px; color: #6b7280; min-width: 80px; text-align: right;">${question.label[0]}</span>
          <div style="display: flex; gap: 4px;">${stars}</div>
          <span style="font-size: 12px; color: #6b7280; min-width: 80px;">${question.label[1]}</span>
          <span style="font-size: 16px; font-weight: 600; margin-left: 8px;">${numValue}/5</span>
        </div>`;
      }

      if (scale) {
        const scaleItem = scale.find((s: any) => s.value === numValue);
        return `<div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 16px; font-weight: 600;">${numValue}</span>
          ${scaleItem ? `<span style="font-size: 12px; color: #6b7280;">(${scaleItem.label})</span>` : ''}
        </div>`;
      }

      // Default: stars
      const stars = [1, 2, 3, 4, 5].map(star => 
        `<span style="font-size: 20px; color: ${star <= numValue ? '#fbbf24' : '#d1d5db'};">★</span>`
      ).join('');
      return `<div style="display: flex; align-items: center; gap: 12px;">
        <div style="display: flex; gap: 4px;">${stars}</div>
        <span style="font-size: 16px; font-weight: 600;">${numValue}/5</span>
      </div>`;
    }

    case 'FILE_UPLOAD': {
      if (!Array.isArray(answerValue) || answerValue.length === 0) {
        return '<span style="color: #999; font-style: italic;">Không có file</span>';
      }
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '';
      const images = answerValue.map((asset: any, idx: number) => {
        const source = `${apiUrl}${asset.path}`;
        return `<div style="position: relative; width: 224px; height: 224px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; display: inline-block; margin: 4px;">
          <img src="${source}" alt="Image ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.5); color: white; text-align: center; padding: 4px; font-size: 10px;">${idx + 1}</div>
        </div>`;
      }).join('');
      return `<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">${images}</div>`;
    }

    case 'MIXED':
    case 'STORE_AUDIT_STOCK': {
      return renderMixedAnswerHTML(question, answerValue);
    }

    default:
      return `<pre style="font-size: 11px; background: #f3f4f6; padding: 8px; border-radius: 4px; overflow: auto; margin: 0;">${escapeHtml(JSON.stringify(answerValue, null, 2))}</pre>`;
  }
}

/**
 * Render Mixed Answer HTML (complex answers with tables and info rows)
 */
function renderMixedAnswerHTML(question: any, answerValue: any): string {
  if (!answerValue) return '<span style="color: #999; font-style: italic;">Không có câu trả lời</span>';

  const code = question.code;
  
  // PERCEIVED_MARKET_SHARE and PRICE_CHECK have array answerValue
  if (code === 'PERCEIVED_MARKET_SHARE' || code === 'PRICE_CHECK') {
    // These are handled in the switch case below, allow arrays
  } else if (typeof answerValue !== 'object' || Array.isArray(answerValue)) {
    // For other MIXED types, ensure answerValue is an object (not array)
    return `<pre style="font-size: 11px; background: #f3f4f6; padding: 8px; border-radius: 4px; overflow: auto; margin: 0;">${escapeHtml(JSON.stringify(answerValue, null, 2))}</pre>`;
  }

  switch (code) {
    case 'PINACO_SIGNAGE_USAGE': {
      const hasSignage = answerValue.hasSignage;
      const amount = answerValue.amount;
      const badgeClass = hasSignage ? 'background: #007bff; color: white;' : 'background: #e5e7eb; color: #374151;';
      let html = `<div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 12px; color: #6b7280;">Có sử dụng biển hiệu PINACO:</span>
          <span style="display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; ${badgeClass}">${hasSignage ? 'Có' : 'Không'}</span>
        </div>`;
      if (hasSignage && amount !== undefined && amount !== null) {
        html += `<div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 12px; color: #6b7280;">Số lượng:</span>
          <span style="font-size: 16px; font-weight: 600;">${amount}</span>
        </div>`;
      }
      html += `</div>`;
      return html;
    }

    case 'SCALE_QUOTA_CHECK': {
      if (!answerValue || typeof answerValue !== 'object') {
        return '<span style="color: #999; font-style: italic;">Không có câu trả lời</span>';
      }
      const level = answerValue.level || '';
      const quote = answerValue.quote || '';
      const amount = answerValue.amount || 0;
      return `<div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 12px; color: #6b7280;">Mức:</span>
          <span style="display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; background: #e5e7eb; color: #374151;">${escapeHtml(String(level))}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 12px; color: #6b7280;">Hạn mức:</span>
          <span style="display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; background: #e5e7eb; color: #374151;">${escapeHtml(String(quote))}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 12px; color: #6b7280;">Số tiền:</span>
          <span style="font-size: 16px; font-weight: 600;">${formatCurrency(amount)} VNĐ</span>
        </div>
      </div>`;
    }

    case 'STORE_AUDIT_STOCK': {
      if (!answerValue || typeof answerValue !== 'object') {
        return '<span style="color: #999; font-style: italic;">Không có câu trả lời</span>';
      }
      const totalAmount = answerValue.totalAmount || 0;
      let html = `<div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 12px; color: #6b7280;">Tổng giá trị tồn kho:</span>
          <span style="font-size: 16px; font-weight: 600;">${formatCurrency(totalAmount)} VNĐ</span>
        </div>`;
      
      if (Array.isArray(answerValue.values) && answerValue.values.length > 0) {
        html += `<table style="width: 100%; border-collapse: collapse; margin-top: 8px;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Danh mục</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Nhóm</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Tên</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Thương hiệu</th>
              <th style="padding: 8px; text-align: right; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Giá trị (VNĐ)</th>
            </tr>
          </thead>
          <tbody>`;
        answerValue.values.forEach((item: any) => {
          if (!item || typeof item !== 'object') return;
          html += `<tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px;">${escapeHtml(String(item.categoryName || item.category || ''))}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px;">${escapeHtml(String(item.categoryGroup || ''))}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px;">${escapeHtml(String(item.categoryName || ''))}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px;">${escapeHtml(String(item.brandName || item.brandCode || ''))}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: 500;">${formatCurrency(item.amount || 0)}</td>
          </tr>`;
        });
        html += `</tbody></table>`;
      }
      html += `</div>`;
      return html;
    }

    case 'VELOCITY_CHECK': {
      if (!Array.isArray(answerValue.values) || answerValue.values.length === 0) {
        return '<span style="color: #999; font-style: italic;">Không có dữ liệu</span>';
      }
      let html = `<div style="display: flex; flex-direction: column; gap: 16px;">`;
      if (answerValue.totalAmount !== undefined && answerValue.totalAmount > 0) {
        html += `<div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 12px; color: #6b7280;">Tổng số tiền:</span>
          <span style="font-size: 16px; font-weight: 600;">${formatCurrency(answerValue.totalAmount)} VNĐ</span>
        </div>`;
      }
      html += `<table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Danh mục</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Nhóm</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Tên</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Thương hiệu</th>
            <th style="padding: 8px; text-align: right; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Số tiền (VNĐ)</th>
          </tr>
        </thead>
        <tbody>`;
      answerValue.values.forEach((item: any) => {
        html += `<tr>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px;">${item.categoryName || item.category || ''}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px;">${item.categoryGroup || ''}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px;">${item.categoryName || ''}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px;">${item.brandName || item.brandCode || ''}</td>
          <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: 500;">${item.amount ? `${formatCurrency(item.amount)} VNĐ` : '-'}</td>
        </tr>`;
      });
      html += `</tbody></table></div>`;
      return html;
    }

    case 'SALES_PROPORTION': {
      return `<div style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 12px; color: #6b7280;">Bán lẻ:</span>
          <span style="font-size: 16px; font-weight: 600;">${answerValue.retail}%</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 12px; color: #6b7280;">Bán sỉ:</span>
          <span style="font-size: 16px; font-weight: 600;">${answerValue.wholesale}%</span>
        </div>
      </div>`;
    }

    case 'PERCEIVED_MARKET_SHARE': {
      if (!Array.isArray(answerValue) || answerValue.length === 0) {
        return '<span style="color: #999; font-style: italic;">Không có dữ liệu</span>';
      }
      // Render as table
      let html = `<table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Thương hiệu</th>
            <th style="padding: 8px; text-align: right; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Số điểm</th>
          </tr>
        </thead>
        <tbody>`;
      answerValue
        .filter((item: any) => item && typeof item === 'object')
        .forEach((item: any) => {
          const brandName = item.brandName || item.brandCode || '';
          const count = item.count || 0;
          html += `<tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px;">
              <span style="display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 12px; background: #e5e7eb; color: #374151;">${escapeHtml(String(brandName))}</span>
            </td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: 600;">${count} / 10</td>
          </tr>`;
        });
      html += `</tbody></table>`;
      return html;
    }

    case 'PRICE_CHECK': {
      if (!Array.isArray(answerValue) || answerValue.length === 0) {
        return '<span style="color: #999; font-style: italic;">Không có dữ liệu</span>';
      }
      
      const brandCodes = new Set<string>();
      answerValue.forEach((item: any) => {
        if (item && typeof item === 'object' && item.prices && typeof item.prices === 'object') {
          Object.keys(item.prices).forEach((brandCode) => brandCodes.add(brandCode));
        }
      });
      const brands = Array.from(brandCodes);

      if (brands.length === 0) {
        return '<span style="color: #999; font-style: italic;">Không có dữ liệu</span>';
      }

      let html = `<table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Chủng loại</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">Mã hàng</th>`;
      brands.forEach((brandCode) => {
        html += `<th style="padding: 8px; text-align: right; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600;">${escapeHtml(brandCode)}</th>`;
      });
      html += `</tr></thead><tbody>`;
      answerValue
        .filter((item: any) => item && typeof item === 'object')
        .forEach((item: any) => {
          html += `<tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px;">${escapeHtml(String(item.batteryTypeName || item.batteryTypeCode || ''))}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px;">${escapeHtml(String(item.sku || ''))}</td>`;
          brands.forEach((brandCode) => {
            const price = item.prices && typeof item.prices === 'object' ? item.prices[brandCode] : null;
            html += `<td style="padding: 8px; border: 1px solid #e5e7eb; font-size: 11px; text-align: right; font-weight: 500;">${price ? `${formatCurrency(price)} VND` : '-'}</td>`;
          });
          html += `</tr>`;
        });
      html += `</tbody></table>`;
      return html;
    }

    default:
      return `<pre style="font-size: 11px; background: #f3f4f6; padding: 8px; border-radius: 4px; overflow: auto; margin: 0;">${escapeHtml(JSON.stringify(answerValue, null, 2))}</pre>`;
  }
}

/**
 * Render Likert Scale Group Answer HTML
 */
function renderLikertScaleGroupHTML(question: any, answersMap: Map<string, any>): string {
  if (!question.items || !Array.isArray(question.items)) return '';

  const parentAnswerData = answersMap.get(question.code);
  const parentAnswer = parentAnswerData?.answer;

  if (!parentAnswer || typeof parentAnswer !== 'object' || Array.isArray(parentAnswer)) {
    return '<span style="color: #999; font-style: italic;">Không có câu trả lời</span>';
  }

  const items: string[] = [];
  question.items.forEach((item: any) => {
    const itemCode = item.code || item.id;
    if (!itemCode) return;

    const itemValue = parentAnswer[itemCode];
    if (itemValue === null || itemValue === undefined) return;

    const itemQuestion = {
      ...question,
      code: itemCode,
      scale: item.scale || question.scale,
      label: item.label,
    };

    const answerHTML = renderAnswerHTML(itemQuestion, itemValue);
    items.push(`
      <div style="margin-bottom: 24px;">
        <h4 style="font-size: 12px; font-weight: 500; margin-bottom: 8px;">${item.title || item.label || ''}</h4>
        <div style="margin-top: 8px;">${answerHTML}</div>
      </div>
    `);
  });

  return `<div style="display: flex; flex-direction: column; gap: 24px;">${items.join('')}</div>`;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  if (typeof text !== 'string') return '';
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Export survey to PDF using browser print
 */
export function exportSurveyToPDF(
  survey: any,
  submission: any,
  task: any
) {
  // Create answers map
  const answersMap = new Map();
  if (submission?.answers && Array.isArray(submission.answers)) {
    submission.answers.forEach((answerItem: any) => {
      if (answerItem.code) {
        answersMap.set(answerItem.code, {
          answer: answerItem.answer,
          questionType: answerItem.questionType,
        });
      }
    });
  }

  // Get questions
  const questions = survey?.surveyData?.questions || [];

  // Create HTML content
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Chi tiết khảo sát - ${escapeHtml(task?.survey?.title || 'Khảo sát')}</title>
      <style>
        @page {
          margin: 20mm;
        }
        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          font-size: 12pt;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .header {
          border-bottom: 2px solid #333;
          padding-bottom: 15px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 20pt;
          font-weight: bold;
        }
        .header .subtitle {
          margin-top: 5px;
          font-size: 14pt;
          color: #666;
        }
        .info-section {
          margin-bottom: 30px;
          padding: 15px;
          background-color: #f5f5f5;
          border-radius: 5px;
        }
        .info-row {
          display: flex;
          margin-bottom: 8px;
        }
        .info-label {
          font-weight: bold;
          min-width: 150px;
        }
        .question-section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .question-title {
          font-weight: bold;
          font-size: 14pt;
          margin-bottom: 10px;
        }
        .question-number {
          font-weight: bold;
          margin-right: 8px;
        }
        .answer-content {
          margin-top: 10px;
          padding: 10px;
          background-color: #f9f9f9;
          border-left: 3px solid #007bff;
        }
        .separator {
          border-top: 1px solid #ddd;
          margin: 20px 0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 10pt;
          color: #666;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 8px 0;
        }
        th, td {
          padding: 8px;
          border: 1px solid #e5e7eb;
          font-size: 11px;
        }
        th {
          background: #f3f4f6;
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Chi tiết khảo sát</h1>
        <div class="subtitle">${escapeHtml(task?.survey?.title || 'Khảo sát')}</div>
      </div>

      <div class="info-section">
        <div class="info-row">
          <span class="info-label">Tên cửa hàng:</span>
          <span>${escapeHtml(task?.store?.name || 'N/A')}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Địa chỉ:</span>
          <span>${escapeHtml(task?.store?.location?.address || 'N/A')}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Ngày tạo:</span>
          <span>${task?.createdAt ? format(new Date(task.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi }) : 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Trạng thái:</span>
          <span>${escapeHtml(task?.status || 'N/A')}</span>
        </div>
      </div>
  `;

  // Add questions and answers
  questions.forEach((question: any, index: number) => {
    const questionNumber = index + 1;
    const answerData = answersMap.get(question.code);
    const answerValue = answerData?.answer;
    const submissionQuestionType = answerData?.questionType;

    htmlContent += `
      <div class="question-section">
        <div class="question-title">
          <span class="question-number">${questionNumber}.</span>
          ${escapeHtml(question.instruction || question.title || 'Câu hỏi')}
        </div>
    `;

    if (question.type === 'LIKERT_SCALE_GROUP') {
      const answerHTML = renderLikertScaleGroupHTML(question, answersMap);
      htmlContent += `
        <div class="answer-content">
          ${answerHTML || '<span style="color: #999; font-style: italic;">Không có câu trả lời</span>'}
        </div>
      `;
    } else {
      // Ensure question code is passed for proper MIXED type detection
      const answerHTML = renderAnswerHTML(
        {
          ...question,
          code: question.code,
          questionType: submissionQuestionType || question.type,
        },
        answerValue
      );
      htmlContent += `
        <div class="answer-content">
          ${answerHTML}
        </div>
      `;
    }

    htmlContent += `</div>`;

    if (index < questions.length - 1) {
      htmlContent += `<div class="separator"></div>`;
    }
  });

  htmlContent += `
      <div class="footer">
        <p>Xuất ngày: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
      </div>
    </body>
    </html>
  `;

  // Open print dialog
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

