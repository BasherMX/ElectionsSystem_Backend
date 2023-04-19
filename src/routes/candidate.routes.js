import { Router } from "express";
import {getCandidateById, createCandidate, updateCandidate, getAllCandidates, disableCandidate, enableCandidate} from  "../controllers/candidate.controller.js"

const router = Router();


router.get('/getById/:id', getCandidateById);

router.get('/getAll', getAllCandidates);

router.post('/create', createCandidate);

router.patch('/update/:id', updateCandidate);

router.post('/disable/:id', disableCandidate);

router.post('/enable/:id', enableCandidate);


export default router;