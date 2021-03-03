import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface IPayload {
    username: string;
    expiry: number;
    iat: number;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(403).json({
                message: 'auth token not found'
            });
        }

        if (!token.startsWith('Bearer ')) {
            return res.status(403).json({
                message: 'invalid token'
            });
        }

        const _token = token.split(' ')[1];

        if (!jwt.verify(_token, '1qaz2wsx@')) {
            return res.status(403).json({ message: 'unauthorized' });
        }

        // get token payload
        const payload = jwt.decode(_token) as IPayload;

        const expiry = payload?.expiry;

        if (expiry < new Date().getTime()) {
            return res.status(403).json({ message: 'expired token' });
        }

        // custom declaration ekak karanna kammali nisa mehema damme
        req.headers.username = payload.username;

        next();
    } catch (err) {
        return res.status(403).json({ message: err.message });
    }
}

export {
    auth
}
