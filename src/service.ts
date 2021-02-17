import Message, {IMessage} from './model';

export default class MessageService {
    public static createMessage(username: string, message: string) {
        return new Message({ username, message });
    }

    public static getAllMessages() {
        return Message.find();
    }
}
