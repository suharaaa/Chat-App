import { Request, Response } from 'express';
import MessageService from "./service";

const getAllMessages = async (req: Request, res: Response): Promise<Response | null> => {
    try {
        const messages = await MessageService.getAllMessages();
        return res.status(200).json(messages);
    } catch (err) {
        console.log(err.stack);
        return res.status(500).json({ error: err.message });
    }
}

export default {
    getAllMessages
}
