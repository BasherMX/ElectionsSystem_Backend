import { Router } from "express";
import { verifyUserAccount } from  "../controllers/noAuth.controller.js"

const router = Router();


router.post('/verifyAccount/:code', verifyUserAccount);


export default router;