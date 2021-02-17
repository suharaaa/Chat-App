import Message from './model';

export default class MessageService {
    public static createMessage(username: string, message: string) {
        return new Message({ username, message }).save();
    }

    public static getAllMessages() {
        return Message.find();
    }
}
