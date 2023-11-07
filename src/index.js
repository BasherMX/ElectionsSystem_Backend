import express from "express";
import './config.js'


// --- Middlewares ---
import { authMiddleware } from "./middleweres/middleware.js";


// --- Auth Routes ---
import CandidateRoutes from "./authRoutes/candidate.routes.js"
import politicalPartyRoutes from "./authRoutes/political_party.routes.js"
import qrCodeRoutes from "./authRoutes/qr_code.routes.js"
import electorRoutes from "./authRoutes/elector.routes.js"
import userRoutes from "./authRoutes/user.routes.js"
import ballotRoutes from "./authRoutes/ballot.routes.js"
import exerciseRoutes from "./authRoutes/exercise.routes.js"
import uploadRoutes from "./authRoutes/upload.routes.js"

// --- Public Routes ---
import userNoAuth from "./publicRoutes/noAuth.routes.js"

const app = express()
app.use(express.json())


// --- Auth Routes ---
app.use('/user', authMiddleware, userRoutes)
app.use('/candidate', authMiddleware, CandidateRoutes) 
app.use('/politicalParty', authMiddleware, politicalPartyRoutes)
app.use('/qrCode', authMiddleware, qrCodeRoutes)
app.use('/elector', authMiddleware, electorRoutes)
app.use('/ballot', authMiddleware, ballotRoutes)
app.use('/exercise', authMiddleware, exerciseRoutes)
app.use('/file', authMiddleware, uploadRoutes)



// --- Public Routes ---
app.use('/public', userNoAuth)



app.listen(3000)
console.log('server on port 3000')