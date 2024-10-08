import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const DB_PATH = path.join(process.cwd(), 'data', 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 添加默认管理员用户
const addDefaultAdminUser = () => {
  let users = [];
  if (fs.existsSync(DB_PATH)) {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    users = JSON.parse(data);
  }

  const adminExists = users.some(user => user.username === 'admin');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123456', 10);
    users.push({
      id: users.length + 1,
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      isAdmin: true,
      virtualBalance: 10000, // 给管理员一些初始余额
      lastFreeRequest: null,
      requestCount: 0
    });
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
  }
};

// 在处理请求之前添加默认管理员用户
addDefaultAdminUser();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const data = fs.readFileSync(DB_PATH, 'utf8');
  const users = JSON.parse(data);

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1d' });

  res.status(200).json({ token, isAdmin: user.isAdmin });
}