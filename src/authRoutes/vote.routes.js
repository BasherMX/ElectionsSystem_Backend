import { Router } from "express";
import {verifyCanVotate, getBallotsByExerciseId, voteForCandidate} from  "../controllers/vote.controller.js"

const router = Router();


router.get('/verifyCanVotate', verifyCanVotate);

router.get('/getBallotsByExerciseId', getBallotsByExerciseId);

router.post('/voteForCandidate', voteForCandidate);



export default router;