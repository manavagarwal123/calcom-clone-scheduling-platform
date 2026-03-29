import prisma from "@/lib/prisma";
import { dbErrorResponse } from "@/lib/db-error";
import { generateSlots } from "@/lib/slots";

export async function POST(req) {
    try {
        const { slug, date } = await req.json();

        if (!slug || !date) {
            return Response.json({ error: "Missing slug or date" }, { status: 400 });
        }

        const event = await prisma.eventType.findUnique({
            where: { slug },
            include: {
                schedule: {
                    include: {
                        availabilities: {
                            orderBy: [
                                { dayOfWeek: "asc" },
                                { sortOrder: "asc" }
                            ],
                        },
                    },
                },
            },
        });

        if (!event) {
            return Response.json({ error: "Event not found" }, { status: 404 });
        }

        if (!event.schedule) {
            return Response.json({ error: "No schedule found" }, { status: 400 });
        }

        const availRows =
            event.schedule.availabilities?.filter((a) => a.enabled) ?? [];

        if (availRows.length === 0) {
            return Response.json([]);
        }

        const selectedDate = new Date(date + "T12:00:00");
        const jsDay = selectedDate.getDay();
        const day = jsDay === 0 ? 7 : jsDay;


        let dayAvailability = availRows.filter(
            (a) => a.dayOfWeek === day
        );

        if (dayAvailability.length === 0) {
            return Response.json([]);
        }

        // 🔥 FIXED HERE (BUFFER ADDED)
        const slots = dayAvailability.flatMap((a) =>
            generateSlots(
                a.startTime,
                a.endTime,
                event.duration,
                event.buffer || 0
            )
        );

        const bookings = await prisma.booking.findMany({
            where: {
                eventTypeId: event.id,
                date: date,
                status: "CONFIRMED",
            },
        });

        const bookedSet = new Set(bookings.map((b) => b.startTime));

        const finalSlots = slots.map((s) => ({
            ...s,
            available: !bookedSet.has(s.start),
        }));

        return Response.json(finalSlots);
    } catch (err) {
        return dbErrorResponse(err);
    }
}