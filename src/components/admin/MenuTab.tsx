'use client';

import { useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { api, useResource } from './api';
import { AdminButton, EmptyState, Field, Modal, Spinner, Toggle } from './ui';
import { CATEGORIES, type MenuItem } from '@/lib/types';
import { formatPrice } from '@/lib/format';

type Draft = {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  badge: string;
  sort_order: string;
  is_available: boolean;
  is_featured: boolean;
};

const emptyDraft: Draft = {
  name: '',
  description: '',
  price: '0',
  category: CATEGORIES[0],
  image: '',
  badge: '',
  sort_order: '0',
  is_available: true,
  is_featured: false,
};

export default function MenuTab() {
  const { items, loading, error, reload, setItems } = useResource<MenuItem>('menu');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesCategory = category === 'All' || item.category === category;
        const matchesQuery =
          !query.trim() ||
          item.name.toLowerCase().includes(query.trim().toLowerCase()) ||
          item.category.toLowerCase().includes(query.trim().toLowerCase());
        return matchesCategory && matchesQuery;
      }),
    [items, query, category],
  );

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setFormError(null);
    setOpen(true);
  };

  const startEdit = (item: MenuItem) => {
    setEditing(item);
    setDraft({
      name: item.name,
      description: item.description,
      price: String(Number(item.price)),
      category: item.category,
      image: item.image,
      badge: item.badge ?? '',
      sort_order: String(item.sort_order),
      is_available: item.is_available,
      is_featured: item.is_featured,
    });
    setFormError(null);
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        name: draft.name.trim(),
        description: draft.description.trim(),
        price: Number(draft.price) || 0,
        category: draft.category,
        image: draft.image.trim(),
        badge: draft.badge.trim() || null,
        sort_order: Number(draft.sort_order) || 0,
        is_available: draft.is_available,
        is_featured: draft.is_featured,
      };
      if (!payload.name) throw new Error('A dish needs a name.');
      if (editing) {
        const data = await api<{ item: MenuItem }>(`/api/admin/menu/${editing.id}`, {
          method: 'PATCH',
          body: payload,
        });
        setItems((current) =>
          current.map((entry) => (entry.id === editing.id ? data.item : entry)),
        );
      } else {
        const data = await api<{ item: MenuItem }>('/api/admin/menu', {
          method: 'POST',
          body: payload,
        });
        setItems((current) => [...current, data.item]);
      }
      setOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (item: MenuItem, key: 'is_available' | 'is_featured') => {
    const nextValue = !item[key];
    setItems((current) =>
      current.map((entry) => (entry.id === item.id ? { ...entry, [key]: nextValue } : entry)),
    );
    try {
      await api(`/api/admin/menu/${item.id}`, { method: 'PATCH', body: { [key]: nextValue } });
    } catch {
      reload();
    }
  };

  const remove = async (item: MenuItem) => {
    if (!window.confirm(`Delete “${item.name}” from the menu?`)) return;
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    try {
      await api(`/api/admin/menu/${item.id}`, { method: 'DELETE' });
    } catch {
      reload();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-cream">Menu management</h1>
          <p className="mt-1 text-sm text-beige">
            {items.length} items across six chapters · edits appear on the site immediately.
          </p>
        </div>
        <AdminButton onClick={startCreate}>
          <Plus size={14} /> New item
        </AdminButton>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-beige/50" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the menu"
            aria-label="Search the menu"
            className="field h-11 rounded-full pl-10 text-sm"
          />
        </div>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
          className="field h-11 w-full appearance-none rounded-full px-4 text-sm sm:w-52"
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Spinner label="Loading the menu" />
      ) : error ? (
        <EmptyState message={error} />
      ) : filtered.length === 0 ? (
        <EmptyState message="No items match those filters." />
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl2 border border-gold/15">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-ink/60 text-[9px] uppercase tracking-[0.18em] text-beige/70">
              <tr>
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Visible</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/8">
              {filtered.map((item) => (
                <tr key={item.id} className="bg-wine/20 transition-colors hover:bg-wine/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-lg border border-cream/10 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="h-12 w-12 shrink-0 rounded-lg border border-dashed border-cream/20" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-cream">{item.name}</p>
                        <p className="max-w-[280px] truncate text-xs text-beige/60">
                          {item.description || 'No description'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-beige">{item.category}</td>
                  <td className="px-4 py-3 text-gold">{formatPrice(item.price)}</td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={item.is_available}
                      onChange={() => toggle(item, 'is_available')}
                      label={item.is_available ? 'Live' : 'Hidden'}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Toggle
                      checked={item.is_featured}
                      onChange={() => toggle(item, 'is_featured')}
                      label={item.is_featured ? 'Featured' : 'Standard'}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        aria-label={`Edit ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/12 text-beige transition hover:border-gold/50 hover:text-gold"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item)}
                        aria-label={`Delete ${item.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/12 text-beige transition hover:border-red-300/50 hover:text-red-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit menu item' : 'New menu item'}
        description="Changes go live on the menu the moment you save."
        footer={
          <div className="flex justify-end gap-3">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={save} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Create item'}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Name">
            <input
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className="field"
              placeholder="Charcoal lamb kebab"
            />
          </Field>
          <Field label="Description">
            <textarea
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              rows={3}
              className="field resize-none"
              placeholder="What makes this plate special?"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                className="field appearance-none"
              >
                {CATEGORIES.map((entry) => (
                  <option key={entry} value={entry}>
                    {entry}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Price (₺)" hint="Sample price — replace with your real menu price.">
              <input
                type="number"
                min="0"
                step="0.01"
                value={draft.price}
                onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                className="field"
              />
            </Field>
          </div>
          <Field label="Image URL" hint="Paste a link to a photograph, or leave empty for a placeholder.">
            <input
              value={draft.image}
              onChange={(event) => setDraft({ ...draft, image: event.target.value })}
              className="field"
              placeholder="https://…"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Badge" hint="Optional label, e.g. House Icon">
              <input
                value={draft.badge}
                onChange={(event) => setDraft({ ...draft, badge: event.target.value })}
                className="field"
              />
            </Field>
            <Field label="Sort order" hint="Lower numbers appear first.">
              <input
                type="number"
                value={draft.sort_order}
                onChange={(event) => setDraft({ ...draft, sort_order: event.target.value })}
                className="field"
              />
            </Field>
          </div>
          <div className="flex flex-wrap gap-3">
            <Toggle
              checked={draft.is_available}
              onChange={(value) => setDraft({ ...draft, is_available: value })}
              label="Visible on menu"
            />
            <Toggle
              checked={draft.is_featured}
              onChange={(value) => setDraft({ ...draft, is_featured: value })}
              label="Featured"
            />
          </div>
          {formError && (
            <p role="alert" className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-cream">
              {formError}
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
