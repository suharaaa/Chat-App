import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
  subTopic: string;
  messages: IMessage[];
  tutorID: string;
  students: string[];
  endTime: Date;
  tutorJoinedTime: Date;
  questionCount: number;
  endBy: string;
  status: SESSION_STATE;
}

export interface IMessage extends Document {
  content: string;
  createdAt: Date;
  userID: string;
  userType: USER_TYPE;
  username: string;
}

export enum USER_TYPE {
  TUTOR = "tutor",
  STUDENT = "student",
}

export enum SESSION_STATE {
  ACTIVE = "active",
  OPEN = "open",
  CLOSED = "closed",
}

const sessionSchema: Schema = new Schema(
  {
    subTopic: { type: String, required: true },
    messages: [
      {
        content: { type: String, required: true },
        createdAt: { type: Date, required: true },
        userID: { type: String, required: true },
        userType: { type: String, required: true, enum: USER_TYPE },
        username: { type: String, required: true },
      },
    ],
    tutorID: { type: String },
    students: [{ type: String, required: true }],
    endTime: { type: Date },
    tutorJoinedTime: { type: Date },
    questionCount: { type: Number, default: 0 },
    endBy: { type: String },
    status: { type: String, enum: SESSION_STATE, default: SESSION_STATE.OPEN },
  },
  { timestamps: true }
);

export default mongoose.model<ISession>("session", sessionSchema);

// export { default: model, IMessage, USER_STATE } 
// import Schema from './model'
// import * as Schema from ''
// import { IMessage, USER_STATE } from './model'
