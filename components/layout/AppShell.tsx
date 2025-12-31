import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd } from "@/components/ui/kbd";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <Tooltip>
            <TooltipTrigger render={<SidebarTrigger className="-ml-2" />} />
            <TooltipContent side="right">
              <div className="flex flex-col gap-2">
                <span>Toggle sidebar</span>
                <div className="flex gap-1">
                  <Kbd>⌘/Ctrl</Kbd>
                  <span className="text-xs text-muted-foreground">+</span>
                  <Kbd>B</Kbd>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
