import Call from "@/models/call";
import CONNECT_DB from "@/lib/connect-db";
import { unstable_noStore as nostore } from "next/cache";

export const getAllCalls = async () => {
  nostore();
  CONNECT_DB();
  const data = await Call.find({});
  return JSON.parse(JSON.stringify(data));
};

export const getCallDetails = async (callId: string) => {
  nostore();
  CONNECT_DB();
  const data = await Call.findById(callId);
  console.log(data);
  return JSON.parse(JSON.stringify(data));
};
