import { Router } from "express";
import {getBallotsByExerciseId, ping} from  "../controllers/realTime.controller.js"

const router = Router();


router.get('/getBallotsByExerciseId', getBallotsByExerciseId);
router.get('/ping', ping);



export default router;