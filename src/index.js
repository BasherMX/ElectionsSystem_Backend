import express from "express";
import CandidateRoutes from "./routes/candidate.routes.js"
import politicalPartyRoutes from "./routes/political_party.routes.js"



const app = express()
app.use(express.json())


app.use('/candidate', CandidateRoutes) //Candidate Routes
app.use('/politicalParty', politicalPartyRoutes) //Candidate Routes







app.listen(3000)
console.log('server on port 3000')