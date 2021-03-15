import Session, {USER_TYPE} from "./model";
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
      { _id: roomID },
      {
        $push: { messages: messageObject },
      }
    );
  }

  public static getAllMessages() {
    return Session.find();
  }

  public static addJoinedTutor(roomId: string, tutor: string) {
    return Session.updateOne(
        { _id: roomId },
        {
          $push: { joinedTutors: tutor },
        }
    );
  }
  // public static handleTutorLeave(): void {
  //
  // }
}
