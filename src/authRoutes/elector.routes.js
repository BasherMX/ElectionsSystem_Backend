import { Router } from "express";
import {getElectorById, getAllElectors, createElector, updateElector, disableElector, enableElector} from  "../controllers/elector.controller.js"

const router = Router();

router.get('/getAll', getAllElectors);

router.get('/getById/:id', getElectorById);

router.post('/create', createElector);

router.patch('/update/:id', updateElector);

router.post('/disable/:id', disableElector);

router.post('/enable/:id', enableElector); 


export default router;