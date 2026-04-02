import { Snowflake } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <Snowflake className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">HVAC Agent</span>
        </div>
        {children}
      </div>
    </div>
  );
}
