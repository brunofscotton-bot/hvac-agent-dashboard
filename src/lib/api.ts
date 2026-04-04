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
export const getCallDetail = (id: string) => fetchAPI<CallLog>(`/dashboard/calls/${id}`);

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

// Customers
export const getCustomers = (page = 1, search?: string) => {
  const params = new URLSearchParams({ page: String(page), per_page: "20" });
  if (search) params.set("search", search);
  return fetchAPI<PaginatedResponse<CustomerInfo>>(`/customers?${params}`);
};
export const getCustomer = (id: string) => fetchAPI<CustomerDetail>(`/customers/${id}`);
export const createCustomer = (data: Partial<CustomerInfo>) =>
  fetchAPI<{ id: string; name: string }>("/customers", { method: "POST", body: JSON.stringify(data) });
export const updateCustomer = (id: string, data: Partial<CustomerInfo>) =>
  fetchAPI(`/customers/${id}`, { method: "PATCH", body: JSON.stringify(data) });
export const deleteCustomer = (id: string) =>
  fetchAPI(`/customers/${id}`, { method: "DELETE" });
export const getCustomerStats = () => fetchAPI<CustomerStats>("/customers/stats");

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

// Admin (platform owner)
export const getAdminCompanies = () => fetchAPI<AdminCompany[]>("/admin/companies");
export const getAdminStats = () => fetchAPI<AdminPlatformStats>("/admin/stats");
export const getAdminCompanyDetail = (id: string) => fetchAPI<AdminCompanyDetail>(`/admin/companies/${id}`);
export const deleteAdminCompany = (id: string) =>
  fetchAPI<{ success: boolean; message: string }>(`/admin/companies/${id}`, { method: "DELETE" });
export const resetAdminOnboarding = (id: string) =>
  fetchAPI<{ success: boolean; message: string }>(`/admin/companies/${id}/reset-onboarding`, { method: "POST" });
export const getAdminCosts = () => fetchAPI<AdminInfraCosts>("/admin/costs");
export const deployAssistantAll = () =>
  fetchAPI<{ updated: number; failed: number; errors: string[] }>("/admin/deploy-assistant", { method: "POST" });
export const deployAssistantCompany = (id: string) =>
  fetchAPI<{ success: boolean; message: string }>(`/admin/companies/${id}/deploy-assistant`, { method: "POST" });

// Support Tickets
export const createSupportTicket = (data: { subject: string; message: string; category?: string }) =>
  fetchAPI<{ id: string; message: string }>("/support/tickets", { method: "POST", body: JSON.stringify(data) });
export const getSupportTickets = () => fetchAPI<SupportTicket[]>("/support/tickets");

// Admin - Support Tickets
export const getAdminTickets = () => fetchAPI<AdminTicket[]>("/admin/tickets");
export const updateAdminTicket = (id: string, data: { status?: string; admin_notes?: string }) =>
  fetchAPI(`/admin/tickets/${id}`, { method: "PATCH", body: JSON.stringify(data) });

// Google Calendar
export const sendCalendarInstructions = (techId: string) =>
  fetchAPI<{ success: boolean; message_sid: string }>(`/technicians/${techId}/send-calendar-instructions`, { method: "POST" });

// Integrations (Jobber)
export const getJobberStatus = () => fetchAPI<{ connected: boolean }>("/integrations/jobber/status");
export const disconnectJobber = () =>
  fetchAPI<{ success: boolean; message: string }>("/integrations/jobber/disconnect", { method: "POST" });
export const syncJobberTechnicians = () =>
  fetchAPI<{ success: boolean; imported: number; skipped: number; total_found: number }>("/integrations/jobber/sync-technicians", { method: "POST" });
export const syncJobberSchedules = () =>
  fetchAPI<{ success: boolean; updated: number; message: string }>("/integrations/jobber/sync-schedules", { method: "POST" });

// Pricebook
export const getPricebookCategories = () => fetchAPI<PricebookCategory[]>("/pricebook/categories");
export const createPricebookCategory = (data: { name: string }) =>
  fetchAPI<{ id: string; name: string }>("/pricebook/categories", { method: "POST", body: JSON.stringify(data) });
export const deletePricebookCategory = (id: string) =>
  fetchAPI("/pricebook/categories/" + id, { method: "DELETE" });
export const getPricebookItems = (categoryId?: string) =>
  fetchAPI<PricebookItem[]>(`/pricebook/items${categoryId ? `?category_id=${categoryId}` : ""}`);
export const createPricebookItem = (data: Partial<PricebookItem>) =>
  fetchAPI<{ id: string; name: string }>("/pricebook/items", { method: "POST", body: JSON.stringify(data) });
export const updatePricebookItem = (id: string, data: Partial<PricebookItem>) =>
  fetchAPI("/pricebook/items/" + id, { method: "PATCH", body: JSON.stringify(data) });
export const deletePricebookItem = (id: string) =>
  fetchAPI("/pricebook/items/" + id, { method: "DELETE" });
export const seedDefaultPricebook = () =>
  fetchAPI<{ success: boolean; message: string }>("/pricebook/seed-defaults", { method: "POST" });

// ── Types ───────────────────────────────────────────────────────────────────

export interface DashboardStats {
  today_appointments: number;
  week_appointments: number;
  month_calls: number;
  month_bookings: number;
  month_revenue: number;
  conversion_rate: number;
  callbacks_pending?: number;
  week_revenue?: number;
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
  greeting_message?: string;
  recording_disclosure?: string;
  service_area_zip_codes?: string;
  languages_supported: string;
  service_fee: number;
  after_hours_fee: number;
  fee_applies_to_service: boolean;
  business_hours_start: number;
  business_hours_end: number;
  call_escalation_enabled?: boolean;
  emergency_mode?: string;
  oncall_phone?: string;
  oncall_backup_phone?: string;
  oncall_end_hour?: number;
}

export interface CallLog {
  id: string;
  caller_phone?: string;
  duration_seconds?: number;
  language_detected?: string;
  outcome?: string;
  summary?: string;
  transcript?: string;
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
  city: string;
  state: string;
  service_fee: number;
  after_hours_fee: number;
  fee_applies_to_service: boolean;
  business_hours_start: number;
  business_hours_end: number;
  technicians: {
    name: string;
    phone: string;
    email?: string;
    calendar_provider?: string;
    specialties?: string;
    works_after_hours: boolean;
    works_weekends: boolean;
  }[];
  agent_name: string;
  languages_supported: string;
  greeting_message?: string;
  voice_gender: string;
  send_calendar_sms?: boolean;
  service_area_zip_codes?: string;
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

export interface CustomerInfo {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  language: string;
  notes?: string;
  appointment_count: number;
  last_appointment_date?: string;
  total_spent: number;
  created_at: string;
}

export interface CustomerDetail extends CustomerInfo {
  appointments: {
    id: string;
    scheduled_date: string;
    status: string;
    urgency: string;
    problem_description: string;
    visit_fee: number;
    technician_id?: string;
    created_at: string;
  }[];
}

export interface CustomerStats {
  total_customers: number;
  new_this_month: number;
  with_appointments_this_month: number;
}

// Admin types
export interface AdminCompany {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  twilio_phone_number?: string;
  subscription_status?: string;
  subscription_plan?: string;
  onboarding_completed: boolean;
  is_active: boolean;
  created_at: string;
  technician_count: number;
  appointment_count: number;
  call_count: number;
}

export interface AdminCompanyDetail extends AdminCompany {
  address?: string;
  languages_supported?: string;
  agent_name?: string;
  service_fee?: number;
  after_hours_fee?: number;
  business_hours_start?: number;
  business_hours_end?: number;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  vapi_assistant_id?: string;
  updated_at?: string;
}

export interface AdminPlatformStats {
  total_companies: number;
  active_companies: number;
  active_subscriptions: number;
  trialing_subscriptions: number;
  onboarding_completed_count: number;
  total_calls_this_month: number;
  total_appointments_this_month: number;
  total_technicians: number;
  revenue_estimate: number;
}

export interface AdminCompanyCost {
  company_id: string;
  company_name: string;
  phone_number: string;
  call_count: number;
  estimated_cost: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  created_at: string;
}

export interface AdminTicket extends SupportTicket {
  company_name: string;
  company_email: string;
  admin_notes?: string;
}

export interface PricebookCategory {
  id: string;
  name: string;
  sort_order: number;
  item_count: number;
}

export interface PricebookItem {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  price_good: number;
  price_better: number;
  price_best: number;
  label_good: string;
  label_better: string;
  label_best: string;
  desc_good?: string;
  desc_better?: string;
  desc_best?: string;
  is_active: boolean;
  sort_order: number;
}

export interface AdminInfraCosts {
  period: string;
  twilio_phone_numbers: number;
  twilio_number_cost: number;
  twilio_call_minutes: number;
  twilio_call_cost: number;
  vapi_total_cost: number;
  vapi_call_count: number;
  total_cost: number;
  per_company: AdminCompanyCost[];
}
