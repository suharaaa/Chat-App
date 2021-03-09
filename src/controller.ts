import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Session, {SESSION_STATE, USER_TYPE} from './model';

const users = [
    { userID: '1', email: "suhara@gmail.com", username: "suhara", password: "suhara123", userType: USER_TYPE.STUDENT },
    { userID: '2', email: "malith@gmail.com", username: "malith", password: "malith123", userType: USER_TYPE.STUDENT },
    { userID: '3', email: "ntb6184@gmail.com", username: "nandun", password: "nandun123", userType: USER_TYPE.TUTOR },
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
        });
    }

    try {
        const session = new Session({ subTopic, students: [req.headers.username] });
        const result = await session.save();

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const login = async (req: Request, res: Response): Promise<Response | null> => {

    const { email, password, userType } = req.body;

    // falsey values 0, '', null, undefined, false
    if (!email || !password || !userType) {
        return res.status(400).json({message: 'email or password undefined'});
    }

    try {

        const user = users.filter(u => u.email === email && u.userType === userType);


        if (user.length === 0) {
            return res.status(400).json({ message: 'Invalid login'});
        }

        const _user = user[0];

        if (_user.password !== password) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { userID: _user.userID, username: _user.username, userType: _user.userType, expiry: new Date().getTime() + 60 * 60 * 1000 },
            '1qaz2wsx@'
        );

        return res.status(200).json({ token });

    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

const getSessionsByState = async (req: Request, res: Response): Promise<Response | null> => {
    const {sessionState} = req.params;
    if (!Object.values(SESSION_STATE).includes(sessionState as SESSION_STATE)) {
        return res.status(400).json({
            error: 'Session state is invalid'
        });
    }
    
    try {
        const sessions = await Session.find({status: sessionState as SESSION_STATE});
        return res.status(200).json(sessions);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

export default {
    getAllMessages,
    createSession,
    login,
    getSession,
    getSessionsByState
}
