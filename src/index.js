import express from "express";

import CandidateRoutes from "./routes/candidate.routes.js"
import politicalPartyRoutes from "./routes/political_party.routes.js"
import qrCodeRoutes from "./routes/qr_code.routes.js"
import electorRoutes from "./routes/elector.routes.js"
import userRoutes from "./routes/user.routes.js"



const app = express()
app.use(express.json())


app.use('/candidate', CandidateRoutes) //Candidate Routes
app.use('/politicalParty', politicalPartyRoutes) //Political party Routes
app.use('/qrCode', qrCodeRoutes) //QR Code Routes
app.use('/elector', electorRoutes) //Elector Routes
app.use('/user', userRoutes) //User Routes







app.listen(3000)
console.log('server on port 3000')