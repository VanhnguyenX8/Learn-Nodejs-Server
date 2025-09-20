import express from 'express';
import ToDoController from '../controllers/ToDoController';
import { authenticateToken } from '../middlewares/AuthMiddleware';
import { cacheMiddleware } from '../middlewares/RedisMiddleware';

const router = express.Router();

router.post('/', authenticateToken, ToDoController.create);

router.get('/', authenticateToken, cacheMiddleware(10), ToDoController.getAll);

router.get('/:id', authenticateToken, cacheMiddleware(10), ToDoController.getById);

router.put('/:id', authenticateToken, ToDoController.update);

router.delete('/:id', authenticateToken, ToDoController.delete);

export default router;