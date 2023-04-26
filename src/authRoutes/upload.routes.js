import { Router } from "express";
import { uploadFile, upload } from "../controllers/upload.controller.js";


const router = Router();


router.post('/upload', upload, uploadFile);




export default router;