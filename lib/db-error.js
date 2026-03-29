/**
 * @param {unknown} err
 */
export function isDbConnError(err) {
  if (!err || typeof err !== "object") return false;
  const code = "code" in err ? String(err.code) : "";
  const msg = "message" in err ? String(err.message) : String(err);
  return code === "P1001" || code.startsWith("P10") || msg.includes("Can't reach database");
}

/**
 * @param {unknown} err
 * @returns {Response}
 */
export function dbErrorResponse(err) {
  const message = isDbConnError(err)
    ? "Database unreachable. Set DATABASE_URL=file:./prisma/dev.db in .env (see .env.example), then run: npx prisma migrate dev"
    : "Database error";

  console.error("[db]", err);
  return Response.json({ error: message }, { status: 503 });
}
