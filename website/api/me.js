import jwt from 'jsonwebtoken';

function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map((s) => s.trim()).find((s) => s.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}

export default function handler(req, res) {
  const jwtSecret = process.env.JWT_SECRET;
  const token = readCookie(req, 'numidai_session');

  if (!token || !jwtSecret) {
    res.status(200).json({ authenticated: false });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    res.status(200).json({ authenticated: true, username: payload.sub });
  } catch {
    res.status(200).json({ authenticated: false });
  }
}
