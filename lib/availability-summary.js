const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** @param {string} hhmm "09:00" */
export function formatTimeLabel(hhmm) {
  if (!hhmm || !hhmm.includes(":")) return hhmm;
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

/**
 * @param {{ dayOfWeek: number; enabled: boolean; startTime: string; endTime: string }[]} rows
 */
export function summarizeScheduleRows(rows) {
  if (!rows?.length) return null;

  const byDay = {};
  for (const r of rows) {
    if (!r.enabled) continue;
    if (!byDay[r.dayOfWeek]) byDay[r.dayOfWeek] = [];
    const label = `${formatTimeLabel(r.startTime)} - ${formatTimeLabel(r.endTime)}`;
    if (!byDay[r.dayOfWeek].includes(label)) byDay[r.dayOfWeek].push(label);
  }

  const activeDays = Object.keys(byDay)
    .map(Number)
    .sort((a, b) => a - b);
  if (activeDays.length === 0) return null;

  const firstLabel = byDay[activeDays[0]]?.[0];
  const allSame = activeDays.every((d) => byDay[d]?.[0] === firstLabel && byDay[d]?.length === 1);

  if (allSame && firstLabel) {
    const isConsecutiveWeekdays =
      activeDays.length === 5 &&
      activeDays[0] === 1 &&
      activeDays[4] === 5 &&
      activeDays.every((d, i) => i === 0 || d === activeDays[i - 1] + 1);
    if (isConsecutiveWeekdays) {
      return `Mon - Fri, ${firstLabel}`;
    }
    const isConsecutive =
      activeDays.length > 1 &&
      activeDays.every((d, i) => i === 0 || d === activeDays[i - 1] + 1);
    if (isConsecutive) {
      return `${DAY_SHORT[activeDays[0]]} - ${DAY_SHORT[activeDays[activeDays.length - 1]]}, ${firstLabel}`;
    }
  }

  return activeDays
    .map((d) => `${DAY_SHORT[d]} ${(byDay[d] || []).join(", ")}`)
    .join(" · ");
}
