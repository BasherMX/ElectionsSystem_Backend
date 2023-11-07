import { createPool } from "mysql2/promise";
import { config } from 'dotenv';
config();
// import 'dotenv/config';

// console.log("user: " + process.env.DB_USER);
// console.log("passw: " + process.env.DB_PASSWORD);
// console.log("host: " + process.env.DB_HOST);
// console.log("port: " + process.env.DB_PORT);
// console.log("dtbs: " + process.env.DB_DATABASE);


export const pool = createPool({
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   host: process.env.DB_HOST,
   port: process.env.DB_PORT,
   database: process.env.DB_DATABASE
});

// export const pool = createPool({
//    user: "root",
//    password: "1234",
//    host: "localhost",
//    port: 3306,
//    database: "electionsdb"
// });