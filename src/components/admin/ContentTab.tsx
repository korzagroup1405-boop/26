'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { api } from './api';
import { AdminButton, Field, Spinner } from './ui';

const GROUPS: { title: string; description: string; keys: { key: string; label: string; area?: boolean }[] }[] = [
  {
    title: 'Brand & hero',
    description: 'The first thing a guest reads.',
    keys: [
      { key: 'brand_name', label: 'Brand name' },
      { key: 'brand_sub', label: 'Brand subtitle' },
      { key: 'hero_eyebrow', label: 'Hero eyebrow' },
      { key: 'hero_title', label: 'Hero headline' },
      { key: 'hero_subtitle', label: 'Hero description', area: true },
      { key: 'hero_note', label: 'Hero note' },
    ],
  },
  {
    title: 'About the house',
    description: 'Used on the home page and the About page.',
    keys: [
      { key: 'about_title', label: 'About heading' },
      { key: 'about_text', label: 'About paragraph 1', area: true },
      { key: 'about_text_2', label: 'About paragraph 2', area: true },
    ],
  },
  {
    title: 'Contact & hours',
    description: 'Shown in the footer, contact page and reservation screens.',
    keys: [
      { key: 'address', label: 'Address' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'hours_week', label: 'Weekday hours' },
      { key: 'hours_weekend', label: 'Weekend hours' },
    ],
  },
  {
    title: 'Notes & policies',
    description: 'Small print shown to guests.',
    keys: [
      { key: 'reservation_note', label: 'Reservation note', area: true },
      { key: 'menu_note', label: 'Menu price note', area: true },
    ],
  },
  {
    title: 'Social links',
    description: 'Used by the footer and contact page.',
    keys: [
      { key: 'instagram', label: 'Instagram URL' },
      { key: 'facebook', label: 'Facebook URL' },
      { key: 'tiktok', label: 'TikTok URL' },
    ],
  },
];

export default function ContentTab() {
  const [content, setContent] = useState<Record<string, string> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ content: Record<string, string> }>('/api/admin/content')
      .then((data) => setContent(data.content))
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load content.'));
  }, []);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await api('/api/admin/content', { method: 'PUT', body: content });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  };

  if (!content) {
    return error ? <p className="py-10 text-sm text-beige">{error}</p> : <Spinner label="Loading content" />;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-cream">Website content</h1>
          <p className="mt-1 text-sm text-beige">
            Edit the words and details shown across the site.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-emerald-200">
              <Check size={13} /> Saved
            </span>
          )}
          <AdminButton onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Saving
              </>
            ) : (
              'Save changes'
            )}
          </AdminButton>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {GROUPS.map((group) => (
          <section key={group.title} className="rounded-xl2 border border-gold/15 bg-wine/30 p-5">
            <header className="border-b border-cream/8 pb-3">
              <h2 className="font-display text-xl text-cream">{group.title}</h2>
              <p className="mt-0.5 text-xs text-beige/60">{group.description}</p>
            </header>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {group.keys.map(({ key, label, area }) => (
                <Field key={key} label={label} className={area ? 'sm:col-span-2' : undefined}>
                  {area ? (
                    <textarea
                      value={content[key] ?? ''}
                      onChange={(event) => setContent({ ...content, [key]: event.target.value })}
                      rows={3}
                      className="field resize-none"
                    />
                  ) : (
                    <input
                      value={content[key] ?? ''}
                      onChange={(event) => setContent({ ...content, [key]: event.target.value })}
                      className="field"
                    />
                  )}
                </Field>
              ))}
            </div>
          </section>
        ))}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-cream">
          {error}
        </p>
      )}
    </div>
  );
}
