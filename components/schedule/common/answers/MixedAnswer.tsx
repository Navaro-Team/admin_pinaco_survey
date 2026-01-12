"use client"

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MixedAnswerProps {
  question: any;
  answerValue: any;
}

const formatCurrency = (value: number | string): string => {
  return typeof value === "number" ? value.toLocaleString("vi-VN") : String(value);
};

const InfoRow = ({ label, value }: { label: string; value: string | number | React.ReactElement }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm text-muted-foreground">{label}:</span>
    {typeof value === "string" || typeof value === "number" ? (
      <span className="text-lg font-semibold">{value}</span>
    ) : (
      value
    )}
  </div>
);

export function MixedAnswer({ question, answerValue }: MixedAnswerProps) {
  if (!answerValue) return null;

  const code = question.code;

  switch (code) {
    case "PINACO_SIGNAGE_USAGE": {
      const hasSignage = answerValue.hasSignage;
      const amount = answerValue.amount;
      
      return (
        <div className="space-y-2">
          <InfoRow 
            label="Có sử dụng biển hiệu PINACO" 
            value={
              <Badge variant={hasSignage ? "default" : "secondary"}>
                {hasSignage ? "Có" : "Không"}
              </Badge>
            } 
          />
          {hasSignage && amount !== undefined && amount !== null && (
            <InfoRow label="Số lượng" value={amount} />
          )}
        </div>
      );
    }

    case "SCALE_QUOTA_CHECK": {
      return (
        <div className="space-y-2">
          <InfoRow label="Mức" value={<Badge variant="secondary">{answerValue.level}</Badge>} />
          <InfoRow label="Hạn mức" value={<Badge variant="secondary">{answerValue.quote}</Badge>} />
          <InfoRow label="Số tiền" value={`${formatCurrency(answerValue.amount)} VNĐ`} />
        </div>
      );
    }

    case "STORE_AUDIT_STOCK": {
      return (
        <div className="space-y-4">
          <InfoRow
            label="Tổng giá trị tồn kho"
            value={`${formatCurrency(answerValue.totalAmount)} VNĐ`}
          />
          {Array.isArray(answerValue.values) && answerValue.values.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Nhóm</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Thương hiệu</TableHead>
                  <TableHead className="text-right">Giá trị (VNĐ)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {answerValue.values.map((item: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>{item.categoryName || item.category}</TableCell>
                    <TableCell>{item.categoryGroup}</TableCell>
                    <TableCell>{item.categoryName}</TableCell>
                    <TableCell>{item.brandName || item.brandCode}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      );
    }

    case "VELOCITY_CHECK": {
      if (!Array.isArray(answerValue.values) || answerValue.values.length === 0) {
        return null;
      }

      return (
        <div className="space-y-4">
          {answerValue.totalAmount !== undefined && answerValue.totalAmount > 0 && (
            <InfoRow
              label="Tổng số tiền"
              value={`${formatCurrency(answerValue.totalAmount)} VNĐ`}
            />
          )}
          {answerValue.values.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Nhóm</TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Thương hiệu</TableHead>
                  <TableHead className="text-right">Số tiền (VNĐ)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {answerValue.values.map((item: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>{item.categoryName || item.category}</TableCell>
                    <TableCell>{item.categoryGroup}</TableCell>
                    <TableCell>{item.categoryName}</TableCell>
                    <TableCell>{item.brandName || item.brandCode}</TableCell>
                    <TableCell className="text-right font-medium">
                      {item.amount ? `${formatCurrency(item.amount)} VNĐ` : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      );
    }

    case "SALES_PROPORTION": {
      return (
        <div className="space-y-2">
          <InfoRow label="Bán lẻ" value={`${answerValue.retail}%`} />
          <InfoRow label="Bán sỉ" value={`${answerValue.wholesale}%`} />
        </div>
      );
    }

    case "PERCEIVED_MARKET_SHARE": {
      if (!Array.isArray(answerValue)) return null;
      return (
        <div className="space-y-2">
          {answerValue.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <Badge variant="secondary">{item.brandName || item.brandCode}</Badge>
              <span className="text-sm text-muted-foreground">:</span>
              <span className="text-lg font-semibold">{item.count} / 10</span>
            </div>
          ))}
        </div>
      );
    }

    case "PRICE_CHECK": {
      if (!Array.isArray(answerValue) || answerValue.length === 0) return null;
      
      // Extract brand codes from prices
      const brandCodes = new Set<string>();
      answerValue.forEach((item: any) => {
        if (item.prices && typeof item.prices === "object") {
          Object.keys(item.prices).forEach((brandCode) => brandCodes.add(brandCode));
        }
      });
      const brands = Array.from(brandCodes);

      if (brands.length === 0) return null;

      return (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chủng loại</TableHead>
                <TableHead>Mã hàng</TableHead>
                {brands.map((brandCode) => (
                  <TableHead key={brandCode} className="text-right">
                    {brandCode}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {answerValue.map((item: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{item.batteryTypeName || item.batteryTypeCode}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  {brands.map((brandCode) => (
                    <TableCell key={brandCode} className="text-right font-medium">
                      {item.prices && item.prices[brandCode]
                        ? `${formatCurrency(item.prices[brandCode])} VND`
                        : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    default:
      return (
        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
          {JSON.stringify(answerValue, null, 2)}
        </pre>
      );
  }
}

