import { Router } from "express";
import { getAllEnableExercises, getAllDisableExercises, getAllNotAssignedExercises, getExerciseById, createExercise, updateExercise, disableExercises, enableExercises} from  "../controllers/exercise.controller.js"

const router = Router();


router.get('/getAllEnable', getAllEnableExercises);

router.get('/getAllDisable', getAllDisableExercises);

router.get('/getById/:id', getExerciseById);

router.post('/create', createExercise);

router.patch('/update/:id', updateExercise);

router.post('/disable/:id', disableExercises);

router.post('/enable/:id', enableExercises);

router.post('/notAssigned', getAllNotAssignedExercises);


export default router;