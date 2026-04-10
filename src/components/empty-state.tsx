"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

/**
 * Reusable empty state component for when lists/tables have no data.
 * Shows an icon in a soft background circle, a title, optional description,
 * and optional CTA (link or button).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  const actionClasses =
    "mt-5 inline-flex items-center gap-1.5 rounded-lg bg-[#3B6FFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2D5FE6] transition-colors";

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      )}
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link href={actionHref} className={actionClasses}>
            {actionLabel}
          </Link>
        ) : (
          <button onClick={onAction} className={actionClasses}>
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}

/**
 * Skeleton row for table/list loading states.
 * Accepts a count for how many placeholder rows to render.
 */
export function SkeletonRows({ count = 5, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-14 rounded-lg bg-gray-100 animate-pulse"
          style={{ animationDelay: `${i * 80}ms` }}
        />
      ))}
    </div>
  );
}
