import { randomHex, sha256Hex, timingSafeEqual } from "@max-network/worker-utils";
export function generateSessionId() {
    return randomHex(32);
}
// Stored as `saltHex:sha256Hex(saltHex + password)`.
export async function hashPassword(password) {
    const saltHex = randomHex(16);
    return `${saltHex}:${await sha256Hex(saltHex + password)}`;
}
export async function verifyPassword(password, storedHash) {
    const [salt, hash] = storedHash.split(":");
    if (!salt || !hash)
        return false;
    return timingSafeEqual(await sha256Hex(salt + password), hash);
}
// Session management
export async function createSession(db, userId) {
    const sessionId = generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
    await db
        .prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
        .bind(sessionId, userId, expiresAt)
        .run();
    return sessionId;
}
export async function validateSession(db, sessionId) {
    const result = await db
        .prepare(`
      SELECT s.user_id, u.username
      FROM sessions s
      JOIN admin_users u ON s.user_id = u.id
      WHERE s.id = ? AND s.expires_at > datetime('now')
    `)
        .bind(sessionId)
        .first();
    if (!result)
        return null;
    return { userId: result.user_id, username: result.username };
}
export async function deleteSession(db, sessionId) {
    await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
}
// Clean up expired sessions
export async function cleanupExpiredSessions(db) {
    await db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
}
// Get session ID from cookie header
export function getSessionIdFromCookie(cookieHeader) {
    if (!cookieHeader)
        return null;
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name === "session")
            return value ?? null;
    }
    return null;
}
// Create session cookie
export function createSessionCookie(sessionId) {
    return `session=${sessionId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`;
}
// Delete session cookie
export function deleteSessionCookie() {
    return "session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0";
}
//# sourceMappingURL=auth.js.map