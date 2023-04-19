import { Router } from "express";
import {getUserById, createUser, updateUser, getAllUsers, disableUser, enableUser, verifyAccount} from  "../controllers/user.controller.js"

const router = Router();


router.get('/getAll', getAllUsers);

router.get('/getById/:id', getUserById);

router.post('/create', createUser);

router.patch('/update/:id', updateUser);

router.post('/disable/:id', disableUser);

router.post('/enable/:id', enableUser);

router.post('/verifyAccount/:id', verifyAccount);


export default router;