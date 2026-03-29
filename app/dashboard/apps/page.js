export default function AppStorePage() {
  return (
    <div className="px-6 py-8">
      <h1 className="text-xl font-semibold text-white">App store</h1>
      <p className="mt-1 text-sm text-zinc-500">Browse integrations for your scheduling workflow.</p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {["Google Calendar", "Zoom", "Stripe", "Slack", "Zapier"].map((name) => (
          <div
            key={name}
            className="rounded-xl border border-white/[0.06] bg-[#0c0c0c] px-4 py-6 text-center text-sm font-medium text-zinc-300"
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
