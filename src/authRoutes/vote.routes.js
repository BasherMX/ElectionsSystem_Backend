import { Router } from "express";
import {verifyCanVotate, getBallotsByExerciseId} from  "../controllers/vote.controller.js"

const router = Router();


router.get('/verifyCanVotate', verifyCanVotate);
router.get('/getBallotsByExerciseId', getBallotsByExerciseId);



export default router;