import { Button } from "@/components/ui/button";

export function TopNav() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div>{/* Search or breadcrumbs can go here */}</div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Upgrade
        </Button>
        <div className="h-8 w-8 rounded-full bg-muted" title="User avatar" />
      </div>
    </header>
  );
}
