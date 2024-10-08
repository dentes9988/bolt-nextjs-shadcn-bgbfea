import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');
const verificationCodes = new Map<string, string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, email, password, verificationCode } = req.body;

  if (!username || !email || !password || !verificationCode) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // 验证验证码
  const storedCode = verificationCodes.get(email);
  if (!storedCode || storedCode !== verificationCode) {
    return res.status(400).json({ message: 'Invalid verification code' });
  }

  let users = [];
  if (fs.existsSync(DB_PATH)) {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    users = JSON.parse(data);
  }

  if (users.find(user => user.username === username || user.email === email)) {
    return res.status(400).json({ message: 'Username or email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    email,
    password: hashedPassword,
    virtualBalance: 1000, // Starting balance in cents
    lastFreeRequest: null,
    requestCount: 0
  };

  users.push(newUser);
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));

  // 删除已使用的验证码
  verificationCodes.delete(email);

  res.status(201).json({ message: 'User registered successfully' });
}