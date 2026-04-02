"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// ── Types ───────────────────────────────────────────────────────────────────

interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  onboarding_completed: boolean;
  subscription_status: string;
  subscription_plan?: string;
  agent_name: string;
  languages_supported: string;
  twilio_phone_number?: string;
  vapi_assistant_id?: string;
  service_fee: number;
  after_hours_fee: number;
  fee_applies_to_service: boolean;
  business_hours_start: number;
  business_hours_end: number;
}

interface AuthContextType {
  company: Company | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (companyName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

// ── Constants ───────────────────────────────────────────────────────────────

const TOKEN_KEY = "hvac_token";
const API_BASE = "/api";

const PUBLIC_PATHS = ["/login", "/signup"];
const LANDING_PATH = "/";

// ── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const saveToken = (t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    document.cookie = `${TOKEN_KEY}=${t}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    setToken(t);
  };

  const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
    setToken(null);
    setCompany(null);
  };

  const fetchMe = useCallback(async (t: string) => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    if (!res.ok) {
      clearToken();
      return null;
    }
    const data: Company = await res.json();
    setCompany(data);
    return data;
  }, []);

  // On mount: restore token and fetch user
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      setToken(stored);
      fetchMe(stored).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  // Redirect logic
  useEffect(() => {
    if (loading) return;

    const isPublic = pathname === LANDING_PATH || PUBLIC_PATHS.some((p) => pathname.startsWith(p));
    const isLanding = pathname === LANDING_PATH;

    if (!token && !isPublic) {
      router.replace("/login");
    } else if (token && company && isPublic && !isLanding) {
      // Logged in user on public page — redirect to dashboard
      if (!company.onboarding_completed) {
        router.replace("/onboarding");
      } else {
        router.replace("/home");
      }
    }
  }, [loading, token, company, pathname, router]);

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(err.detail || "Login failed");
    }
    const data = await res.json();
    saveToken(data.access_token);
    const me = await fetchMe(data.access_token);

    if (me && !me.onboarding_completed) {
      router.push("/onboarding");
    } else {
      router.push("/home");
    }
  };

  const signup = async (companyName: string, email: string, password: string, phone?: string) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company_name: companyName, email, password, phone }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Signup failed" }));
      throw new Error(err.detail || "Signup failed");
    }
    const data = await res.json();
    saveToken(data.access_token);
    await fetchMe(data.access_token);
    router.push("/onboarding");
  };

  const logout = () => {
    clearToken();
    router.push("/login");
  };

  const refresh = async () => {
    if (token) await fetchMe(token);
  };

  return (
    <AuthContext.Provider value={{ company, token, loading, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
