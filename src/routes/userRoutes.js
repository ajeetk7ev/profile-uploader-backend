import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { validate, userCreateSchema, userUpdateSchema } from '../middlewares/validateRequest.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', validate(userCreateSchema), createUser);
router.put('/:id', validate(userUpdateSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
