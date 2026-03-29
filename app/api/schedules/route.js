import prisma from "@/lib/prisma";
import { dbErrorResponse, isDbConnError } from "@/lib/db-error";

const DEFAULT_INTERVALS = [
  { dayOfWeek: 1, enabled: true, startTime: "09:00", endTime: "17:00", sortOrder: 0 },
  { dayOfWeek: 2, enabled: true, startTime: "09:00", endTime: "17:00", sortOrder: 0 },
  { dayOfWeek: 3, enabled: true, startTime: "09:00", endTime: "17:00", sortOrder: 0 },
  { dayOfWeek: 4, enabled: true, startTime: "09:00", endTime: "17:00", sortOrder: 0 },
  { dayOfWeek: 5, enabled: true, startTime: "09:00", endTime: "17:00", sortOrder: 0 },
];

export async function GET() {
  try {
    let list = await prisma.schedule.findMany({
      orderBy: [{ isDefault: "desc" }, { id: "asc" }],
      include: {
        availabilities: { orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }] },
        _count: { select: { eventTypes: true } },
      },
    });

    if (list.length === 0) {
      const created = await prisma.schedule.create({
        data: {
          name: "Working hours",
          timezone: "Asia/Kolkata",
          isDefault: true,
          availabilities: { create: DEFAULT_INTERVALS },
        },
        include: {
          availabilities: true,
          _count: { select: { eventTypes: true } },
        },
      });
      list = [created];
      await prisma.eventType.updateMany({
        data: { scheduleId: created.id },
        where: { scheduleId: null },
      });
    }

    return Response.json(list);
  } catch (e) {
    return dbErrorResponse(e);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const name = body.name?.trim();
    if (!name) {
      return Response.json({ error: "Name required" }, { status: 400 });
    }

    const timezone = body.timezone?.trim() || "Asia/Kolkata";
    const copyFromId = body.copyFromId;

    let intervals = DEFAULT_INTERVALS.map((r) => ({ ...r }));

    if (copyFromId) {
      const src = await prisma.scheduleAvailability.findMany({
        where: { scheduleId: Number(copyFromId) },
        orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }],
      });
      if (src.length) {
        intervals = src.map((r) => ({
          dayOfWeek: r.dayOfWeek,
          enabled: r.enabled,
          startTime: r.startTime,
          endTime: r.endTime,
          sortOrder: r.sortOrder,
        }));
      }
    }

    const schedule = await prisma.schedule.create({
      data: {
        name,
        timezone,
        isDefault: false,
        availabilities: {
          create: intervals.map((r) => ({
            dayOfWeek: r.dayOfWeek,
            enabled: r.enabled !== false,
            startTime: r.startTime,
            endTime: r.endTime,
            sortOrder: r.sortOrder ?? 0,
          })),
        },
      },
      include: {
        availabilities: { orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }] },
        _count: { select: { eventTypes: true } },
      },
    });

    return Response.json(schedule);
  } catch (e) {
    if (isDbConnError(e)) return dbErrorResponse(e);
    console.error(e);
    return Response.json({ error: "Could not create schedule" }, { status: 400 });
  }
}
