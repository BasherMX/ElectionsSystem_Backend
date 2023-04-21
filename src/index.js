import express from "express";

import CandidateRoutes from "./authRoutes/candidate.routes.js"
import politicalPartyRoutes from "./authRoutes/political_party.routes.js"
import qrCodeRoutes from "./authRoutes/qr_code.routes.js"
import electorRoutes from "./authRoutes/elector.routes.js"
import userRoutes from "./authRoutes/user.routes.js"
import userNoAuth from "./publicRoutes/noAuth.routes.js"
import { authMiddleware } from "./middleweres/middleware.js";

const app = express()
app.use(express.json())


// --- Auth Routes ---
app.use('/candidate', authMiddleware, CandidateRoutes) 
app.use('/politicalParty', authMiddleware, politicalPartyRoutes)
app.use('/qrCode', authMiddleware, qrCodeRoutes)
app.use('/elector', authMiddleware, electorRoutes)
app.use('/user', authMiddleware, userRoutes)


// --- Public Routes ---
app.use('/public', userNoAuth)







app.listen(3000)
console.log('server on port 3000')