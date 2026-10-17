import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
    <Card className={`flex-row items-center justify-between p-4 ${done ? "opacity-60" : ""}`}>
      <div>
        <p className={`font-medium ${done ? "line-through" : ""}`}>{chore.name}</p>
        <p className="text-sm text-muted-foreground">
          {done ? "Done by" : "Up today:"} {assignee?.name}
        </p>
      </div>
      {done ? <span className="text-xl">✅</span> : <Button onClick={onDone}>Done</Button>}
    </Card>
  );
}