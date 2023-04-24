import { Router } from "express";
import { getAllEnableParties, getAllDisableParties, getPartyById, createParty, updateParty, disablePartys, enablePartys} from  "../controllers/political_party.controller.js"

const router = Router();


router.get('/getAllEnable', getAllEnableParties);

router.get('/getAllDisable', getAllDisableParties);

router.get('/getById/:id', getPartyById);

router.post('/create', createParty);

router.patch('/update/:id', updateParty);

router.post('/disable/:id', disablePartys);

router.post('/enable/:id', enablePartys);


export default router;