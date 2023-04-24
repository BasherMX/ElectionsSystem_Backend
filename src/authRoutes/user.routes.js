import { Router } from "express";
import {getUserById, createUser, updateUser, getAllEnableUsers, getAllDisableUsers, disableUser, enableUser} from  "../controllers/user.controller.js"

const router = Router();


router.get('/getAllEnable', getAllEnableUsers);

router.get('/getAllDisable', getAllDisableUsers);

router.get('/getById/:id', getUserById);

router.post('/create', createUser);

router.patch('/update/:id', updateUser);

router.post('/disable/:id', disableUser);

router.post('/enable/:id', enableUser);


export default router;