import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TaskNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-2xl font-semibold">Task not found</h1>
      <p className="text-muted-foreground">This task may have been deleted or doesn&apos;t exist.</p>
      <Button render={<Link href="/tasks" />}>Go to Tasks</Button>
    </div>
  );
}
