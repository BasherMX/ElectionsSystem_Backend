import { Router } from "express";
import {getCandidateById, createCandidate, updateCandidate, getAllCandidates} from  "../controllers/candidate.controller.js"

const router = Router();


router.get('/getById/:id', getCandidateById); //Get a candidate by ID

router.get('/getAll', getAllCandidates); //Get all candidates

router.post('/create', createCandidate); //Create a candidate

router.patch('/update/:id', updateCandidate); //Update a candidate

// router.delete('/disable/:id', enableCandidate); //Delete a candidate


export default router;