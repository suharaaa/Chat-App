import Session, {IStroke, USER_TYPE} from "./model";
// module: export { default: SessionService }
export default class SessionService {
    public static createMessage(
        roomID: string,
        username: string,
        message: string,
        userID: string,
        userType: USER_TYPE
    ) {
        const messageObject = {
            createdAt: new Date(),
            content: message,
            userID,
            userType: userType,
            username,
        };
        return Session.updateOne(
            {_id: roomID},
            {
                $push: {messages: messageObject},
            }
        );
    }

    public static getAllMessages() {
        return Session.find();
    }

    public static addJoinedTutor(roomId: string, tutor: string) {
        return Session.updateOne(
            {_id: roomId},
            {
                $push: {joinedTutors: tutor},
            }
        );
    }

    public static setJoinedTutor(roomId: string, tutor: string, time: Date) {
        return Session.updateOne(
            {_id: roomId},
            {
                tutorID: tutor,
                tutorJoinedTime: time
            }
        );
    }

    public static async addStroke(roomId: string, prevX: Number, prevY: Number, currX: Number, currY: Number, strokeStyle: string, lineWidth: Number) {
        await Session.updateOne(
            {_id: roomId},
            {
                $push: {
                    whiteboard: {prevX, prevY, currX, currY, strokeStyle, lineWidth}
                }
            }
        )
    }

    public static async addStrokesAsBatch(roomId: string, strokes: IStroke[]) {
        await Session.updateOne(
            {_id: roomId},
            {
                $push: {
                    whiteboard: {
                        $each: strokes
                    }
                }
            }
        )
    }
}
