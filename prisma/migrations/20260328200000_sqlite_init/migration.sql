-- CreateTable
CREATE TABLE "Schedule" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "isDefault" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "ScheduleAvailability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scheduleId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ScheduleAvailability_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EventType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "scheduleId" INTEGER,
    CONSTRAINT "EventType_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "timezone" TEXT NOT NULL,
    CONSTRAINT "Booking_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EventType_slug_key" ON "EventType"("slug");

-- CreateIndex
CREATE INDEX "ScheduleAvailability_scheduleId_dayOfWeek_idx" ON "ScheduleAvailability"("scheduleId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_date_startTime_eventTypeId_key" ON "Booking"("date", "startTime", "eventTypeId");

-- Default schedule (Mon–Fri 9–5)
INSERT INTO "Schedule" ("id", "name", "timezone", "isDefault") VALUES (1, 'Working hours', 'Asia/Kolkata', 1);

INSERT INTO "ScheduleAvailability" ("scheduleId", "dayOfWeek", "enabled", "startTime", "endTime", "sortOrder") VALUES
(1, 1, 1, '09:00', '17:00', 0),
(1, 2, 1, '09:00', '17:00', 0),
(1, 3, 1, '09:00', '17:00', 0),
(1, 4, 1, '09:00', '17:00', 0),
(1, 5, 1, '09:00', '17:00', 0);
