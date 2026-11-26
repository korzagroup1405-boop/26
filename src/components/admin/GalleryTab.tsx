'use client';

import { useState } from 'react';
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { api, useResource } from './api';
import { AdminButton, EmptyState, Field, Modal, Spinner } from './ui';
import type { GalleryImage } from '@/lib/types';

type Draft = {
  title: string;
  category: string;
  image: string;
  sort_order: string;
  is_visible: boolean;
};

const emptyDraft: Draft = {
  title: '',
  category: 'Interior',
  image: '',
  sort_order: '0',
  is_visible: true,
};

const CATEGORY_OPTIONS = ['Interior', 'Shisha', 'Kitchen', 'Detail', 'Terrace'];

export default function GalleryTab() {
  const { items, loading, error, reload, setItems } = useResource<GalleryImage>('gallery');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<GalleryImage | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const startCreate = () => {
    setEditing(null);
    setDraft({ ...emptyDraft, sort_order: String(items.length) });
    setFormError(null);
    setOpen(true);
  };

  const startEdit = (image: GalleryImage) => {
    setEditing(image);
    setDraft({
      title: image.title,
      category: image.category,
      image: image.image,
      sort_order: String(image.sort_order),
      is_visible: image.is_visible,
    });
    setFormError(null);
    setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        title: draft.title.trim(),
        category: draft.category,
        image: draft.image.trim(),
        sort_order: Number(draft.sort_order) || 0,
        is_visible: draft.is_visible,
      };
      if (!payload.title) throw new Error('Give the photograph a title.');
      if (!payload.image) throw new Error('An image URL is required.');
      if (editing) {
        const data = await api<{ item: GalleryImage }>(`/api/admin/gallery/${editing.id}`, {
          method: 'PATCH',
          body: payload,
        });
        setItems((current) => current.map((entry) => (entry.id === editing.id ? data.item : entry)));
      } else {
        const data = await api<{ item: GalleryImage }>('/api/admin/gallery', {
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

  const toggleVisible = async (image: GalleryImage) => {
    const next = !image.is_visible;
    setItems((current) =>
      current.map((entry) => (entry.id === image.id ? { ...entry, is_visible: next } : entry)),
    );
    try {
      await api(`/api/admin/gallery/${image.id}`, {
        method: 'PATCH',
        body: { is_visible: next },
      });
    } catch {
      reload();
    }
  };

  const remove = async (image: GalleryImage) => {
    if (!window.confirm(`Remove “${image.title}” from the gallery?`)) return;
    setItems((current) => current.filter((entry) => entry.id !== image.id));
    try {
      await api(`/api/admin/gallery/${image.id}`, { method: 'DELETE' });
    } catch {
      reload();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-cream">Gallery</h1>
          <p className="mt-1 text-sm text-beige">
            {items.length} photographs · hidden images stay out of the public gallery.
          </p>
        </div>
        <AdminButton onClick={startCreate}>
          <Plus size={14} /> Add image
        </AdminButton>
      </div>

      {loading ? (
        <Spinner label="Loading the gallery" />
      ) : error ? (
        <EmptyState message={error} />
      ) : items.length === 0 ? (
        <EmptyState message="The gallery is empty — add your first photograph." />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((image) => (
            <article
              key={image.id}
              className="group overflow-hidden rounded-xl2 border border-gold/15 bg-wine/30"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={image.image}
                  alt={image.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {!image.is_visible && (
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/70 text-[9px] uppercase tracking-[0.22em] text-beige">
                    Hidden
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-[9px] uppercase tracking-[0.2em] text-gold/70">{image.category}</p>
                <p className="mt-1 truncate font-display text-lg text-cream">{image.title}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleVisible(image)}
                    aria-label={image.is_visible ? `Hide ${image.title}` : `Show ${image.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/12 text-beige transition hover:border-gold/50 hover:text-gold"
                  >
                    {image.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(image)}
                    aria-label={`Edit ${image.title}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/12 text-beige transition hover:border-gold/50 hover:text-gold"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(image)}
                    aria-label={`Delete ${image.title}`}
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-cream/12 text-beige transition hover:border-red-300/50 hover:text-red-200"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit photograph' : 'Add photograph'}
        footer={
          <div className="flex justify-end gap-3">
            <AdminButton variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={save} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save changes' : 'Add to gallery'}
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-4">
          <Field label="Title">
            <input
              value={draft.title}
              onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              className="field"
              placeholder="The Amber Salon"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                className="field appearance-none"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                value={draft.sort_order}
                onChange={(event) => setDraft({ ...draft, sort_order: event.target.value })}
                className="field"
              />
            </Field>
          </div>
          <Field label="Image URL">
            <input
              value={draft.image}
              onChange={(event) => setDraft({ ...draft, image: event.target.value })}
              className="field"
              placeholder="https://…"
            />
          </Field>
          {draft.image && (
            <img
              src={draft.image}
              alt="Preview"
              className="aspect-[4/3] w-full rounded-xl border border-cream/10 object-cover"
            />
          )}
          <label className="flex items-center gap-3 text-sm text-beige">
            <input
              type="checkbox"
              checked={draft.is_visible}
              onChange={(event) => setDraft({ ...draft, is_visible: event.target.checked })}
              className="h-4 w-4 accent-[#F9B923]"
            />
            Visible in the public gallery
          </label>
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
