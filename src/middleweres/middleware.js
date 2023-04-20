import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

const secret = 'dW%F9@!pKtjZ]wzD6^x8';

const authMiddleware = expressJwt({ secret });

export default authMiddleware;
