"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  getPricebookCategories,
  createPricebookCategory,
  deletePricebookCategory,
  getPricebookItems,
  createPricebookItem,
  updatePricebookItem,
  deletePricebookItem,
  seedDefaultPricebook,
  type PricebookCategory,
  type PricebookItem,
} from "@/lib/api";
import { SkeletonRows } from "@/components/empty-state";

const EMPTY_ITEM: Partial<PricebookItem> = {
  name: "",
  description: "",
  price_good: 0,
  price_better: 0,
  price_best: 0,
  label_good: "Good",
  label_better: "Better",
  label_best: "Best",
  desc_good: "",
  desc_better: "",
  desc_best: "",
};

export default function PricebookPage() {
  const [categories, setCategories] = useState<PricebookCategory[]>([]);
  const [items, setItems] = useState<Record<string, PricebookItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [showAddCat, setShowAddCat] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<PricebookItem> | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [savingItem, setSavingItem] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "category" | "item"; id: string; name: string } | null>(null);

  const loadData = async () => {
    try {
      const cats = await getPricebookCategories();
      setCategories(cats);
      const allItems = await getPricebookItems();
      const grouped: Record<string, PricebookItem[]> = {};
      for (const item of allItems) {
        if (!grouped[item.category_id]) grouped[item.category_id] = [];
        grouped[item.category_id].push(item);
      }
      setItems(grouped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedDefaultPricebook();
      await loadData();
    } catch (e) {
      console.error(e);
    }
    setSeeding(false);
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      await createPricebookCategory({ name: newCatName.trim() });
      setNewCatName("");
      setShowAddCat(false);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deletePricebookCategory(id);
      setConfirmDelete(null);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveItem = async () => {
    if (!editingItem || !editingCatId) return;
    setSavingItem(true);
    try {
      if (editingItemId) {
        await updatePricebookItem(editingItemId, editingItem);
      } else {
        await createPricebookItem({ ...editingItem, category_id: editingCatId });
      }
      setEditingItem(null);
      setEditingItemId(null);
      setEditingCatId(null);
      await loadData();
    } catch (e) {
      console.error(e);
    }
    setSavingItem(false);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deletePricebookItem(id);
      setConfirmDelete(null);
      await loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const startAddItem = (catId: string) => {
    setEditingItem({ ...EMPTY_ITEM });
    setEditingItemId(null);
    setEditingCatId(catId);
  };

  const startEditItem = (item: PricebookItem) => {
    setEditingItem({ ...item });
    setEditingItemId(item.id);
    setEditingCatId(item.category_id);
  };

  if (loading) {
    return (
      <div className="mt-6">
        <SkeletonRows count={5} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pricebook</h1>
          <p className="mt-1 text-gray-500">Manage your service pricing for quotes</p>
        </div>
        <button
          onClick={() => setShowAddCat(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Seed button if no categories */}
      {categories.length === 0 && !showAddCat && (
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12">
          <BookOpen className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-700">No pricebook yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started quickly with common HVAC services and pricing</p>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="mt-6 flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {seeding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {seeding ? "Loading defaults..." : "Load Default HVAC Pricebook"}
          </button>
        </div>
      )}

      {/* Add Category Form */}
      {showAddCat && (
        <div className="mt-4 flex items-center gap-2">
          <input
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="Category name"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            autoFocus
          />
          <button onClick={handleAddCategory} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Add
          </button>
          <button onClick={() => { setShowAddCat(false); setNewCatName(""); }} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      )}

      {/* Categories Accordion */}
      <div className="mt-6 space-y-3">
        {categories.map((cat) => {
          const isExpanded = expandedCat === cat.id;
          const catItems = items[cat.id] || [];
          return (
            <div key={cat.id} className="rounded-lg border border-gray-200 bg-white">
              <button
                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    {cat.item_count} item{cat.item_count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete({ type: "category", id: cat.id, name: cat.name }); }}
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 px-5 pb-4">
                  {catItems.length > 0 ? (
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
                            <th className="pb-2 pr-4">Name</th>
                            <th className="pb-2 pr-4 text-right">Good $</th>
                            <th className="pb-2 pr-4 text-right">Better $</th>
                            <th className="pb-2 pr-4 text-right">Best $</th>
                            <th className="pb-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {catItems.map((item) => (
                            <tr key={item.id} className="border-b border-gray-50">
                              <td className="py-2.5 pr-4">
                                <span className="font-medium text-gray-800">{item.name}</span>
                                {item.description && (
                                  <p className="text-xs text-gray-400">{item.description}</p>
                                )}
                              </td>
                              <td className="py-2.5 pr-4 text-right text-gray-700">${item.price_good.toFixed(2)}</td>
                              <td className="py-2.5 pr-4 text-right text-gray-700">${item.price_better.toFixed(2)}</td>
                              <td className="py-2.5 pr-4 text-right text-gray-700">${item.price_best.toFixed(2)}</td>
                              <td className="py-2.5 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => startEditItem(item)}
                                    className="rounded p-1 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete({ type: "item", id: item.id, name: item.name })}
                                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-gray-400">No items in this category yet.</p>
                  )}
                  <button
                    onClick={() => startAddItem(cat.id)}
                    className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Item Add/Edit Modal */}
      {editingItem && editingCatId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editingItemId ? "Edit Item" : "Add Item"}</h3>
              <button onClick={() => { setEditingItem(null); setEditingItemId(null); setEditingCatId(null); }} className="rounded p-1 hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  value={editingItem.name ?? ""}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="e.g. AC Tune-Up"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editingItem.description ?? ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Brief description of the service"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Good Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.price_good ?? 0}
                    onChange={(e) => setEditingItem({ ...editingItem, price_good: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    value={editingItem.desc_good ?? ""}
                    onChange={(e) => setEditingItem({ ...editingItem, desc_good: e.target.value })}
                    placeholder="Tier description"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Better Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.price_better ?? 0}
                    onChange={(e) => setEditingItem({ ...editingItem, price_better: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    value={editingItem.desc_better ?? ""}
                    onChange={(e) => setEditingItem({ ...editingItem, desc_better: e.target.value })}
                    placeholder="Tier description"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Best Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.price_best ?? 0}
                    onChange={(e) => setEditingItem({ ...editingItem, price_best: parseFloat(e.target.value) || 0 })}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    value={editingItem.desc_best ?? ""}
                    onChange={(e) => setEditingItem({ ...editingItem, desc_best: e.target.value })}
                    placeholder="Tier description"
                    className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1 text-xs"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => { setEditingItem(null); setEditingItemId(null); setEditingCatId(null); }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                disabled={savingItem || !editingItem.name?.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {savingItem ? "Saving..." : editingItemId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
              {confirmDelete.type === "category" && " All items in this category will also be deleted."}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  confirmDelete.type === "category"
                    ? handleDeleteCategory(confirmDelete.id)
                    : handleDeleteItem(confirmDelete.id)
                }
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
