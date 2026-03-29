import prisma from "@/lib/prisma";
import { dbErrorResponse, isDbConnError } from "@/lib/db-error";

export async function POST(req) {
    try {
        const body = await req.json();

        if (!body.title || !body.duration || !body.slug) {
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        let scheduleId = body.scheduleId ? Number(body.scheduleId) : null;

        if (!scheduleId) {
            const def = await prisma.schedule.findFirst({
                where: { isDefault: true },
                orderBy: { id: "asc" },
            });
            scheduleId = def?.id ?? null;
        }

        const event = await prisma.eventType.create({
            data: {
                title: body.title,
                description: body.description,
                duration: Number(body.duration),
                buffer: Number(body.buffer) || 0, // ✅ ADD THIS
                slug: body.slug,
                scheduleId,
            },
        });

        return Response.json(event);
    } catch (err) {
        if (isDbConnError(err)) return dbErrorResponse(err);
        return Response.json(
            { error: "Slug already exists or creation failed" },
            { status: 400 }
        );
    }
}

export async function GET() {
    try {
        const events = await prisma.eventType.findMany({
            orderBy: { id: "desc" },
            include: {
                schedule: {
                    select: { id: true, name: true, timezone: true, isDefault: true },
                },
            },
        });

        return Response.json(events);
    } catch (err) {
        return dbErrorResponse(err);
    }
}

export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return Response.json({ error: "ID required" }, { status: 400 });
        }

        await prisma.eventType.delete({
            where: { id: Number(id) },
        });

        return Response.json({ success: true });
    } catch (err) {
        if (isDbConnError(err)) return dbErrorResponse(err);
        return Response.json(
            { error: "Event not found" },
            { status: 404 }
        );
    }
}

export async function PUT(req) {
    try {
        const { id, title, description, duration, slug, scheduleId, buffer } = await req.json();

        if (!id || !title || !duration || !slug) {
            return Response.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const data = {
            title,
            description,
            duration: Number(duration),
            buffer: Number(buffer) || 0, // ✅ ADD THIS
            slug,
        };

        if (scheduleId !== undefined) {
            data.scheduleId = scheduleId ? Number(scheduleId) : null;
        }

        const updated = await prisma.eventType.update({
            where: { id: Number(id) },
            data,
        });

        return Response.json(updated);
    } catch (err) {
        if (isDbConnError(err)) return dbErrorResponse(err);
        return Response.json(
            { error: "Slug already exists or update failed" },
            { status: 400 }
        );
    }
}