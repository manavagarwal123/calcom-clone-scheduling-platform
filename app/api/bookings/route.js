import prisma from "@/lib/prisma";
import { dbErrorResponse, isDbConnError } from "@/lib/db-error";

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            orderBy: [
                { date: "asc" },
                { startTime: "asc" }
            ],
            include: {
                eventType: true,
            },
        });

        return Response.json(bookings);
    } catch (e) {
        return dbErrorResponse(e);
    }
}

export async function DELETE(req) {
  try {
    const body = await req.json();
    console.log("BODY:", body);

    const id = Number(body.id);
    console.log("ID:", id);

    if (!id) {
      return Response.json({ error: "ID required" }, { status: 400 });
    }

    const existing = await prisma.booking.findUnique({
      where: { id }
    });

    console.log("EXISTING:", existing);

    if (!existing) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    await prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return Response.json({ success: true });

  } catch (e) {
    console.error("DELETE ERROR:", e); // 🔥 THIS WILL SHOW REAL ERROR
    return Response.json({ error: "Delete failed" }, { status: 400 });
  }
}