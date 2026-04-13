interface LivePreviewProps {
  title?: string;
  text: string;
  voice?: "female" | "male";
  language?: string;
}

/**
 * Live AI preview card — shows what the Ringa receptionist would say
 * given the current onboarding inputs.
 */
export function LivePreview({
  title = "What Ringa will say",
  text,
}: LivePreviewProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-[#3B6FFF]/5 to-[#7C3FFF]/5 p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-2 w-2 items-center justify-center">
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </span>
      </div>

      <div className="mt-3 rounded-xl bg-white border border-gray-100 p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3B6FFF] to-[#7C3FFF] text-white text-sm font-bold">
              R
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-400">Ringa AI</p>
            <p className="mt-0.5 text-sm text-gray-800 leading-relaxed">
              {text || <span className="italic text-gray-400">Fill in the form to see what Ringa will say…</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
