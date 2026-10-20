import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReassignHistoryEntry } from "@/model/Task.model";
import { formatLocalDate } from "@/lib/utils";
import { ArrowRight, History } from "lucide-react";

const label = (u: { name: string; code?: string }) => [u.code, u.name].filter(Boolean).join(" - ");

export function ReassignHistory({ history }: { history?: ReassignHistoryEntry[] }) {
  if (!history || history.length === 0) return null;

  const sorted = [...history].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  return (
    <Card className="flex flex-col gap-4!">
      <CardHeader>
        <CardTitle className="flex flex-row items-center gap-2">
          <History className="size-6 text-main" />
          <span>Lịch sử chuyển lịch trình</span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-3 py-2!">
        {sorted.map((h, i) => (
          <div key={`${h.at}-${i}`} className="flex flex-row flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">{formatLocalDate(h.at, "HH:mm dd/MM/yyyy")}</span>
            <span className="font-medium">{label(h.from)}</span>
            <ArrowRight className="size-4 text-muted-foreground" />
            <span className="font-medium">{label(h.to)}</span>
            <span className="text-muted-foreground">(bởi {h.by.name})</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
