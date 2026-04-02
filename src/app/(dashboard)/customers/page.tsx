"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  UserPlus,
  CalendarDays,
} from "lucide-react";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
  type CustomerInfo,
  type CustomerDetail,
  type CustomerStats,
} from "@/lib/api";

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  pt: "Portuguese",
  es: "Spanish",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerInfo[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage] = useState(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedDetail, setExpandedDetail] = useState<CustomerDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "Orlando",
    state: "FL",
    language: "en",
    notes: "",
  });

  const loadCustomers = useCallback(() => {
    setLoading(true);
    getCustomers(page, search || undefined)
      .then((res) => {
        setCustomers(res.items);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search]);

  const loadStats = () => {
    getCustomerStats().then(setStats).catch(console.error);
  };

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    loadStats();
  }, []);

  const totalPages = Math.ceil(total / perPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "Orlando",
      state: "FL",
      language: "en",
      notes: "",
    });
    setShowForm(false);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      email: form.email || undefined,
      notes: form.notes || undefined,
    };
    if (editId) {
      await updateCustomer(editId, payload);
    } else {
      await createCustomer(payload);
    }
    resetForm();
    loadCustomers();
    loadStats();
  };

  const handleEdit = (c: CustomerInfo) => {
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email ?? "",
      address: c.address ?? "",
      city: c.city ?? "Orlando",
      state: c.state ?? "FL",
      language: c.language ?? "en",
      notes: c.notes ?? "",
    });
    setEditId(c.id);
    setShowForm(true);
    setExpandedId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this customer? This cannot be undone.")) {
      await deleteCustomer(id);
      loadCustomers();
      loadStats();
    }
  };

  const handleExpand = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedDetail(null);
      return;
    }
    setExpandedId(id);
    setExpandedDetail(null);
    setLoadingDetail(true);
    try {
      const detail = await getCustomer(id);
      setExpandedDetail(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="mt-1 text-gray-500">Manage your customer database</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className="rounded-lg bg-blue-50 p-2">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total_customers}</p>
              <p className="text-xs text-gray-500">Total Customers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className="rounded-lg bg-green-50 p-2">
              <UserPlus className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.new_this_month}</p>
              <p className="text-xs text-gray-500">New This Month</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className="rounded-lg bg-purple-50 p-2">
              <CalendarDays className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.with_appointments_this_month}</p>
              <p className="text-xs text-gray-500">Active This Month</p>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearchInput("");
              setSearch("");
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Create/Edit Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-lg border border-gray-200 bg-white p-6"
        >
          <h3 className="font-semibold">{editId ? "Edit" : "Add"} Customer</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="Phone (+1...)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <select
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
            </select>
            <input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="col-span-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="col-span-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={3}
            />
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              {editId ? "Save Changes" : "Add Customer"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Customer Table */}
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        {loading ? (
          <div className="py-12 text-center text-gray-400">Loading...</div>
        ) : customers.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            {search ? "No customers match your search." : "No customers yet. Add your first one above."}
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="hidden px-4 py-3 md:table-cell">Email</th>
                <th className="hidden px-4 py-3 lg:table-cell">Appointments</th>
                <th className="hidden px-4 py-3 lg:table-cell">Total Spent</th>
                <th className="hidden px-4 py-3 md:table-cell">Last Visit</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <CustomerRow
                  key={c.id}
                  customer={c}
                  isExpanded={expandedId === c.id}
                  detail={expandedId === c.id ? expandedDetail : null}
                  loadingDetail={expandedId === c.id && loadingDetail}
                  onExpand={() => handleExpand(c.id)}
                  onEdit={() => handleEdit(c)}
                  onDelete={() => handleDelete(c.id)}
                  formatDate={formatDate}
                  formatCurrency={formatCurrency}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} of{" "}
            {total}
          </span>
          <div className="flex gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// -- Customer Row with expandable detail ------------------------------------

function CustomerRow({
  customer,
  isExpanded,
  detail,
  loadingDetail,
  onExpand,
  onEdit,
  onDelete,
  formatDate,
  formatCurrency,
}: {
  customer: CustomerInfo;
  isExpanded: boolean;
  detail: CustomerDetail | null;
  loadingDetail: boolean;
  onExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  formatDate: (d?: string | null) => string;
  formatCurrency: (n: number) => string;
}) {
  return (
    <>
      <tr
        className="cursor-pointer hover:bg-gray-50"
        onClick={onExpand}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
            )}
            <span className="font-medium">{customer.name}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-gray-600">{customer.phone}</td>
        <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
          {customer.email || "-"}
        </td>
        <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
          {customer.appointment_count}
        </td>
        <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">
          {formatCurrency(customer.total_spent)}
        </td>
        <td className="hidden px-4 py-3 text-gray-600 md:table-cell">
          {formatDate(customer.last_appointment_date)}
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="rounded-lg border border-gray-300 p-1.5 hover:bg-gray-50"
            >
              <Pencil className="h-3.5 w-3.5 text-gray-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="rounded-lg border border-gray-300 p-1.5 hover:bg-gray-50"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={7} className="border-t border-gray-100 bg-gray-50 px-6 py-4">
            {loadingDetail ? (
              <p className="text-center text-sm text-gray-400">Loading details...</p>
            ) : detail ? (
              <div className="space-y-4">
                {/* Customer info */}
                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <span className="text-xs font-medium uppercase text-gray-400">Address</span>
                    <p className="mt-0.5 text-gray-700">
                      {detail.address || "-"}
                      {detail.city && `, ${detail.city}`}
                      {detail.state && `, ${detail.state}`}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase text-gray-400">Language</span>
                    <p className="mt-0.5 text-gray-700">
                      {LANGUAGE_LABELS[detail.language] || detail.language}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase text-gray-400">Total Spent</span>
                    <p className="mt-0.5 font-semibold text-gray-700">
                      {formatCurrency(detail.total_spent)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium uppercase text-gray-400">Customer Since</span>
                    <p className="mt-0.5 text-gray-700">{formatDate(detail.created_at)}</p>
                  </div>
                </div>
                {detail.notes && (
                  <div className="text-sm">
                    <span className="text-xs font-medium uppercase text-gray-400">Notes</span>
                    <p className="mt-0.5 whitespace-pre-wrap text-gray-700">{detail.notes}</p>
                  </div>
                )}

                {/* Recent Appointments */}
                <div>
                  <h4 className="text-xs font-medium uppercase text-gray-400">
                    Recent Appointments ({detail.appointments.length})
                  </h4>
                  {detail.appointments.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-400">No appointments yet.</p>
                  ) : (
                    <div className="mt-2 space-y-1">
                      {detail.appointments.map((a) => (
                        <div
                          key={a.id}
                          className="flex flex-col gap-1 rounded-lg bg-white px-3 py-2 text-xs sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                a.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : a.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : a.status === "scheduled"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {a.status}
                            </span>
                            <span className="text-gray-600">
                              {formatDate(a.scheduled_date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 truncate max-w-[200px]">
                              {a.problem_description}
                            </span>
                            <span className="font-medium text-gray-700">
                              {formatCurrency(a.visit_fee)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-sm text-gray-400">
                Could not load customer details.
              </p>
            )}
          </td>
        </tr>
      )}
    </>
  );
}
