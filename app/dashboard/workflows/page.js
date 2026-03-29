export default function WorkflowsPage() {
  return (
    <div className="flex min-h-screen flex-col px-6 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Workflows</h1>
          <p className="mt-1 text-sm text-zinc-500">Automate reminders and follow-ups around bookings.</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          + Create a workflow
        </button>
      </div>
      <div className="mt-16 flex flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-[#0c0c0c] text-amber-400">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-white">No workflows yet</h2>
        <p className="mt-2 max-w-md text-sm text-zinc-500">
          Workflows let you send SMS, emails, and more when bookings are created or updated.
        </p>
      </div>
    </div>
  );
}
