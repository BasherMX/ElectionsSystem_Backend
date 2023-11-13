import express from "express";
import cors from "cors"; // Importa el paquete cors
import './config.js'


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
app.use('/user', authMiddleware, userRoutes)
// app.use('/vote', authMiddleware, voteRoutes)
// app.use('/realTime', authMiddleware, realTimeRoutes)
// app.use('/politicalParty', authMiddleware, politicalPartyRoutes)
// app.use('/qrCode', authMiddleware, qrCodeRoutes)
// app.use('/elector', authMiddleware, electorRoutes)
// app.use('/ballot', authMiddleware, ballotRoutes)
// app.use('/exercise', authMiddleware, exerciseRoutes)
// app.use('/file', authMiddleware, uploadRoutes)

// -- Auth Routes for DEV
// app.use('/user', userRoutes)
app.use('/vote', voteRoutes)
app.use('/realTime', realTimeRoutes)
app.use('/politicalParty', politicalPartyRoutes)
app.use('/qrCode', qrCodeRoutes)
app.use('/elector', electorRoutes)
app.use('/ballot', ballotRoutes)
app.use('/exercise', exerciseRoutes)
app.use('/file', uploadRoutes)



// --- Public Routes ---
app.use('/public', userNoAuth)



app.listen(3000)
console.log('server on port 3000')