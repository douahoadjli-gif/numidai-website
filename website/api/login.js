import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from './_db.js';

const COOKIE_NAME = 'numidai_session';
const SESSION_HOURS = 12;

function setSessionCookie(res, token) {
  const maxAge = SESSION_HOURS * 60 * 60;
  const parts = [
    `${COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    `Max-Age=${maxAge}`
  ];
  res.setHeader('Set-Cookie', parts.join('; '));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ error: 'Server misconfigured' });
    return;
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required' });
    return;
  }

  try {
    const db = await getDb();
    const admin = await db.collection('admins').findOne({ username });

    // Constant-shape response whether the user exists or not, to avoid
    // leaking which usernames are valid via timing/response differences.
    const hash = admin?.passwordHash || '$2a$10$invalidsaltinvalidsaltinvalidsaltinvalidsal';
    const ok = await bcrypt.compare(password, hash);

    if (!admin || !ok) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const token = jwt.sign({ sub: admin.username, role: 'admin' }, jwtSecret, {
      expiresIn: `${SESSION_HOURS}h`
    });
    setSessionCookie(res, token);
    res.status(200).json({ ok: true, username: admin.username });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Internal error' });
  }
}
