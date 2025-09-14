import express from 'express';
import ToDoController from '../controllers/ToDoController';
import { authenticateToken } from '../middlewares/AuthMiddleware';

const router = express.Router();

router.post('/', authenticateToken, ToDoController.create);

router.get('/', authenticateToken, ToDoController.getAll);

router.get('/:id', authenticateToken, ToDoController.getById);

router.put('/:id', authenticateToken, ToDoController.update);

router.delete('/:id', authenticateToken, ToDoController.delete);

export default router;