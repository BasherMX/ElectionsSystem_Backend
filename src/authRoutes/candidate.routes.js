import { Router } from "express";
import {getCandidateById, createCandidate, updateCandidate, getAllNotAssignedCandidates, getAllEnableCandidates, getAllDisableCandidates, disableCandidate, enableCandidate} from  "../controllers/candidate.controller.js"

const router = Router();



router.get('/getAllEnable', getAllEnableCandidates);

router.get('/getAllDisable', getAllDisableCandidates);

router.get('/getAllNotAssigned', getAllNotAssignedCandidates);

router.get('/getById/:id', getCandidateById);

router.post('/create', createCandidate);

router.patch('/update/:id', updateCandidate);

router.post('/disable/:id', disableCandidate);

router.post('/enable/:id', enableCandidate);


export default router;