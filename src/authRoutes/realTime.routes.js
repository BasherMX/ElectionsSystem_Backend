import { Router } from "express";
import {getBallotsByExerciseId, getStates, getAllEnableExercises} from  "../controllers/realTime.controller.js"

const router = Router();


router.get('/getBallotsByExerciseId/:exercise_id', getBallotsByExerciseId);
router.get('/getAllStates', getStates);
router.get('/getAllExcersices', getAllEnableExercises);



export default router;