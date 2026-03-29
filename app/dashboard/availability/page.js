"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { summarizeScheduleRows } from "@/lib/availability-summary";
import { fetchJson } from "@/lib/fetch-json";

export default function AvailabilityListPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("Working hours");
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    fetchJson("/api/schedules")
      .then(({ ok, data }) => {
        if (!ok || data?.error) {
          setLoadError(data?.error || "Failed to load schedules.");
          setSchedules([]);
        } else {
          setSchedules(Array.isArray(data) ? data : []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createSchedule = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          copyFromId: schedules[0]?.id,
        }),
      });
      if (!res.ok) throw new Error("fail");
      const created = await res.json();
      setModalOpen(false);
      setNewName("Working hours");
      router.push(`/dashboard/availability/${created.id}`);
    } catch {
      alert("Could not create schedule.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/[0.06] px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">Availability</h1>
            <p className="mt-1 text-sm text-zinc-500">Configure times when you are available for bookings.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-lg border border-white/[0.08] bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300">
              My availability
            </span>
            <button
              type="button"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-white/5"
              disabled
            >
              Team availability
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black hover:bg-zinc-200"
            >
              + New
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-8">
        {loadError && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
            {loadError}
          </p>
        )}
        {loading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#0c0c0c]">
              <ul className="divide-y divide-white/[0.06]">
                {schedules.map((s) => {
                  const summary = summarizeScheduleRows(
                    s.availabilities?.map((a) => ({
                      dayOfWeek: a.dayOfWeek,
                      enabled: a.enabled,
                      startTime: a.startTime,
                      endTime: a.endTime,
                    })) ?? []
                  );
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/dashboard/availability/${s.id}`}
                        className="flex items-start justify-between gap-4 px-4 py-4 transition-colors hover:bg-white/[0.03]"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-white">{s.name}</span>
                            {s.isDefault && (
                              <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-sm text-zinc-400">
                            {summary || "No hours set"}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-600">
                            <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {s.timezone?.replace(/_/g, " ")}
                          </p>
                        </div>
                        <span className="text-zinc-600">···</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <p className="mt-6 text-center text-sm text-zinc-600">
              <button type="button" className="text-zinc-400 underline-offset-2 hover:text-white hover:underline">
                Temporarily out-of-office? Add a redirect
              </button>
            </p>
          </>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal>
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#18181b] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white">Add a new schedule</h2>
            <form onSubmit={createSchedule} className="mt-6 space-y-4">
              <div>
                <label htmlFor="sched-name" className="mb-1.5 block text-xs font-medium text-zinc-400">
                  Name
                </label>
                <input
                  id="sched-name"
                  required
                  className="w-full rounded-lg border border-white/[0.08] bg-[#0c0c0c] px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Working hours"
                />
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
                  disabled={creating}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
                >
                  {creating ? "…" : "Continue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
