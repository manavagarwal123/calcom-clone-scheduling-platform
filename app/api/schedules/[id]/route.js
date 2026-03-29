import prisma from "@/lib/prisma";
import { dbErrorResponse, isDbConnError } from "@/lib/db-error";

export async function GET(_req, ctx) {
  const params = await ctx.params;
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        availabilities: { orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }] },
        _count: { select: { eventTypes: true } },
      },
    });

    if (!schedule) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(schedule);
  } catch (e) {
    return dbErrorResponse(e);
  }
}

export async function PUT(req, ctx) {
  const params = await ctx.params;
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const existing = await prisma.schedule.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const name = body.name !== undefined ? String(body.name).trim() : existing.name;
    const timezone = body.timezone !== undefined ? String(body.timezone).trim() : existing.timezone;
    const isDefault = body.isDefault !== undefined ? Boolean(body.isDefault) : existing.isDefault;

    const intervals = body.intervals;

    await prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.schedule.updateMany({
          where: { id: { not: id } },
          data: { isDefault: false },
        });
      }

      await tx.schedule.update({
        where: { id },
        data: { name, timezone, isDefault },
      });

      if (Array.isArray(intervals)) {
        await tx.scheduleAvailability.deleteMany({ where: { scheduleId: id } });

        const rows = [];
        for (const day of intervals) {
          const dow = Number(day.dayOfWeek);
          if (dow < 0 || dow > 6) continue;
          if (!day.enabled) continue;
          const slots = Array.isArray(day.slots) ? day.slots : [{ start: "09:00", end: "17:00" }];
          let sortOrder = 0;
          for (const slot of slots) {
            if (!slot?.start || !slot?.end) continue;
            rows.push({
              scheduleId: id,
              dayOfWeek: dow,
              enabled: true,
              startTime: normalizeTime(slot.start),
              endTime: normalizeTime(slot.end),
              sortOrder: sortOrder++,
            });
          }
        }

        if (rows.length) {
          await tx.scheduleAvailability.createMany({ data: rows });
        }
      }
    });

    const updated = await prisma.schedule.findUnique({
      where: { id },
      include: {
        availabilities: { orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }] },
        _count: { select: { eventTypes: true } },
      },
    });

    return Response.json(updated);
  } catch (e) {
    if (isDbConnError(e)) return dbErrorResponse(e);
    console.error(e);
    return Response.json({ error: "Update failed" }, { status: 400 });
  }
}

function normalizeTime(t) {
  const s = String(t).trim();
  if (/^\d{1,2}:\d{2}$/.test(s)) {
    const [h, m] = s.split(":");
    return `${h.padStart(2, "0")}:${m}`;
  }
  return s;
}

export async function DELETE(_req, ctx) {
  const params = await ctx.params;
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const existing = await prisma.schedule.findUnique({ where: { id } });
    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }
    if (existing.isDefault) {
      return Response.json({ error: "Cannot delete the default schedule" }, { status: 400 });
    }

    const fallback = await prisma.schedule.findFirst({
      where: { isDefault: true, id: { not: id } },
    });
    const targetId = fallback?.id ?? (await prisma.schedule.findFirst({ where: { id: { not: id } } }))?.id;

    if (!targetId) {
      return Response.json({ error: "No fallback schedule" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.eventType.updateMany({
        where: { scheduleId: id },
        data: { scheduleId: targetId },
      }),
      prisma.schedule.delete({ where: { id } }),
    ]);

    return Response.json({ success: true });
  } catch (e) {
    return dbErrorResponse(e);
  }
}
