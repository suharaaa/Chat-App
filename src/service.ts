import Session from "./model";

export default class SessionService {
  public static createMessage(
    roomID: string,
    username: string,
    message: string,
    userID: string,
    userType: string
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
}
