import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DB_PATH = path.join(process.cwd(), 'data', 'users.json');

export function authenticateToken(req: NextApiRequest, res: NextApiResponse, next: () => void) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

export function getUserById(userId: number) {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  const users = JSON.parse(data);
  return users.find(user => user.id === userId);
}

export function updateUser(updatedUser) {
  const data = fs.readFileSync(DB_PATH, 'utf8');
  let users = JSON.parse(data);
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
  }
}