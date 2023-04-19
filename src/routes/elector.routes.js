import { Router } from "express";
import {getElectorById, getAllElectors, createElector, updateElector} from  "../controllers/elector.controller.js"

const router = Router();

router.get('/getAll', getAllElectors);

router.get('/getById/:id', getElectorById);

router.post('/create', createElector);

router.patch('/update/:id', updateElector);

// router.delete('/disable/:id', enableCandidate); //Delete a candidate


export default router;