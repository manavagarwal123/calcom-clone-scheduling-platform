
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

const NAV_LINKS = ["Solutions", "Enterprise", "Cal.ai", "Developer", "Resources", "Pricing"];

const TRUSTED_COMPANIES = ["Vercel", "Loom", "Twilio", "Stripe", "Linear", "Retool", "Descript", "Raycast"];

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Connect your calendar",
    desc: "Sync Google Calendar, Outlook, or iCloud. Cal.com checks your real-time availability so you're never double-booked.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Set your availability",
    desc: "Define your working hours, set buffer times between meetings, and block off personal time with ease.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Choose how to meet",
    desc: "Zoom, Google Meet, Teams, phone, or in-person — let invitees pick a time and format that works for everyone.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
  },
];

const FEATURES = [
  { icon: "💳", title: "Accept payments", desc: "Charge for your time with Stripe. One-click setup, instant payouts." },
  { icon: "📹", title: "Video conferencing", desc: "Built-in Zoom, Google Meet, and Teams links — auto-generated per booking." },
  { icon: "🔗", title: "Short booking links", desc: "cal.com/yourname — clean, memorable, shareable anywhere." },
  { icon: "🔒", title: "Privacy first", desc: "GDPR compliant, open source, and self-hostable. You own your data." },
  { icon: "🔁", title: "Recurring events", desc: "Set up weekly standups or monthly check-ins with one event type." },
  { icon: "🌍", title: "Timezone smart", desc: "Automatically converts availability to every invitee's local timezone." },
  { icon: "📊", title: "Booking analytics", desc: "See your busiest days, no-show rates, and revenue at a glance." },
  { icon: "🤝", title: "Round-robin routing", desc: "Distribute meetings fairly across your entire team." },
  { icon: "📝", title: "Custom intake forms", desc: "Ask questions before the meeting so you show up prepared." },
  { icon: "🔌", title: "100+ integrations", desc: "Zapier, HubSpot, Salesforce, Linear, Notion, and many more." },
  { icon: "👥", title: "Team scheduling", desc: "Collective events where multiple hosts must be available simultaneously." },
  { icon: "⚡", title: "Instant booking", desc: "Skip confirmation and let attendees book confirmed slots instantly." },
];

const TESTIMONIALS = [
  { name: "Sara Kimani", handle: "@sarakimani", role: "Product Designer", avatar: "SK", avatarBg: "from-pink-400 to-rose-500", text: "Cal.com cut my scheduling back-and-forth by 90%. I send one link and it's done. I can't imagine going back to the old way of doing things.", verified: true },
  { name: "Mike Torres", handle: "@miketorres", role: "Freelance Developer", avatar: "MT", avatarBg: "from-blue-400 to-cyan-500", text: "The Stripe integration is seamless. I get paid the moment someone books — no invoices, no chasing.", verified: true },
  { name: "Priya Mehta", handle: "@priyamehta", role: "Startup Founder", avatar: "PM", avatarBg: "from-violet-500 to-indigo-600", text: "We run all investor calls through Cal.com. Round-robin keeps things fair and our team loves it. The setup took under 10 minutes.", verified: true },
  { name: "James Okafor", handle: "@jamesokafor", role: "Engineering Manager", avatar: "JO", avatarBg: "from-emerald-400 to-teal-500", text: "Self-hosting gave us full control over our data. GDPR compliance used to be a headache.", verified: false },
  { name: "Lena Hoffmann", handle: "@lenahoffmann", role: "Executive Coach", avatar: "LH", avatarBg: "from-orange-400 to-amber-500", text: "My clients love how easy it is to book time with me. The custom intake form means I always know exactly what we'll be covering before we jump on a call.", verified: true },
  { name: "David Chen", handle: "@davidchen", role: "Sales Lead", avatar: "DC", avatarBg: "from-slate-500 to-gray-600", text: "Routing forms send leads straight to the right rep. Pipeline has never been cleaner.", verified: false },
];

const WALL_OF_LOVE = [
  { name: "Guillermo Rauch", handle: "@rauchg", avatar: "GR", avatarBg: "from-black to-gray-700", text: "Cal.com is the scheduling tool I've always wanted. The open-source approach means I can trust it with my calendar.", time: "2h", likes: 234, verified: true },
  { name: "Shawn Wang", handle: "@swyx", avatar: "SW", avatarBg: "from-sky-500 to-blue-600", text: "Switched to Cal.com 6 months ago and never looked back. The DX is unmatched.", time: "5h", likes: 189, verified: true },
  { name: "Cassidy Williams", handle: "@cassidoo", avatar: "CW", avatarBg: "from-pink-500 to-rose-600", text: "I give everyone my Cal.com link now. It's the most frictionless scheduling experience I've used. My no-show rate went to near zero.", time: "1d", likes: 412, verified: true },
  { name: "Lee Robinson", handle: "@leeerob", avatar: "LR", avatarBg: "from-emerald-500 to-teal-600", text: "Cal.com is genuinely one of those tools that disappears into your workflow in the best way. You forget it's there until someone books you.", time: "3d", likes: 301, verified: false },
  { name: "Theo Browne", handle: "@t3dotgg", avatar: "TB", avatarBg: "from-violet-500 to-purple-600", text: "The self-hosting story for Cal.com is excellent. Full control, beautiful UI, and the team actually ships.", time: "4d", likes: 278, verified: true },
  { name: "Kent C. Dodds", handle: "@kentcdodds", avatar: "KD", avatarBg: "from-orange-400 to-amber-500", text: "I've recommended Cal.com to literally everyone who asks me how I manage my scheduling. It just works.", time: "1w", likes: 556, verified: true },
];

const INTEGRATIONS = [
  { name: "Google Calendar", emoji: "📅", color: "bg-blue-50" },
  { name: "Zoom", emoji: "📹", color: "bg-blue-50" },
  { name: "Stripe", emoji: "💳", color: "bg-purple-50" },
  { name: "Slack", emoji: "💬", color: "bg-yellow-50" },
  { name: "Outlook", emoji: "📧", color: "bg-blue-50" },
  { name: "Notion", emoji: "📝", color: "bg-gray-100" },
  { name: "HubSpot", emoji: "🎯", color: "bg-orange-50" },
  { name: "Salesforce", emoji: "☁️", color: "bg-sky-50" },
  { name: "Zapier", emoji: "⚡", color: "bg-orange-50" },
  { name: "Linear", emoji: "🔷", color: "bg-indigo-50" },
  { name: "GitHub", emoji: "🐙", color: "bg-gray-100" },
  { name: "Loom", emoji: "🎥", color: "bg-purple-50" },
  { name: "Google Meet", emoji: "📊", color: "bg-green-50" },
  { name: "Teams", emoji: "👥", color: "bg-blue-50" },
  { name: "Intercom", emoji: "💬", color: "bg-blue-50" },
  { name: "Pipedrive", emoji: "📈", color: "bg-green-50" },
];

const FOOTER_COLS = [
  { heading: "Solutions", links: ["Individual", "Teams", "Enterprise", "Agencies", "Education", "Healthcare"] },
  { heading: "Use Cases", links: ["Sales calls", "Customer success", "Recruiting", "Coaching", "Consulting", "Webinars"] },
  { heading: "Resources", links: ["Blog", "Documentation", "Changelog", "Open source", "Status", "Support"] },
  { heading: "Company", links: ["About", "Careers", "Press", "Partners", "Privacy", "Terms"] },
];

const CALENDAR_WEEKS = [
  ["", "", "", "", 1, 2, 3],
  [4, 5, 6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22, 23, 24],
  [25, 26, 27, 28, 29, 30, ""],
] as const;

const AVAILABLE_DAYS = [1, 2, 4, 5, 7, 8, 9, 11, 13, 14, 15, 16, 18, 20, 21, 22, 23, 25, 26, 28, 29];
const TIME_SLOTS = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
const DURATIONS = ["15m", "30m", "45m", "1h"];

// ─── ANNOUNCEMENT BAR ─────────────────────────────────────────────────────────

function AnnouncementBar() {
  return (
    <div className="w-full bg-black text-white text-sm py-2.5 px-4 flex items-center justify-center gap-x-3">
      <span className="text-gray-300 text-center">
        Moving from Clockwise?{" "}
        <span className="text-white font-medium">Set a priority call with our team today!</span>
      </span>
      <button
        onClick={() => window.location.href = "/book/30min"}
        className="shrink-0 bg-white text-black text-xs font-semibold px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
      >
        Book a demo
      </button>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        <a href="#" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">Cal.com</span>
        </a>
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <a key={link} href="#" className="px-3.5 py-2 text-sm text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              {link}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 shrink-0">
          <a href="#" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Sign in
          </a>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-black text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── HERO CARD ────────────────────────────────────────────────────────────────

function HeroCard() {
  const [selectedDate, setSelectedDate] = useState(14);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [selectedDuration, setSelectedDuration] = useState("30m");
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-[360px] overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            AJ
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Alex Johnson</p>
            <p className="text-xs text-gray-500">Product Lead @ Cal.com</p>
          </div>
        </div>
        <p className="text-xs font-semibold text-gray-900 mb-2">30 Minute Meeting</p>
        <div className="flex gap-1.5">
          {DURATIONS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDuration(d)}
              className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${selectedDuration === d ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-900">November 2025</span>
          <div className="flex gap-1">
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
          ))}
        </div>
        {CALENDAR_WEEKS.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              const isSelected = day === selectedDate;
              const isAvailable = typeof day === "number" && AVAILABLE_DAYS.includes(day as number);
              return (
                <div
                  key={di}
                  onClick={() => typeof day === "number" && setSelectedDate(day)}
                  className={`flex items-center justify-center text-[11px] h-7 w-7 mx-auto rounded-full font-medium transition-colors
                  ${isSelected ? "bg-black text-white" : ""}
                  ${!isSelected && isAvailable ? "text-gray-800 hover:bg-gray-100 cursor-pointer" : ""}
                  ${!isAvailable && day !== "" ? "text-gray-300 cursor-default" : ""}
                `}>
                  {day !== "" ? day : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="px-5 pb-4">
        <p className="text-xs font-semibold text-gray-700 mb-2">Friday, November 14</p>
        <div className="grid grid-cols-3 gap-1.5">
          {TIME_SLOTS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTime(t)}
              className={`text-[11px] py-1.5 rounded-lg border font-medium transition-colors ${selectedTime === t ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="1.5" /><path strokeLinecap="round" strokeWidth="1.5" d="M12 6v6l4 2" /></svg>
          America/New_York (GMT-5)
        </p>
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  const router = useRouter();
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Cal.com launches v6.3
              <span className="text-gray-400">→</span>
            </div>
            <h1 className="text-[2.75rem] sm:text-5xl lg:text-[3.25rem] font-black text-gray-900 leading-[1.1] tracking-tight">
              The better way to schedule your meetings
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
              Cal.com is the open-source scheduling infrastructure for absolutely everyone. Connect your calendar, share a link, and let others book time that works.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center justify-center gap-2.5 bg-black text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign up with Google
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center justify-center gap-2.5 bg-white border border-gray-200 text-gray-800 font-semibold text-sm px-5 py-3 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Sign up with email
              </button>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
              No credit card required · Free forever plan available
            </p>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-violet-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
              <div className="relative z-10"><HeroCard /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TRUSTED ──────────────────────────────────────────────────────────────────

function Trusted() {
  return (
    <section className="bg-gray-50 border-y border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Trusted by teams at world-class companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {TRUSTED_COMPANIES.map((c) => (
            <span key={c} className="text-xl font-bold text-gray-200 hover:text-gray-400 transition-colors cursor-default tracking-tight select-none">{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const router = useRouter();
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">How it works</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">With us, appointment scheduling is easy</h2>
          <p className="mt-4 text-base text-gray-500 max-w-xl mx-auto">From signup to your first booked meeting — get set up in under five minutes.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div key={step.number} className="relative bg-white border border-gray-100 rounded-2xl shadow-sm p-7 hover:shadow-md transition-shadow overflow-hidden">
              <span className="absolute top-4 right-5 text-6xl font-black text-gray-50 select-none pointer-events-none leading-none">{step.number}</span>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700 mb-4">{step.icon}</div>
              {i < HOW_IT_WORKS_STEPS.length - 1 && <div className="hidden md:block absolute top-12 -right-3 w-6 h-0.5 bg-gray-200 z-10" />}
              <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Get started
          </button>
          <button
            onClick={() => router.push("/book/30min")}
            className="border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            Book a demo
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── BENEFITS ─────────────────────────────────────────────────────────────────

function BufferPreview() {
  return (
    <div className="mt-5 bg-gray-50 rounded-xl p-4 space-y-2.5 border border-gray-100">
      {[
        { label: "Minimum notice", value: "4 hours", color: "bg-orange-100 text-orange-700" },
        { label: "Buffer before event", value: "15 min", color: "bg-blue-100 text-blue-700" },
        { label: "Buffer after event", value: "10 min", color: "bg-purple-100 text-purple-700" },
        { label: "Frequency cap", value: "3 / day", color: "bg-green-100 text-green-700" },
      ].map((r) => (
        <div key={r.label} className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{r.label}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.color}`}>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

function BookingLinkPreview() {
  return (
    <div className="mt-5 space-y-3">
      <div className="bg-gray-900 rounded-xl px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-gray-800 rounded-md px-3 py-1 text-xs text-gray-400 font-mono truncate">cal.com/alexjohnson/30min</div>
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600" />
          <div>
            <p className="text-xs font-semibold text-gray-900">Alex Johnson</p>
            <p className="text-[10px] text-gray-400">30 Minute Meeting</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {["9:00", "9:30", "10:00", "10:30"].map((t) => (
            <div key={t} className={`text-center text-[10px] py-1 rounded font-medium ${t === "10:00" ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CalendarPreview() {
  const miniWeeks = [[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14], [15, 16, 17, 18, 19, 20, 21], [22, 23, 24, 25, 26, 27, 28]];
  const busy = [3, 9, 10, 16, 17, 23];
  return (
    <div className="mt-5 bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold text-gray-700">November 2025</span>
        <div className="flex gap-2 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-black inline-block" />Today</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-blue-200 inline-block" />Booked</span>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-center text-[9px] font-bold text-gray-400">{d}</div>
        ))}
        {miniWeeks.flat().map((n) => (
          <div key={n} className={`text-center text-[10px] py-0.5 rounded font-medium ${n === 14 ? "bg-black text-white" : busy.includes(n) ? "bg-blue-100 text-blue-700" : "text-gray-500"}`}>{n}</div>
        ))}
      </div>
    </div>
  );
}

function NotificationsPreview() {
  const items = [
    { icon: "📧", label: "Email confirmation", time: "Instant", color: "bg-blue-50 text-blue-700" },
    { icon: "📱", label: "SMS reminder", time: "1h before", color: "bg-green-50 text-green-700" },
    { icon: "🔔", label: "Push notification", time: "15m before", color: "bg-yellow-50 text-yellow-700" },
    { icon: "🔁", label: "Follow-up email", time: "1h after", color: "bg-purple-50 text-purple-700" },
  ];
  return (
    <div className="mt-5 space-y-2">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
          <span className="text-base">{item.icon}</span>
          <span className="flex-1 text-xs text-gray-700 font-medium">{item.label}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.color}`}>{item.time}</span>
        </div>
      ))}
    </div>
  );
}

const BENEFITS_DATA = [
  { badge: "Availability", title: "Notices and buffers", desc: "Set minimum notice periods, daily frequency limits, and automatic buffers so your calendar stays sane.", Preview: BufferPreview },
  { badge: "Branding", title: "Your booking link, your brand", desc: "A beautiful, fast booking page at your personal link — customisable to match your identity.", Preview: BookingLinkPreview },
  { badge: "Visibility", title: "Full calendar overview", desc: "See your entire week at a glance and understand your meeting load before you take on anything new.", Preview: CalendarPreview },
  { badge: "Automation", title: "Smart notifications", desc: "Automated email, SMS, and push reminders reduce no-shows and keep every attendee prepared.", Preview: NotificationsPreview },
];

function Benefits() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Benefits</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Your all-purpose scheduling app</h2>
          <p className="mt-4 text-base text-gray-500 max-w-lg mx-auto">Everything you need to manage time professionally — built right in.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {BENEFITS_DATA.map((b) => {
            const { Preview } = b;
            return (
              <div key={b.title} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-7 hover:shadow-md transition-shadow">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full mb-3">{b.badge}</span>
                <h3 className="font-bold text-gray-900 text-xl mb-2">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                <Preview />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURE GRID ─────────────────────────────────────────────────────────────

function FeatureGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">…and so much more!</h2>
          <p className="mt-4 text-base text-gray-500 max-w-lg mx-auto">A complete scheduling platform for individuals, teams, and enterprises.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="group bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:bg-white hover:border-gray-200 hover:shadow-md transition-all cursor-default">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5 group-hover:text-black">{f.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-3">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-3.5 h-3.5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

type Testimonial = typeof TESTIMONIALS[number];

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow break-inside-avoid mb-4">
      <StarRating />
      <p className="text-sm text-gray-700 leading-relaxed mb-5">"{t.text}"</p>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{t.avatar}</div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{t.name}</p>
          <p className="text-xs text-gray-400">{t.role} · {t.handle}</p>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const col1 = TESTIMONIALS.filter((_, i) => i % 3 === 0);
  const col2 = TESTIMONIALS.filter((_, i) => i % 3 === 1);
  const col3 = TESTIMONIALS.filter((_, i) => i % 3 === 2);
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Don't just take our word for it</h2>
          <p className="mt-4 text-base text-gray-500 max-w-lg mx-auto">Join 50,000+ professionals who've transformed how they schedule.</p>
        </div>
        <div className="hidden lg:grid grid-cols-3 gap-4 items-start">
          <div>{col1.map((t, i) => <TestimonialCard key={i} t={t} />)}</div>
          <div className="pt-6">{col2.map((t, i) => <TestimonialCard key={i} t={t} />)}</div>
          <div>{col3.map((t, i) => <TestimonialCard key={i} t={t} />)}</div>
        </div>
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4 items-start">
          <div>{TESTIMONIALS.filter((_, i) => i % 2 === 0).map((t, i) => <TestimonialCard key={i} t={t} />)}</div>
          <div className="pt-6">{TESTIMONIALS.filter((_, i) => i % 2 === 1).map((t, i) => <TestimonialCard key={i} t={t} />)}</div>
        </div>
        <div className="sm:hidden space-y-4">{TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} />)}</div>
      </div>
    </section>
  );
}

// ─── INTEGRATIONS ─────────────────────────────────────────────────────────────

function Integrations() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="space-y-6">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-400">Integrations</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight leading-tight">
              All your key tools in-sync with your meetings
            </h2>
            <p className="text-base text-gray-500 leading-relaxed">Cal.com connects seamlessly with 100+ apps you already use — from calendars and video tools to CRMs and payment processors.</p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-colors">Browse integrations</button>
              <button className="border border-gray-200 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors">Build your own →</button>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {["from-pink-400 to-rose-500", "from-blue-400 to-cyan-500", "from-violet-500 to-indigo-600"].map((g, i) => (
                  <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} border-2 border-white`} />
                ))}
              </div>
              <p className="text-sm text-gray-500"><span className="font-semibold text-gray-900">100+</span> integrations and growing</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {INTEGRATIONS.map((int) => (
              <div key={int.name} className={`${int.color} border border-white rounded-2xl p-3 flex flex-col items-center gap-1.5 hover:scale-105 transition-transform cursor-default`}>
                <span className="text-2xl">{int.emoji}</span>
                <span className="text-[10px] text-gray-600 font-medium text-center leading-tight">{int.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── WALL OF LOVE ─────────────────────────────────────────────────────────────

type WallItem = typeof WALL_OF_LOVE[number];

function TweetCard({ t }: { t: WallItem }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow break-inside-avoid mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarBg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{t.avatar}</div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-gray-900">{t.name}</span>
              {t.verified && (
                <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
            </div>
            <span className="text-xs text-gray-400">{t.handle} · {t.time}</span>
          </div>
        </div>
        <svg className="w-4 h-4 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed">{t.text}</p>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          {t.likes}
        </button>
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-500 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          Share
        </button>
      </div>
    </div>
  );
}

function WallOfLove() {
  const col1 = WALL_OF_LOVE.filter((_, i) => i % 3 === 0);
  const col2 = WALL_OF_LOVE.filter((_, i) => i % 3 === 1);
  const col3 = WALL_OF_LOVE.filter((_, i) => i % 3 === 2);
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Wall of Love</span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">See why our users love Cal.com</h2>
        </div>
        <div className="hidden lg:grid grid-cols-3 gap-4 items-start">
          <div>{col1.map((t, i) => <TweetCard key={i} t={t} />)}</div>
          <div className="pt-6">{col2.map((t, i) => <TweetCard key={i} t={t} />)}</div>
          <div>{col3.map((t, i) => <TweetCard key={i} t={t} />)}</div>
        </div>
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4 items-start">
          <div>{WALL_OF_LOVE.filter((_, i) => i % 2 === 0).map((t, i) => <TweetCard key={i} t={t} />)}</div>
          <div className="pt-6">{WALL_OF_LOVE.filter((_, i) => i % 2 === 1).map((t, i) => <TweetCard key={i} t={t} />)}</div>
        </div>
        <div className="sm:hidden space-y-4">{WALL_OF_LOVE.map((t, i) => <TweetCard key={i} t={t} />)}</div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="bg-gray-950 py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
          {[
            { label: "G2", rating: "4.9", stars: "★★★★★", reviews: "600+ reviews" },
            { label: "ProductHunt", rating: "#1", stars: "🏆", reviews: "Product of the Year" },
            { label: "Capterra", rating: "4.8", stars: "★★★★★", reviews: "200+ reviews" },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
              <span className="text-white text-sm font-bold">{b.label}</span>
              <span className="text-yellow-400 text-sm">{b.stars}</span>
              <span className="text-gray-400 text-xs">{b.rating} · {b.reviews}</span>
            </div>
          ))}
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-5 leading-tight tracking-tight">Smarter, simpler scheduling</h2>
        <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">Join 50,000+ professionals who've stopped wasting time on scheduling. Free forever plan, no credit card required.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-gray-900 font-bold text-sm px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg">Get started for free</button>
          <button className="border border-gray-700 text-white font-semibold text-sm px-8 py-4 rounded-xl hover:border-gray-500 hover:bg-white/5 transition-colors">Talk to sales →</button>
        </div>
        <p className="text-gray-600 text-xs mt-8">Free plan · No credit card · Self-hostable · Open source</p>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="black" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-lg font-black text-white tracking-tight">Cal.com</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">Open-source scheduling infrastructure for absolutely everyone.</p>
            <div className="flex gap-2 mb-6">
              {[{ label: "𝕏", title: "X / Twitter" }, { label: "in", title: "LinkedIn" }, { label: "gh", title: "GitHub" }, { label: "yt", title: "YouTube" }].map((s) => (
                <a key={s.label} href="#" title={s.title} className="w-8 h-8 bg-gray-800 text-gray-400 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-gray-700 hover:text-white transition-colors">{s.label}</a>
              ))}
            </div>
            <div className="space-y-2 mb-5">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Download the app</p>
              <div className="flex gap-2">
                <a href="#" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors text-white text-xs font-medium px-3 py-2 rounded-lg"><span className="text-sm">🍎</span> App Store</a>
                <a href="#" className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 transition-colors text-white text-xs font-medium px-3 py-2 rounded-lg"><span className="text-sm">▶</span> Google Play</a>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["SOC 2", "GDPR", "CCPA", "HIPAA"].map((badge) => (
                <span key={badge} className="text-[10px] font-bold text-gray-500 border border-gray-700 px-2 py-0.5 rounded">{badge}</span>
              ))}
            </div>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}><a href="#" className="text-sm text-gray-500 hover:text-white transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">© 2025 Cal.com, Inc. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </div>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors border border-gray-800 rounded-lg px-3 py-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
              English
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms", "Cookie Settings"].map((l) => (
              <a key={l} href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-white antialiased">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Hero />
        <Trusted />
        <HowItWorks />
        <Benefits />
        <FeatureGrid />
        <Testimonials />
        <Integrations />
        <WallOfLove />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}