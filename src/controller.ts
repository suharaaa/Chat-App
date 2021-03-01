import { Request, Response } from 'express';
import SessionService from "./service";
import jwt from 'jsonwebtoken';
import Session from './model';

const users = [
    { email: "suhara@gmail.com", username: "suhara", password: "suhara123" },
    { email: "ntb6184@gmail.com", username: "nandun", password: "nandun123" }
];

const getAllMessages = async (req: Request, res: Response): Promise<Response | null> => {
    return null;
}

const getSession = async (req: Request, res: Response): Promise<Response | null> => {
    return res.status(200).send();
}

const createSession = async (req: Request, res: Response): Promise<Response | null> => {
    const { subTopic } = req.body;

    if (!subTopic) {
        return res.status(400).json({ 
            message: 'Parameter \'subTopic\' is undefined or is an empty string'
        })
    }
    
    try {
        const session = new Session({ subTopic });
        const result = await session.save();

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const login = async (req: Request, res: Response): Promise<Response | null> => {

    const { email, password } = req.body;
    
    // falsey values 0, '', null, undefined, false
    if (!email || !password) {
        return res.status(400).json({message: 'email or password undefined'});
    }

    try {

        const user = users.filter(u => u.email === email);

        
        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid login'});
        }

        const _user = user[0];

        if (_user.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { username: _user.username, expiry: new Date().getTime() + 60 * 60 * 1000 },
            '1qaz2wsx@'
        );

        return res.status(200).json({ token });

    } catch (err) {
        return res.status(500).json({message: err.message});
    }
}


export default {
    getAllMessages,
    createSession,
    login,
    getSession
}
