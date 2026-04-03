"use client";

import { useEffect } from "react";

/**
 * Tiny client component that handles:
 * 1. IntersectionObserver for step-by-step animation
 * 2. Smooth scroll navigation buttons
 *
 * Kept separate so the landing page can be a Server Component
 * (avoids FOUC — Flash of Unstyled Content).
 */
export function StepAnimator() {
  useEffect(() => {
    const steps = document.querySelectorAll(".r-step");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 150);
          }
        });
      },
      { threshold: 0.2 }
    );
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, []);

  return null;
}

export function ScrollButton({
  targetId,
  className,
  children,
}: {
  targetId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className={className}
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })}
    >
      {children}
    </button>
  );
}
