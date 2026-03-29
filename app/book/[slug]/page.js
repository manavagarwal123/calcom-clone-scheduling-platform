"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateObj(y, m, d) {
  return new Date(y, m, d);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatTime12(time24) {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")}${period}`;
}

function formatTime(time24, is12h) {
  return is12h ? formatTime12(time24) : time24;
}


// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name }) {
  const safeName = typeof name === "string" && name.trim() ? name : "User";
  const initials = safeName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white select-none">
      {initials}
    </div>
  );
}

function IconClock() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6l4 2" />
    </svg>
  );
}

function IconVideo() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M15 10l4.553-2.277A1 1 0 0121 8.649v6.702a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
        d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function IconChevronRight() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  );
}

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel({ event, timezone, setTimezone }) {
  return (
    <div className="flex flex-col gap-5 border-r border-[#1f1f1f] p-6 lg:p-8">
      <Avatar name={event.userName} />
      <div>
        <p className="text-sm text-[#888]">{event.userName}</p>
        <h1 className="mt-1 text-xl font-semibold text-white">{event.title}</h1>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm text-[#999]">
          <IconClock />
          <span>{event.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#999]">
          <IconVideo />
          <span>{event.location}</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-[#999]">
          <IconGlobe />
          <div className="flex flex-col gap-1">
            <span className="text-[#ccc]">Timezone</span>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="rounded-lg border border-[#2a2a2a] bg-[#141414] px-2 py-1.5 text-xs text-[#ccc] outline-none focus:border-[#444] transition-colors"
            >
              {!TIMEZONES.includes(timezone) && (
                <option value={timezone}>{timezone}</option>
              )}
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {event.description && (
        <p className="text-xs leading-relaxed text-[#666] border-t border-[#1f1f1f] pt-4">
          {event.description}
        </p>
      )}
    </div>
  );
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

function Calendar({ selectedDate, onSelectDate }) {
  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // Cannot go before current month
  const canGoPrev = viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const weeks = useMemo(() => {
    const firstDay = toDateObj(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const grid = [];
    let day = 1 - firstDay;
    for (let w = 0; w < 6; w++) {
      const week = [];
      for (let d = 0; d < 7; d++, day++) {
        if (day < 1 || day > daysInMonth) {
          week.push(null);
        } else {
          week.push(toDateObj(viewYear, viewMonth, day));
        }
      }
      grid.push(week);
      if (day > daysInMonth) break;
    }
    return grid;
  }, [viewYear, viewMonth]);

  return (
    <div className="flex flex-col p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-white">
          <span className="text-white">{MONTHS[viewMonth]}</span>{" "}
          <span className="text-[#666]">{viewYear}</span>
        </h2>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666] transition hover:bg-[#1f1f1f] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <IconChevronLeft />
          </button>
          <button
            onClick={nextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#666] transition hover:bg-[#1f1f1f] hover:text-white"
          >
            <IconChevronRight />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 text-center">
        {DAYS.map((d) => (
          <div key={d} className="text-xs font-medium text-[#555] py-1">{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="flex flex-col gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((date, di) => {
              if (!date) return <div key={di} />;
              const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isToday = isSameDay(date, today);
              const isSelected = selectedDate && isSameDay(date, selectedDate);

              return (
                <button
                  key={di}
                  onClick={() => !isPast && onSelectDate(date)}
                  disabled={isPast}
                  className={[
                    "relative flex h-9 w-full items-center justify-center rounded-xl text-sm font-medium transition-all duration-150",
                    isPast
                      ? "cursor-not-allowed text-[#333]"
                      : isSelected
                        ? "bg-white text-black shadow-md"
                        : "text-[#ccc] hover:bg-[#1f1f1f] hover:text-white",
                  ].join(" ")}
                >
                  {date.getDate()}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-violet-500" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slots Panel ──────────────────────────────────────────────────────────────

function SlotsPanel({
  selectedDate, slots, loadingSlots, slotsError,
  selectedSlot, onSelectSlot, is12h, setIs12h,
  form, setForm, onBook, bookingLoading, bookingError,
}) {
  if (!selectedDate) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-[#444] text-sm">
        <svg className="mb-3 h-8 w-8 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" />
          <path strokeLinecap="round" strokeWidth="1.5" d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        Select a date to see available times
      </div>
    );
  }

  const dayLabel = selectedDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });

  return (
    <div className="flex flex-col border-l border-[#1f1f1f] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f1f]">
        <div>
          <p className="text-xs text-[#666]">Available times</p>
          <p className="text-sm font-semibold text-white">{dayLabel}</p>
        </div>
        <div className="flex rounded-lg border border-[#2a2a2a] bg-[#111] p-0.5 text-xs font-semibold">
          <button
            onClick={() => setIs12h(true)}
            className={`rounded-md px-2.5 py-1 transition ${is12h ? "bg-[#2a2a2a] text-white" : "text-[#555] hover:text-[#999]"}`}
          >
            12h
          </button>
          <button
            onClick={() => setIs12h(false)}
            className={`rounded-md px-2.5 py-1 transition ${!is12h ? "bg-[#2a2a2a] text-white" : "text-[#555] hover:text-[#999]"}`}
          >
            24h
          </button>
        </div>
      </div>

      {/* Scrollable slots */}
      <div className="flex-1 overflow-y-auto px-5 py-4" style={{ maxHeight: "calc(100vh - 200px)" }}>
        {loadingSlots ? (
          <div className="flex flex-col gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-[#141414] animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
            ))}
          </div>
        ) : slotsError ? (
          <p className="rounded-xl bg-red-950/40 border border-red-900/40 px-3 py-2 text-sm text-red-400">{slotsError}</p>
        ) : slots.length === 0 ? (
          <p className="text-center text-sm text-[#555] py-8">No available slots on this day.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {slots
              .filter((slot) => {
                if (!selectedSlot) return true;
                return slot.start === selectedSlot.start && slot.end === selectedSlot.end;
              })
              .map((slot, i) => {
                const taken = slot.available === false;
                const isSelected = selectedSlot?.start === slot.start && selectedSlot?.end === slot.end;
                return (
                  <button
                    key={i}
                    disabled={taken}
                    onClick={() => {
                      if (!taken) {
                        onSelectSlot(slot);
                      }
                    }}
                    className={[
                      "relative w-full rounded-xl border px-4 py-2.5 text-sm font-medium text-left transition-all duration-150",
                      taken
                        ? "cursor-not-allowed border-[#1a1a1a] text-[#333]"
                        : isSelected
                          ? "border-white bg-white text-black text-base font-semibold py-3"
                          : "border-[#2a2a2a] bg-[#111] text-[#ccc] hover:border-[#3a3a3a] hover:bg-[#181818] hover:text-white",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2">
                      {!taken && (
                        <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-violet-400" : "bg-emerald-500"}`} />
                      )}
                      {formatTime(slot.start, is12h)}
                    </span>
                  </button>
                );
              })}
          </div>
        )}

        {/* Booking form */}
        {selectedSlot && selectedSlot.available !== false && (
          <>
            <button
              onClick={() => onSelectSlot(null)}
              className="mb-3 text-xs text-[#666] hover:text-white transition"
            >
              ← Back
            </button>
            <div className="mt-5 flex flex-col gap-3 border-t border-[#1f1f1f] pt-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#555]">Your details</p>
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2.5 text-sm text-white placeholder:text-[#444] outline-none transition focus:border-[#444] focus:ring-1 focus:ring-[#333]"
              />
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2.5 text-sm text-white placeholder:text-[#444] outline-none transition focus:border-[#444] focus:ring-1 focus:ring-[#333]"
              />
              <textarea
                placeholder="Please share anything that will help prepare for our meeting."
                className="w-full rounded-xl border border-[#2a2a2a] bg-[#111] px-3 py-2.5 text-sm text-white placeholder:text-[#444] outline-none transition focus:border-[#444] focus:ring-1 focus:ring-[#333] min-h-[100px] resize-none"
              />
              {bookingError && (
                <p className="rounded-xl bg-red-950/40 border border-red-900/40 px-3 py-2 text-xs text-red-400">{bookingError}</p>
              )}
              <p className="text-xs text-[#666] mt-2">
                By proceeding, you agree to Cal.com's Terms and Privacy Policy.
              </p>
              <button
                onClick={onBook}
                disabled={bookingLoading}
                className="w-full rounded-xl bg-violet-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bookingLoading ? "Confirming…" : "Confirm Booking"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ success, onReset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#1f1f1f] bg-[#111] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
          <IconCheck />
        </div>
        <h2 className="text-xl font-semibold text-white">Booking Confirmed</h2>
        <p className="mt-2 text-sm text-[#999]">
          You're scheduled with <span className="text-white font-medium">{success.userName}</span>
        </p>
        <div className="mt-5 rounded-xl border border-[#1f1f1f] bg-[#0d0d0d] px-4 py-3 text-sm text-left">
          <p className="text-[#666] text-xs mb-1">What</p>
          <p className="text-white font-medium">{success.title}</p>
          <p className="text-[#666] text-xs mt-3 mb-1">When</p>
          <p className="text-white">{success.date} · {success.start} – {success.end}</p>
          <p className="text-[#555] text-xs mt-1">{success.timezone}</p>
          <p className="text-[#666] text-xs mt-3 mb-1">Who</p>
          <p className="text-white">{success.guestName}</p>
          <p className="text-[#555] text-xs">{success.guestEmail}</p>
        </div>
        <button
          onClick={onReset}
          className="mt-5 w-full rounded-xl border border-[#2a2a2a] bg-[#181818] py-2 text-sm text-[#999] transition hover:text-white"
        >
          Book another meeting
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingPage({ slug = "30min" }) {
  const [event, setEvent] = useState(null);

  const [timezone, setTimezone] = useState("UTC");
  const [selectedDate, setSelectedDate] = useState(null);
  const [is12h, setIs12h] = useState(true);

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const [success, setSuccess] = useState(null);

  // Auto-detect timezone
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(tz);
    } catch {
      setTimezone("UTC");
    }
  }, []);

  // Fetch event by slug
  useEffect(() => {
    let cancelled = false;

    const loadEvent = async () => {
      try {
        const res = await fetch("/api/event-types");
        const data = await res.json();

        const found = Array.isArray(data)
          ? data.find((e) => e.slug === slug)
          : null;

        if (!cancelled) {
          setEvent(found || null);
        }
      } catch {
        if (!cancelled) setEvent(null);
      }
    };

    loadEvent();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Fetch slots when date changes
  useEffect(() => {
    setSelectedSlot(null);
    setForm({ name: "", email: "" });
    setBookingError(null);
    if (!selectedDate) { setSlots([]); return; }

    let cancelled = false;
    setLoadingSlots(true);
    setSlotsError(null);
    setSlots([]);

    const loadSlots = async () => {
      try {
        const res = await fetch("/api/slots", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            date: toISO(selectedDate),
            timezone,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load slots");
        }

        if (!cancelled) {
          setSlots(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) {
          setSlotsError(e.message || "Failed to load slots.");
        }
      } finally {
        if (!cancelled) setLoadingSlots(false);
      }
    };

    loadSlots();

    return () => { cancelled = true; };
  }, [selectedDate, timezone, slug]);

  const handleBook = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setBookingError("Please enter your name and email.");
      return;
    }
    if (!selectedSlot || !selectedDate) {
      setBookingError("Missing booking details.");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          date: toISO(selectedDate),
          startTime: selectedSlot.start,
          endTime: selectedSlot.end,
          eventTypeId: event.id,
          timezone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Booking failed");
      }

      setSuccess({
        userName: event.userName,
        title: event.title,
        date: toISO(selectedDate),
        start: formatTime(selectedSlot.start, is12h),
        end: formatTime(selectedSlot.end, is12h),
        timezone,
        guestName: form.name.trim(),
        guestEmail: form.email.trim(),
      });
    } catch (e) {
      setBookingError(e.message || "Booking failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReset = () => {
    setSuccess(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setForm({ name: "", email: "" });
    setSlots([]);
    setBookingError(null);
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading event...
      </div>
    );
  }

  if (success) return <SuccessScreen success={success} onReset={handleReset} />;

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4 py-12 font-sans">
      <div
        className="grid w-full max-w-[880px] overflow-hidden rounded-2xl border border-[#1f1f1f] bg-[#111] shadow-2xl grid-cols-1 md:grid-cols-[220px_1fr_220px]"
      >
        {/* LEFT */}
        <LeftPanel event={event} timezone={timezone} setTimezone={setTimezone} />

        {/* CENTER */}
        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        {/* RIGHT */}
        <SlotsPanel
          selectedDate={selectedDate}
          slots={slots}
          loadingSlots={loadingSlots}
          slotsError={slotsError}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
          is12h={is12h}
          setIs12h={setIs12h}
          form={form}
          setForm={setForm}
          onBook={handleBook}
          bookingLoading={bookingLoading}
          bookingError={bookingError}
        />
      </div>

      {/* Watermark */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-[#333] select-none">
        Powered by Cal.com
      </div>
    </div>
  );
}