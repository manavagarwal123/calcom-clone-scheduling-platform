export default function InstalledAppsPage() {
  return (
    <div className="px-6 py-8">
      <h1 className="text-xl font-semibold text-white">Installed apps</h1>
      <p className="mt-1 text-sm text-zinc-500">No apps installed yet.</p>
      <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-white/[0.08] py-16 text-center">
        <p className="text-sm text-zinc-500">Connect tools from the App store.</p>
      </div>
    </div>
  );
}
