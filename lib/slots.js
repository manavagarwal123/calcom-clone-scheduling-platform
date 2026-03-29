export function generateSlots(start, end, duration, buffer = 0) {
    const slots = [];

    let current = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);

    while (true) {
        const next = new Date(current.getTime() + duration * 60000);

        if (next > endTime) break;

        slots.push({
            start: current.toTimeString().slice(0, 5),
            end: next.toTimeString().slice(0, 5),
        });

        // 🔥 USE DYNAMIC BUFFER
        current = new Date(next.getTime() + buffer * 60000);
    }

    return slots;
}