import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface ISession extends Document {
  subTopic: string;
  messages: [];
  tutorID: string;
  students: string[];
  endTime: Date;
  tutorJoinedTime: Date;
  questionCount: number;
  endBy: string;
}

export enum USER_TYPE {
    TUTOR = "tutor",
    STUDENT = "student"
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
        username: { type: String, required: true }
      },
    ],
    tutorID: { type: String },
    students: [{ type: String, required: true }],
    endTime: { type: Date },
    tutorJoinedTime: { type: Date },
    questionCount: { type: Number, default: 0 },
    endBy: { type: String }

  },
  { timestamps: true }
);

export default mongoose.model<ISession>("session", sessionSchema);
