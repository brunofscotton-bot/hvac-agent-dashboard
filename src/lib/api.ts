const API_BASE = "/api";
const TOKEN_KEY = "hvac_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
    throw new Error("Session expired");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `API error: ${res.status}`);
  }
  return res.json();
}

// Dashboard
export const getDashboardStats = () => fetchAPI<DashboardStats>("/dashboard/stats");
export const getRecentCalls = (limit = 20) => fetchAPI<CallLog[]>(`/dashboard/calls?limit=${limit}`);

// Appointments
export const getAppointments = (params?: string) =>
  fetchAPI<PaginatedResponse<Appointment>>(`/appointments${params ? `?${params}` : ""}`);
export const getTodayAppointments = () => fetchAPI<Appointment[]>("/appointments/today");
export const getAppointment = (id: string) => fetchAPI<Appointment>(`/appointments/${id}`);
export const updateAppointment = (id: string, data: Partial<Appointment>) =>
  fetchAPI(`/appointments/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// Technicians
export const getTechnicians = () => fetchAPI<Technician[]>("/technicians");
export const createTechnician = (data: Partial<Technician>) =>
  fetchAPI("/technicians", { method: "POST", body: JSON.stringify(data) });
export const updateTechnician = (id: string, data: Partial<Technician>) =>
  fetchAPI(`/technicians/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteTechnician = (id: string) =>
  fetchAPI(`/technicians/${id}`, { method: "DELETE" });

// Company
export const getCompany = () => fetchAPI<Company>("/companies/me");
export const updateCompany = (data: Partial<Company>) =>
  fetchAPI("/companies/me", { method: "PATCH", body: JSON.stringify(data) });

// Technician Schedule
export const getTechnicianSchedule = (id: string) =>
  fetchAPI<WorkingHoursDay[]>(`/technicians/${id}/schedule`);
export const updateTechnicianSchedule = (id: string, schedule: WorkingHoursDay[]) =>
  fetchAPI(`/technicians/${id}/schedule`, {
    method: "PUT",
    body: JSON.stringify({ schedule }),
  });
export const getTechnicianTimeOff = (id: string) =>
  fetchAPI<TimeOffBlock[]>(`/technicians/${id}/time-off`);
export const addTechnicianTimeOff = (id: string, data: Omit<TimeOffBlock, "id">) =>
  fetchAPI<{ id: string }>(`/technicians/${id}/time-off`, {
    method: "POST",
    body: JSON.stringify(data),
  });
export const deleteTechnicianTimeOff = (techId: string, timeOffId: string) =>
  fetchAPI(`/technicians/${techId}/time-off/${timeOffId}`, { method: "DELETE" });

// Onboarding
export const completeOnboarding = (data: OnboardingData) =>
  fetchAPI<OnboardingResult>("/onboarding/complete", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Billing
export const getPlans = () => fetchAPI<Record<string, PlanInfo>>("/billing/plans");
export const createCheckout = (plan: string, successUrl: string, cancelUrl: string) =>
  fetchAPI<{ checkout_url: string }>("/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ plan, success_url: successUrl, cancel_url: cancelUrl }),
  });
export const createPortal = (returnUrl: string) =>
  fetchAPI<{ portal_url: string }>("/billing/portal", {
    method: "POST",
    body: JSON.stringify({ return_url: returnUrl }),
  });
export const getSubscription = () => fetchAPI<SubscriptionInfo>("/billing/subscription");
export const getInvoices = () => fetchAPI<{ invoices: Invoice[] }>("/billing/invoices");

// ── Types ───────────────────────────────────────────────────────────────────

export interface DashboardStats {
  today_appointments: number;
  week_appointments: number;
  month_calls: number;
  month_bookings: number;
  month_revenue: number;
  conversion_rate: number;
}

export interface Appointment {
  id: string;
  scheduled_date: string;
  status: string;
  urgency: string;
  visit_fee: number;
  is_after_hours: boolean;
  problem_description: string;
  customer?: {
    id: string;
    name: string;
    phone: string;
    address: string;
    email?: string;
    language?: string;
  };
  technician?: {
    id: string;
    name: string;
    phone: string;
  };
  technician_notes?: string;
  resolution?: string;
  created_at: string;
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email?: string;
  calendar_provider?: string;
  google_calendar_id?: string;
  specialties?: string;
  works_after_hours: boolean;
  works_weekends: boolean;
  is_active: boolean;
}

export interface WorkingHoursDay {
  day_of_week: number;
  is_working: boolean;
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
}

export interface TimeOffBlock {
  id?: string;
  date: string;
  all_day: boolean;
  start_hour?: number;
  start_minute?: number;
  end_hour?: number;
  end_minute?: number;
  reason: string;
  note?: string;
}

export interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city: string;
  state: string;
  twilio_phone_number?: string;
  vapi_assistant_id?: string;
  onboarding_completed: boolean;
  subscription_status: string;
  subscription_plan?: string;
  agent_name: string;
  languages_supported: string;
  service_fee: number;
  after_hours_fee: number;
  fee_applies_to_service: boolean;
  business_hours_start: number;
  business_hours_end: number;
}

export interface CallLog {
  id: string;
  caller_phone?: string;
  duration_seconds?: number;
  language_detected?: string;
  outcome?: string;
  summary?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface OnboardingData {
  company_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  service_fee: number;
  after_hours_fee: number;
  fee_applies_to_service: boolean;
  business_hours_start: number;
  business_hours_end: number;
  technicians: {
    name: string;
    phone: string;
    email?: string;
    google_calendar_id?: string;
    specialties?: string;
    works_after_hours: boolean;
    works_weekends: boolean;
  }[];
  agent_name: string;
  languages_supported: string;
  greeting_message?: string;
  area_code: string;
}

export interface OnboardingResult {
  success: boolean;
  phone_number?: string;
  vapi_assistant_id?: string;
  technician_count: number;
  message: string;
}

export interface PlanInfo {
  name: string;
  price: number;
  features: string[];
}

export interface SubscriptionInfo {
  status: string;
  plan?: string;
  subscription?: {
    id: string;
    status: string;
    current_period_start: number;
    current_period_end: number;
    cancel_at_period_end: boolean;
  };
}

export interface Invoice {
  id: string;
  amount_due: number;
  amount_paid: number;
  status: string;
  created: number;
  invoice_pdf?: string;
  hosted_invoice_url?: string;
}
