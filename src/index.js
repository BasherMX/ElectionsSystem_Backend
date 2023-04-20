import express from "express";

import CandidateRoutes from "./routes/candidate.routes.js"
import politicalPartyRoutes from "./routes/political_party.routes.js"
import qrCodeRoutes from "./routes/qr_code.routes.js"
import electorRoutes from "./routes/elector.routes.js"
import userRoutes from "./routes/user.routes.js"



const app = express()
app.use(express.json())

//Candidate Routes
app.use('/candidate', CandidateRoutes) 

//Political party Routes
app.use('/politicalParty', politicalPartyRoutes)

//QR Code Routes
app.use('/qrCode', qrCodeRoutes)

//Elector Routes
app.use('/elector', electorRoutes)

//User Routes
app.use('/user', userRoutes)







app.listen(3000)
console.log('server on port 3000')