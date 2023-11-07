import { Router } from "express";
import {verifyCanVotate} from  "../controllers/vote.controller.js"

const router = Router();


router.get('/verifyCanVotate', verifyCanVotate);



export default router;