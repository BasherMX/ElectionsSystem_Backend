import express from "express";
import CandidateRoutes from "./routes/candidate.routes.js"
import politicalPartyRoutes from "./routes/political_party.routes.js"
import qrCodeRoutes from "./routes/qr_code.routes.js"



const app = express()
app.use(express.json())


app.use('/candidate', CandidateRoutes) //Candidate Routes
app.use('/politicalParty', politicalPartyRoutes) //Political party Routes
app.use('/qrCode', qrCodeRoutes) //QR Code Routes







app.listen(3000)
console.log('server on port 3000')