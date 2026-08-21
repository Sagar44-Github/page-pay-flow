import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MarketingCard({
  title,
  description,
  children,
  footer,
  accent,
  className,
  hover = true,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  accent?: string;
  className?: string;
  hover?: boolean;
}) {
  return (
    <Card
      className={cn(
        "border-border bg-card shadow-sm",
        hover &&
          "transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-accent-green/35 hover:shadow-lg hover:shadow-accent-green/5",
        className,
      )}
    >
      <CardHeader className="space-y-2">
        <CardTitle className={cn("text-section-heading font-normal leading-snug", accent)}>
          {title}
        </CardTitle>
        {description ? (
          <CardDescription className="font-sans leading-relaxed">{description}</CardDescription>
        ) : null}
      </CardHeader>
      {children ? <CardContent className="pt-0">{children}</CardContent> : null}
      {footer ? <CardFooter className="pt-0">{footer}</CardFooter> : null}
    </Card>
  );
}
