"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/fetch-json";

const DISPLAY_USER = "cal";

export default function EventTypesPage() {
  const [events, setEvents] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hiddenMap, setHiddenMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    duration: 30,
    buffer: 10,
    description: "",
    scheduleId: "",
  });
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    Promise.all([fetchJson("/api/event-types"), fetchJson("/api/schedules")])
      .then(([evR, schR]) => {
        if (!evR.ok || evR.data?.error) {
          setLoadError(evR.data?.error || "Failed to load event types.");
          setEvents([]);
        } else {
          setEvents(Array.isArray(evR.data) ? evR.data : []);
        }
        if (!schR.ok || schR.data?.error) {
          setLoadError((prev) => prev || schR.data?.error || "Failed to load schedules.");
          setSchedules([]);
        } else {
          setSchedules(Array.isArray(schR.data) ? schR.data : []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) =>
        e.title?.toLowerCase().includes(q) ||
        e.slug?.toLowerCase().includes(q)
    );
  }, [events, search]);

  const saveEvent = async (e) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.slug?.trim()) return;

    setSaving(true);

    try {
      const res = await fetch("/api/event-types", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          title: form.title.trim(),
          slug: form.slug.trim(),
          duration: Number(form.duration) || 30,
          buffer: Number(form.buffer) || 0,
          description: form.description?.trim() || null,
          scheduleId: form.scheduleId ? Number(form.scheduleId) : null,
        }),
      });

      if (!res.ok) throw new Error();

      setModalOpen(false);
      setEditingId(null);

      const def = schedules.find((s) => s.isDefault);
      setForm({
        title: "",
        slug: "",
        duration: 30,
        buffer: 10,
        description: "",
        scheduleId: def ? String(def.id) : "",
      });

      load();
    } catch {
      alert("Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event type?")) return;
    await fetch("/api/event-types", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const copyLink = (slug) => {
    const path = `${typeof window !== "undefined" ? window.location.origin : ""}/book/${slug}`;
    navigator.clipboard.writeText(path).catch(() => {});
  };

  const openCreateModal = () => {
    const def = schedules.find((s) => s.isDefault);
    setForm({
      title: "",
      slug: "",
      duration: 30,
      buffer: 10,
      description: "",
      scheduleId: def ? String(def.id) : "",
    });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (ev) => {
    setForm({
      title: ev.title,
      slug: ev.slug,
      duration: ev.duration,
      buffer: ev.buffer || 10,
      description: ev.description || "",
      scheduleId: ev.scheduleId ? String(ev.scheduleId) : "",
    });
    setEditingId(ev.id);
    setModalOpen(true);
  };

  const changeEventSchedule = async (ev, scheduleIdStr) => {
    const scheduleId = scheduleIdStr ? Number(scheduleIdStr) : null;
    try {
      const res = await fetch("/api/event-types", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: ev.id,
          title: ev.title,
          description: ev.description ?? null,
          duration: ev.duration,
          slug: ev.slug,
          scheduleId,
        }),
      });
      if (!res.ok) throw new Error("fail");
      load();
    } catch {
      alert("Could not update schedule.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#09090b]/95 px-6 py-5 backdrop-blur-md">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Event types</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Configure different events for people to book on your calendar.
            </p>
          </div>
          <div className="mt-4 flex shrink-0 items-center gap-2 sm:mt-0">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-white/[0.08] bg-[#18181b] py-2 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 sm:w-56"
              />
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              + New
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-6">
        {loadError && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
            {loadError}
          </p>
        )}
        {loading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] py-20 text-center">
            <p className="text-sm text-zinc-500">No event types match your search.</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-4 text-sm font-medium text-white underline-offset-2 hover:underline"
            >
              Create your first event type
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0c0c0c]">
            <ul className="divide-y divide-white/[0.06]">
              {filtered.map((ev) => {
                const hidden = hiddenMap[ev.id] === true;
                const bookUrl = `/book/${ev.slug}`;
                const displayUrl = `/${DISPLAY_USER}/${ev.slug}`;
                return (
                  <li key={ev.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-white">{ev.title}</span>
                        {hidden && (
                          <span className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-sm text-zinc-500">{displayUrl}</p>
                      <p className="mt-1 text-xs text-zinc-600">{ev.duration}m</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <label className="text-[10px] font-medium uppercase tracking-wide text-zinc-600">Schedule</label>
                        <select
                          value={
                            ev.scheduleId != null
                              ? String(ev.scheduleId)
                              : String(schedules.find((s) => s.isDefault)?.id ?? schedules[0]?.id ?? "")
                          }
                          onChange={(e) => changeEventSchedule(ev, e.target.value)}
                          className="max-w-[200px] rounded-md border border-white/[0.08] bg-[#18181b] px-2 py-1 text-xs text-zinc-300 focus:border-white/20 focus:outline-none"
                        >
                          {schedules.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                              {s.isDefault ? " (default)" : ""}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!hidden}
                        onClick={() =>
                          setHiddenMap((m) => ({ ...m, [ev.id]: !hidden }))
                        }
                        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                          hidden ? "bg-zinc-700" : "bg-emerald-600"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                            hidden ? "left-0.5" : "left-[22px]"
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(ev)}
                        className="rounded-md p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <a
                        href={bookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                        title="Open booking page"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <button
                        type="button"
                        onClick={() => copyLink(ev.slug)}
                        className="rounded-md p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                        title="Copy link"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-2a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ev.id)}
                        className="rounded-md p-2 text-zinc-600 hover:bg-red-500/10 hover:text-red-400"
                        title="Delete"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal>
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#18181b] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white">
              {editingId ? "Edit event type" : "Add a new event type"}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">Set up event types to offer different types of meetings.</p>
            <form onSubmit={saveEvent} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Title</label>
                <input
                  required
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0c0c0c] px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="30 min meeting"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">URL slug</label>
                <div className="flex rounded-lg border border-white/[0.08] bg-[#0c0c0c]">
                  <span className="shrink-0 border-r border-white/[0.06] px-3 py-2.5 text-xs text-zinc-500">
                    /book/
                  </span>
                  <input
                    required
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.replace(/\s+/g, "-").toLowerCase() }))}
                    placeholder="30min"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Duration (minutes)</label>
                <input
                  type="number"
                  min={5}
                  step={5}
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0c0c0c] px-3 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Buffer time (minutes)</label>
                <input
                  type="number"
                  min={0}
                  step={5}
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0c0c0c] px-3 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none"
                  value={form.buffer}
                  onChange={(e) => setForm((f) => ({ ...f, buffer: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">Availability schedule</label>
                <select
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0c0c0c] px-3 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none"
                  value={form.scheduleId}
                  onChange={(e) => setForm((f) => ({ ...f, scheduleId: e.target.value }))}
                >
                  {schedules.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                      {s.isDefault ? " · default" : ""}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-zinc-600">
                  Uses the same hours as Availability. Edit schedules under Availability — all linked event types update.
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
