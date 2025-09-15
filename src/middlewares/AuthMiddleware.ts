
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { Socket } from "socket.io";
// Khóa bí mật dùng để ký và xác thực JWT
const JWT_SECRET = process.env.JWT_SECRET || 'ANHNV';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];

  // Định dạng chuẩn là: Authorization: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Token Error' });
  }

  else {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: number;
        email: string;
      };

      req.user = decoded;

      next();
    } catch (err) {
      res.status(403).json({ message: 'Token Invalid', error: err });
    }
  }
};


export function authSocketMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as any;

    (socket as any).user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
}

