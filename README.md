This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function BookingPage() {
    const params = useParams();
    const slug = params.slug;

    const [date, setDate] = useState("");
    const [timezone, setTimezone] = useState("");
    const [event, setEvent] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ name: "", email: "" });
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(tz);
    }, []);

    useEffect(() => {
        fetch("/api/event-types")
            .then(res => res.json())
            .then(data => {
                const e = data.find(ev => ev.slug === slug);
                setEvent(e);
            });
    }, [slug]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 🔥 Fetch slots
    const fetchSlots = async () => {
        if (!date) return;

        setLoading(true);

        const res = await fetch("/api/slots", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ slug, date, timezone }),
        });

        if (!res.ok) {
            alert("Failed to fetch slots");
            setLoading(false);
            return;
        }

        const data = await res.json();
        setSlots(data);
        setLoading(false);
    };

    // 🔥 Book slot
    const bookSlot = async () => {
        if (!form.name || !form.email) {
            alert("Please fill all fields");
            return;
        }

        const res = await fetch("/api/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...form,
                date,
                startTime: selected.start,
                endTime: selected.end,
                eventTypeId: event?.id,
                timezone,
            }),
        });

        if (!res.ok) {
            alert("Booking failed");
            return;
        }

        const bookedSlot = selected;
        const bookedName = form.name;
        setSuccess({ slot: bookedSlot, name: bookedName });
        setSelected(null);
        setForm({ name: "", email: "" });
    };

    if (!mounted) return null;

    if (success !== null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-6 rounded-xl shadow text-center">
                    <h2 className="text-xl font-bold mb-2">Booking Confirmed</h2>
                    <p className="text-gray-600">{success.name}</p>
                    <p className="text-gray-600">{date} • {success.slot.start}</p>
                    <p className="text-gray-500 text-sm">{timezone}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">

                <h1 className="text-2xl font-semibold mb-4 text-center">
                    Book Meeting
                </h1>

                {/* Date */}
                <input
                    type="date"
                    className="border rounded-lg p-2 w-full"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                {/* Timezone */}
                <select
                    className="border rounded-lg p-2 w-full mt-2"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                >
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York</option>
                </select>

                <button
                    onClick={fetchSlots}
                    className="mt-3 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
                >
                    Check Availability
                </button>

                {/* Slots */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                    {slots.map((slot, i) => (
                        <button
                            key={i}
                            disabled={slot.available === false}
                            onClick={() => setSelected(slot)}
                            className={`p-2 border rounded-lg text-sm 
                                ${slot.available === false ? "bg-gray-200 text-gray-400 cursor-not-allowed" : ""}
                                ${selected?.start === slot.start ? "bg-black text-white" : "hover:bg-gray-100"}
                            `}
                        >
                            {slot.start}
                        </button>
                    ))}
                </div>

                {/* Booking Form */}
                {selected && (
                    <div className="mt-4">
                        <input
                            placeholder="Your Name"
                            className="border p-2 w-full rounded-lg"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                        <input
                            placeholder="Your Email"
                            className="border p-2 w-full mt-2 rounded-lg"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />

                        <button
                            onClick={bookSlot}
                            className="w-full bg-green-500 text-white py-2 mt-3 rounded-lg hover:bg-green-600 transition"
                        >
                            Confirm Booking
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}
