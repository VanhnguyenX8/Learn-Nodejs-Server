import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import ToDo from '../models/TodoModel';
import { redisCache } from '../redis/RedisCache';
import { createSuccessRes, errorRes, notfoundRes } from '../utils/BaseRespone';

export default class ToDoController {
  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { title, des, img } = ToDo.fromJson(req.body);
      const todo = await ToDo.create({ title, des, img, userId: req.user!.id });
      redisCache.del(`/api/todo`); // Xoá cache danh sách todo khi có thay đổi
      return res.status(201).json(createSuccessRes('Todo created successfully', 201, { todo }));
    } catch (error) {
      return res.status(500).json(errorRes({ message: 'Create failed', error }));
    }
  }

  static async getAll(req: AuthenticatedRequest, res: Response) {
    try {
      const todos = await ToDo.findAll({ where: { userId: req.user!.id } });
      return res.json(createSuccessRes('Get list successfully', 200, { todos }));
    } catch (error) {
      return res.status(500).json(errorRes({ message: 'Get list failed', error }));
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const todo = await ToDo.findOne({ where: { id, userId: req.user!.id } });
      if (!todo) return res.status(404).json(notfoundRes('Not found'));
      return res.json(createSuccessRes('Get detail successfully', 200, { todo }));
    } catch (error) {
      return res.status(500).json(errorRes({ message: 'Get detail failed', error }));
    }
  }

  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, des, img } = ToDo.fromJson(req.body);
      const todo = await ToDo.findOne({ where: { id, userId: req.user!.id } });
      if (!todo) return res.status(404).json(notfoundRes('Not found'));
      redisCache.del(`/api/todo:${id}`); // Xoá cache danh sách todo khi có thay đổi
      await todo.update({ title, des, img });
      return res.json(createSuccessRes('Updated successfully', 200, { todo }));
    } catch (error) {
      return res.status(500).json(errorRes({ message: 'Update failed', error }));
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const todo = await ToDo.findOne({ where: { id, userId: req.user!.id } });
      if (!todo) return res.status(404).json(notfoundRes('Not found'));

      await todo.destroy();
      return res.json(createSuccessRes('Deleted successfully', 200));
    } catch (error) {
      return res.status(500).json(errorRes({ message: 'Delete failed', error }));
    }
  }
}
