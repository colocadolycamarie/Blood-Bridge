import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** Render inside a bordered Card (dashboard contexts) vs. a plain inline panel (public pages). */
  variant?: "card" | "panel";
  /** Dashed border instead of solid — signals "this fills in once you act" rather than a static message. */
  dashed?: boolean;
  className?: string;
}

export function EmptyState({ title, description, icon: Icon = Inbox, variant = "card", dashed = false, className }: EmptyStateProps) {
  const content = (
    <div className={cn("py-16 flex flex-col items-center text-center px-6", className)}>
      <div className="bg-muted p-4 rounded-full mb-4">
        <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      {description && <p className="text-muted-foreground text-sm max-w-sm">{description}</p>}
    </div>
  );

  if (variant === "panel") {
    return <div className={cn("border rounded-2xl bg-card", dashed && "border-dashed bg-muted/30")}>{content}</div>;
  }

  return (
    <Card className={cn(dashed && "border-dashed bg-muted/30 shadow-none")}>
      <CardContent className="p-0">{content}</CardContent>
    </Card>
  );
}
