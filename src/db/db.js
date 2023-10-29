import { createPool } from "mysql2/promise";
import 'dotenv/config';

// export const pool = createPool({
//    user: process.env.DB_USER,
//    password: process.env.DB_PASSWORD,
//    host: process.env.DB_HOST,
//    port: process.env.DB_PORT,
//    database: process.env.DB_DATABASE
// });

export const pool = createPool({
   user: "root",
   password: "1234",
   host: "localhost",
   port: 3306,
   database: "electionsdb"
});