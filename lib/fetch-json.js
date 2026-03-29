/**
 * Safe JSON parse for API responses (avoids SyntaxError when server returns HTML).
 * @returns {{ ok: boolean, status: number, data: any }}
 */
export async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: "Invalid response from server" };
  }
  return { ok: res.ok, status: res.status, data };
}
