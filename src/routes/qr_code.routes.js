import { Router } from "express";
import { getElectorQrById, getVotationQrCode } from "../controllers/qr_code.controller.js";

const router = Router();


router.get('/getElectorQrById/:id', getElectorQrById); //Get Elector QR Code by id
router.get('/getVotationQrCode', getVotationQrCode); //Get Votation QR Code by id



export default router;