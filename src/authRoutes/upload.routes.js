

import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller.js';
import { upload } from '../helpers/upload.helper.js';

const router = Router();

router.post('/upload', upload.single('file'), uploadFile);


export default router;
