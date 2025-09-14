import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';
import { createSuccessRes, errorRes, notfoundRes } from '../utils/BaseRespone';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export default class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = User.fromJson(req.body);

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json(notfoundRes('Email already exists'));
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json(createSuccessRes('User registered successfully', 201, { user, token }));
    } catch (error) {
      return res.status(500).json(errorRes(error, 'Registration failed'));
    }
  }

  // Đăng nhập
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = User.fromJson(req.body);

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json(notfoundRes('Invalid email or password'));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json(notfoundRes('Invalid email or password'));
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

      return res.json(createSuccessRes('Login successful', 200, { token, user }));
    } catch (error) {
      return res.status(500).json(errorRes(error, 'Login failed'));
    }
  }

  static async logout(_req: Request, res: Response) {
    return res.json(createSuccessRes('Logged out successfully'));
  }
}