"use server";
import Call from "@/models/call";
import CONNECT_DB from "@/lib/connect-db";

const action_savefeedback = async (
  callId: string,
  userFeedback: string,
  userRating: number
) => {
  CONNECT_DB();
  console.log({ callId, userFeedback, userRating });
  const res = await Call.findByIdAndUpdate(callId, {
    userFeedback,
    userRating,
  });
  return JSON.parse(JSON.stringify(res));
};

export default action_savefeedback;
