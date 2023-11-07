import jwt from 'jsonwebtoken';
import 'dotenv/config';


export function generateToken(mail){
    const payload = {
        email: mail,
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 10) // Expiration time of 10 hours

    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return {
      token: token,
      expires: formatDate(payload.exp)
    }
}


function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }
  
  