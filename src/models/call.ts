import mongoose from "mongoose";

export interface ICall {
  _id: string;
  callName: string;
  audioFileUrl: string;
  transcript: string;
  summary: string;
  userQuery: string;
  agentAnswer: string;
  keywords: string[];
  sopAdherenceScore: number; // Value between 0 and 100
  sopSteps?: {
    step: number;
    action: string;
    followed: boolean;
    comments: string;
  }[];
  sentiment: string;
  talkToListenRatio: number; // Ratio of agent talking time to customer talking time
  conversationDate: Date;
  agentName?: string;
  emailSent: boolean; // Indicates if an email summary was sent to the customer
  emailConfirmed: boolean; // Indicates if the customer confirmed receipt of the email
  userFeedback?: string; // Optional field for user feedback or comments
  userRating?: number;
}

const CallSchema = new mongoose.Schema({
  callName: { type: String, required: true },
  audioFileUrl: { type: String, required: true },
  transcript: { type: String, required: true },
  summary: { type: String },
  userQuery: { type: String },
  agentAnswer: { type: String },
  keywords: { type: [String] },
  sopAdherenceScore: { type: Number, min: 0, max: 100 }, // Value between 0 and 100
  sopSteps: {
    type: [
      {
        step: Number,
        action: String,
        followed: Boolean,
        comments: String,
      },
    ],
  },
  sentiment: { type: String },
  talkToListenRatio: { type: Number }, // Ratio of agent talking time to customer talking time
  conversationDate: { type: Date, default: Date.now },
  agentName: { type: String },
  emailSent: { type: Boolean }, // Indicates if an email summary was sent to the customer
  emailConfirmed: { type: Boolean }, // Indicates if the customer confirmed receipt of the email
  userFeedback: { type: String }, // Optional field for user feedback or comments
  status: { type: ["IN_PROGRESS", "COMPLETED", "FAILED"] },
  userRating: { type: Number },
});

export default mongoose.models.Call || mongoose.model("Call", CallSchema);
