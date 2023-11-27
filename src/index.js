import express from "express";
import cors from "cors"; // Importa el paquete cors
import './config.js'

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import multer from 'multer';

// --- Middlewares ---
import { authMiddleware } from "./middleweres/middleware.js";


// --- Auth Routes ---
import politicalPartyRoutes from "./authRoutes/political_party.routes.js"
import qrCodeRoutes from "./authRoutes/qr_code.routes.js"
import electorRoutes from "./authRoutes/elector.routes.js"
import userRoutes from "./authRoutes/user.routes.js"
import voteRoutes from "./authRoutes/vote.routes.js"
import ballotRoutes from "./authRoutes/ballot.routes.js"
import exerciseRoutes from "./authRoutes/exercise.routes.js"
import uploadRoutes from "./authRoutes/upload.routes.js"
import realTimeRoutes from "./authRoutes/realTime.routes.js"

// --- Public Routes ---
import userNoAuth from "./publicRoutes/noAuth.routes.js"

const app = express()
app.use(cors()); // Utiliza el middleware de cors
app.use(express.json())


// --- Auth Routes ---
// app.use('/api/user', authMiddleware, userRoutes)
// app.use('/api/vote', authMiddleware, voteRoutes)
// app.use('/api/realTime', authMiddleware, realTimeRoutes)
// app.use('/api/politicalParty', authMiddleware, politicalPartyRoutes)
// app.use('/api/qrCode', authMiddleware, qrCodeRoutes)
// app.use('/api/elector', authMiddleware, electorRoutes)
// app.use('/api/ballot', authMiddleware, ballotRoutes)
// app.use('/api/exercise', authMiddleware, exerciseRoutes)
// app.use('/api/file', authMiddleware, uploadRoutes)

// -- Auth Routes for DEV
app.use('/api/user', userRoutes)
app.use('/api/vote', voteRoutes)
app.use('/api/realTime', realTimeRoutes)
app.use('/api/politicalParty', politicalPartyRoutes)
app.use('/api/qrCode', qrCodeRoutes)
app.use('/api/elector', electorRoutes)
app.use('/api/ballot', ballotRoutes)
app.use('/api/exercise', exerciseRoutes)
app.use('/api/file', uploadRoutes)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use('/getImage', express.static(path.join(__dirname, 'assets/uploads')));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});



// --- Public Routes ---
app.use('/api/public', userNoAuth)



app.listen(3000)
console.log('server on port 3000')