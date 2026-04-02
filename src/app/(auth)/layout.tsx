import { Snowflake } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#3B6FFF]/5 to-[#7C3FFF]/10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Snowflake className="h-8 w-8 text-[#3B6FFF]" />
          <span className="text-2xl font-bold text-gray-900">Ringa</span>
        </div>
        {children}
      </div>
    </div>
  );
}
