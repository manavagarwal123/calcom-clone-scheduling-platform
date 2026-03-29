"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { COMMON_TIMEZONES } from "@/lib/timezones";
import { fetchJson } from "@/lib/fetch-json";

const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function emptyWeek() {
  return Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    enabled: false,
    slots: [{ start: "09:00", end: "22:00" }],
  }));
}

function rowsToWeek(rows) {
  const w = emptyWeek();
  const byDay = {};
  for (const r of rows || []) {
    if (!r.enabled) continue;
    if (!byDay[r.dayOfWeek]) byDay[r.dayOfWeek] = [];
    byDay[r.dayOfWeek].push({ start: r.startTime, end: r.endTime });
  }
  for (let d = 0; d < 7; d++) {
    if (byDay[d]?.length) {
      w[d].enabled = true;
      w[d].slots = byDay[d];
    }
  }
  return w;
}

export default function ScheduleEditorPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [isDefault, setIsDefault] = useState(false);
  const [week, setWeek] = useState(emptyWeek);
  const [eventCount, setEventCount] = useState(0);

  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    fetchJson(`/api/schedules/${id}`)
      .then(({ ok, data: s }) => {
        if (!ok || s?.error || !s?.name) {
          router.replace("/dashboard/availability");
          return;
        }
        setName(s.name);
        setTimezone(s.timezone);
        setIsDefault(s.isDefault);
        setWeek(rowsToWeek(s.availabilities));
        setEventCount(s._count?.eventTypes ?? 0);
      })
      .catch(() => router.replace("/dashboard/availability"))
      .finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  const tzSelectValue = useMemo(() => {
    return COMMON_TIMEZONES.includes(timezone) ? timezone : timezone;
  }, [timezone]);

  const toggleDay = (d) => {
    setWeek((prev) =>
      prev.map((day, i) => {
        if (i !== d) return day;
        const on = !day.enabled;
        return {
          ...day,
          enabled: on,
          slots: on
            ? day.slots?.length
              ? day.slots
              : [{ start: "09:00", end: "17:00" }]
            : [{ start: "09:00", end: "17:00" }],
        };
      })
    );
  };

  const setSlot = (dayIdx, slotIdx, field, value) => {
    setWeek((prev) => {
      const next = [...prev];
      const slots = [...next[dayIdx].slots];
      slots[slotIdx] = { ...slots[slotIdx], [field]: value };
      next[dayIdx] = { ...next[dayIdx], slots };
      return next;
    });
  };

  const addSlot = (dayIdx) => {
    setWeek((prev) => {
      const next = [...prev];
      next[dayIdx] = {
        ...next[dayIdx],
        slots: [...next[dayIdx].slots, { start: "12:00", end: "13:00" }],
      };
      return next;
    });
  };

  const removeSlot = (dayIdx, slotIdx) => {
    setWeek((prev) => {
      const next = [...prev];
      if (next[dayIdx].slots.length <= 1) return prev;
      next[dayIdx] = {
        ...next[dayIdx],
        slots: next[dayIdx].slots.filter((_, i) => i !== slotIdx),
      };
      return next;
    });
  };

  const save = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const intervals = week.map((day) => ({
        dayOfWeek: day.dayOfWeek,
        enabled: day.enabled,
        slots: day.enabled ? day.slots : [],
      }));
      const res = await fetch(`/api/schedules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Schedule",
          timezone,
          isDefault,
          intervals,
        }),
      });
      if (!res.ok) throw new Error("fail");
      router.refresh();
    } catch {
      alert("Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const removeSchedule = async () => {
    if (!id) return;
    if (!confirm("Delete this schedule? Event types using it will switch to the default schedule.")) return;
    const res = await fetch(`/api/schedules/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Could not delete.");
      return;
    }
    router.push("/dashboard/availability");
  };

  if (loading || !id) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-sm text-zinc-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard/availability"
              className="rounded-md p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white"
              aria-label="Back"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0">
              <input
                className="w-full max-w-md border-none bg-transparent text-lg font-semibold text-white outline-none focus:ring-0"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-zinc-600">
                Used by {eventCount} event type{eventCount === 1 ? "" : "s"} · changes apply to all of them
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="rounded border-zinc-600 bg-[#18181b]"
              />
              Set as default
            </label>
            {!isDefault && (
              <button
                type="button"
                onClick={removeSchedule}
                className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                aria-label="Delete schedule"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 px-6 py-6 lg:flex-row lg:gap-10">
        <div className="min-w-0 flex-1 space-y-0 rounded-xl border border-white/[0.06] bg-[#0c0c0c]">
          {week.map((day, di) => (
            <div
              key={day.dayOfWeek}
              className={`flex flex-col gap-3 border-b border-white/[0.06] px-4 py-4 last:border-b-0 sm:flex-row sm:items-start ${
                day.enabled ? "" : "opacity-50"
              }`}
            >
              <div className="flex w-full items-center gap-3 sm:w-40 sm:shrink-0">
                <button
                  type="button"
                  role="switch"
                  aria-checked={day.enabled}
                  onClick={() => toggleDay(di)}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                    day.enabled ? "bg-white" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full transition-transform ${
                      day.enabled ? "left-[22px] bg-black" : "left-0.5 bg-zinc-400"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-zinc-200">{DAY_LABELS[di]}</span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {day.enabled &&
                  day.slots.map((slot, si) => (
                    <div key={`${di}-${si}`} className="flex flex-wrap items-center gap-2">
                      <input
                        type="time"
                        step={300}
                        value={slot.start}
                        onChange={(e) => setSlot(di, si, "start", e.target.value)}
                        className="rounded-lg border border-white/[0.08] bg-[#18181b] px-2 py-1.5 text-sm text-white"
                      />
                      <span className="text-zinc-600">–</span>
                      <input
                        type="time"
                        step={300}
                        value={slot.end}
                        onChange={(e) => setSlot(di, si, "end", e.target.value)}
                        className="rounded-lg border border-white/[0.08] bg-[#18181b] px-2 py-1.5 text-sm text-white"
                      />
                      <button
                        type="button"
                        onClick={() => addSlot(di)}
                        className="rounded-md p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white"
                        title="Add interval"
                      >
                        +
                      </button>
                      {day.slots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSlot(di, si)}
                          className="text-xs text-zinc-600 hover:text-red-400"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full shrink-0 space-y-3 lg:w-72">
          <label className="block text-sm font-medium text-zinc-300">Timezone</label>
          <select
            value={tzSelectValue}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full rounded-lg border border-white/[0.08] bg-[#18181b] px-3 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none"
          >
            {!COMMON_TIMEZONES.includes(timezone) && <option value={timezone}>{timezone}</option>}
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <p className="text-xs text-zinc-600">Stored on the schedule; booking slots use your working hours.</p>
        </div>
      </div>

      <div className="mx-6 mb-10 rounded-xl border border-white/[0.06] bg-[#0c0c0c] px-4 py-5">
        <div className="flex items-start gap-2">
          <h3 className="text-sm font-medium text-white">Date overrides</h3>
          <span className="text-zinc-600" title="Info">
            ⓘ
          </span>
        </div>
        <p className="mt-1 text-sm text-zinc-500">Add dates when your availability changes from your daily hours.</p>
        <button
          type="button"
          disabled
          className="mt-4 rounded-lg border border-dashed border-white/[0.1] px-4 py-2 text-sm text-zinc-600"
        >
          + Add an override (coming soon)
        </button>
      </div>
    </div>
  );
}
