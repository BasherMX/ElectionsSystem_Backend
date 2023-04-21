import { Router } from "express";
import { verifyUserAccount, loginUser } from  "../controllers/noAuth.controller.js"

const router = Router();

//Verify Acound Endpoint
router.post('/verifyAccount/:code', verifyUserAccount);


//Login User Endpoint
router.post('/loginUser', loginUser);




export default router;