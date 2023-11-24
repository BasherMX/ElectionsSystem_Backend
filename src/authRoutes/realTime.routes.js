import { Router } from "express";
import {getBallotsByExerciseId, getStates} from  "../controllers/realTime.controller.js"

const router = Router();


router.get('/getBallotsByExerciseId/:exercise_id', getBallotsByExerciseId);
router.get('/getAllStates', getStates);



export default router;