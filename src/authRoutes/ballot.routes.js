import { Router } from "express";
import {getBallotById, createBallot, getAllEnableBallots, getAllDisableBallots, disableBallot, enableBallot} from  "../controllers/ballot.controller.js"

const router = Router();



router.get('/getAllEnable', getAllEnableBallots);

router.get('/getAllDisable', getAllDisableBallots);

router.get('/getById/:id', getBallotById);

router.post('/create', createBallot);


router.post('/disable/:id', disableBallot);

router.post('/enable/:id', enableBallot);


export default router;