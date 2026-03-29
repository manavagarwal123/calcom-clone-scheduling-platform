"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/fetch-json";

export default function BookingsPage() {
  // ✅ Move inside component (hydration safe)
  const TABS = ["Upcoming", "Unconfirmed", "Recurring", "Past", "Canceled"];

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [tab, setTab] = useState("Upcoming");

  // ✅ Client-only time (fix hydration)
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  // Fetch bookings
  const load = useCallback(() => {
    setLoading(true);
    setLoadError(null);

    fetchJson("/api/bookings")
      .then(({ ok, data }) => {
        if (!ok || data?.error) {
          setLoadError(data?.error || "Failed to load bookings.");
          setBookings([]);
        } else {
          setBookings(Array.isArray(data) ? data : []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ✅ Correct filtering
  const lists = useMemo(() => {
    if (!now) {
      return { upcoming: [], past: [], all: bookings };
    }

    const upcoming = bookings.filter((b) =>
      b.status !== "CANCELLED" &&
      new Date(`${b.date}T${b.startTime}`) >= now
    );

    const past = bookings.filter((b) =>
      new Date(`${b.date}T${b.startTime}`) < now
    );

    const canceled = bookings.filter((b) => b.status === "CANCELLED");
    return { upcoming, past, canceled, all: bookings };
  }, [bookings, now]);

  const displayed =
    tab === "Upcoming"
      ? lists.upcoming
      : tab === "Past"
      ? lists.past
      : tab === "Canceled"
      ? lists.canceled
      : tab === "Unconfirmed" || tab === "Recurring"
      ? []
      : lists.all;

  // Cancel booking
  const cancelBooking = async (id) => {
    if (!confirm("Cancel this booking?")) return;

    try {
      const res = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(id) }), // ensure number
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Cancel failed");
        return;
      }

      load(); // refresh bookings
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* HEADER */}
      <header className="border-b border-white/[0.06] px-6 py-5">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Bookings
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          See upcoming and past events booked through your event type links.
        </p>

        {/* Tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              type="button" // ✅ IMPORTANT FIX
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              }`}
            >
              {t}
            </button>
          ))}

          <button
            type="button" // ✅ IMPORTANT FIX
            className="ml-auto rounded-lg border border-white/[0.08] px-3 py-1.5 text-sm text-zinc-400 hover:bg-white/5"
          >
            Filter
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex-1 px-6 py-10">
        {/* Error */}
        {loadError && (
          <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {loadError}
          </p>
        )}

        {/* Loading */}
        {loading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : displayed.length === 0 ? (
          // Empty state
          <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-dashed border-white/[0.08] px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-[#0c0c0c] text-zinc-500">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="text-base font-semibold text-white">
              No {tab.toLowerCase()} bookings
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              {tab === "Upcoming"
                ? "You have no upcoming bookings. As soon as someone books a time with you it will show up here."
                : "Nothing to show in this view yet."}
            </p>

            {/* Test button */}
            {tab === "Upcoming" && (
              <button
                type="button"
                className="mt-4 px-4 py-2 border border-white/10 rounded-lg text-sm hover:bg-white/5"
                onClick={() => window.open("/book/30min", "_blank")}
              >
                Book a test meeting
              </button>
            )}
          </div>
        ) : (
          // Booking list
          <ul className="space-y-2">
            {displayed.map((b) => (
              <li
                key={b.id}
                className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-[#0c0c0c] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{b.name}</p>

                  <p className="text-sm text-zinc-500">
                    {b.eventType?.title ?? "Meeting"} · {b.date} ·{" "}
                    {b.startTime}
                  </p>

                  <p className="text-xs text-zinc-600">{b.email}</p>
                  {b.status === "CANCELLED" && (
                    <p className="text-xs text-red-400 mt-1">Cancelled</p>
                  )}
                </div>

                {/* Cancel button */}
                {now &&
                  b.status !== "CANCELLED" &&
                  new Date(`${b.date}T${b.startTime}`) >= now && (
                    <button
                      type="button"
                      onClick={() => cancelBooking(Number(b.id))}
                      className="self-start text-sm text-red-400 hover:text-red-300 sm:self-center"
                    >
                      Cancel booking
                    </button>
                  )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}