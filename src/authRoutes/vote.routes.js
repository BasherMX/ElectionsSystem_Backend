import { Router } from "express";
import {verifyCanVotate, getBallotsByExerciseId, voteForCandidate, getElectorImage} from  "../controllers/vote.controller.js"

const router = Router();


router.post('/verifyCanVotate', verifyCanVotate);

router.get('/getElectorImage/:elector_id', getElectorImage);

router.get('/getBallotsByExerciseId/:exercise_id', getBallotsByExerciseId);

router.post('/voteForCandidate', voteForCandidate);



export default router;