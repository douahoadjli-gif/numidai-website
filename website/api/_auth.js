import jwt from 'jsonwebtoken';

export function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map((s) => s.trim()).find((s) => s.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}

/** Returns the decoded session payload, or null if there is no valid admin session. */
export function requireAdmin(req) {
  const jwtSecret = process.env.JWT_SECRET;
  const token = readCookie(req, 'numidai_session');
  if (!token || !jwtSecret) return null;
  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
}
