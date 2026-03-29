import Link from "next/link";

export default function TeamsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="grid max-w-4xl overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0c0c] md:grid-cols-2">
        <div className="space-y-4 p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Teams</p>
          <h1 className="text-2xl font-semibold leading-tight text-white">
            Automatically route meetings to your team
          </h1>
          <p className="text-sm leading-relaxed text-zinc-500">
            Round-robin and collective scheduling help distribute inbound meetings fairly across your organization.
          </p>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>· Inbound routing forms</li>
            <li>· Round-robin event types</li>
            <li>· Team-wide availability</li>
          </ul>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">Teams Orgs</span>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              Try it for free →
            </button>
            <button type="button" className="text-sm text-zinc-500 hover:text-white">
              Learn more
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center bg-white p-8 md:p-10">
          <div className="w-full max-w-[220px] space-y-4 text-center text-sm text-zinc-700">
            <div className="rounded-full bg-zinc-100 py-2 font-medium">Customer</div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 py-6 text-zinc-500">Form answers</div>
            <div className="text-zinc-400">↓</div>
            <div className="rounded-lg border border-zinc-900 bg-zinc-900 py-4 text-white">
              <p className="text-xs text-zinc-400">Booked</p>
              <p className="mt-1 font-medium">Enterprise round robin</p>
            </div>
          </div>
        </div>
      </div>
      <Link href="/dashboard/event-types" className="mt-8 text-sm text-zinc-500 hover:text-white">
        ← Back to Event types
      </Link>
    </div>
  );
}
