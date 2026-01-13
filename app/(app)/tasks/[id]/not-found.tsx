import Link from "next/link";

export default function TaskNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-2xl font-semibold">Task not found</h1>
      <p className="text-muted-foreground">This task may have been deleted or doesn&apos;t exist.</p>
      <Link
        href="/tasks"
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Go to Tasks
      </Link>
    </div>
  );
}
