import type { ReactNode } from "react";
import { Eyebrow, Heading } from "@/components/ui";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  // Primary action, e.g. a "Create" button.
  action?: ReactNode;
};

export default function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Heading level={1} size={2}>
          {title}
        </Heading>
        {description && <p className="mt-2 max-w-2xl text-brand-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
