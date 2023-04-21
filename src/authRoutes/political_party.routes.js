import { Router } from "express";
import {getAllParties, getPartyById} from  "../controllers/political_party.controller.js"

const router = Router();


router.get('/getAll', getAllParties); //Get all

router.get('/getById/:id', getPartyById); //Get a candidate by ID


// router.post('/create', createCandidate); //Create a candidate

// router.patch('/update/:id', updateCandidate); //Update a candidate


export default router;