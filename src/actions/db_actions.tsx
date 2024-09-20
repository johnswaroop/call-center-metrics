import Call from "@/models/call";
import CONNECT_DB from "@/lib/connect-db";

export const getAllCalls = async () => {
  CONNECT_DB();
  const data = await Call.find({});
  return JSON.parse(JSON.stringify(data));
};

export const getCallDetails = async (callId: string) => {
  CONNECT_DB();
  const data = await Call.findById(callId);
  return JSON.parse(JSON.stringify(data));
};
