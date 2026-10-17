import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CircleCheck } from "lucide-react";
import type { TodayItem } from "@/lib/rotation";

export default function ChoreCard({
  item,
  onDone,
}: {
  item: TodayItem;
  onDone: () => void;
}) {
  const { chore, assignee, done } = item;
  return (
    <Card className={`flex-row items-center gap-3 p-4 shadow-sm ${done ? "opacity-60" : ""}`}>
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
        {assignee?.name.charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium ${done ? "line-through" : ""}`}>{chore.name}</p>
        <p className="text-sm text-muted-foreground">
          {done ? "Done by" : "Up today:"} {assignee?.name}
        </p>
      </div>
      {done ? (
       <CircleCheck className="size-7 text-green-500" />
      ) : (
        <Button className="rounded-full px-5" onClick={onDone}>
         <Check /> Done
        </Button>
      )}
    </Card>
  );
}