import prisma from "@/lib/prisma";
import { dbErrorResponse, isDbConnError } from "@/lib/db-error";

export async function POST(req) {
    try {
        const body = await req.json();

        // ✅ 1. Validate input
        if (
            !body.name ||
            !body.email ||
            !body.date ||
            !body.startTime ||
            !body.endTime ||
            !body.eventTypeId
        ) {
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // ✅ 2. Prevent double booking (IMPORTANT)
        const existing = await prisma.booking.findFirst({
            where: {
                date: body.date,
                startTime: body.startTime,
                eventTypeId: body.eventTypeId,
            },
        });

        if (existing) {
            return Response.json(
                { error: "Slot already booked" },
                { status: 400 }
            );
        }

        // ✅ 3. Create booking
        const booking = await prisma.booking.create({
            data: {
                name: body.name,
                email: body.email,
                date: body.date,
                startTime: body.startTime,
                endTime: body.endTime,
                eventTypeId: body.eventTypeId,
                timezone: body.timezone || "Asia/Kolkata",
            },
        });

        return Response.json(booking);

    } catch (err) {
        if (isDbConnError(err)) return dbErrorResponse(err);
        console.log(err);
        return Response.json(
            { error: "Booking failed" },
            { status: 400 }
        );
    }
}