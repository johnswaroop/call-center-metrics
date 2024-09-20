"use server";
import Call, { ICall } from "@/models/call";
import CONNECT_DB from "@/lib/connect-db";

const action_updateCallDetails = async (
  callId: string,
  data: Partial<ICall>
) => {
  CONNECT_DB();
  console.log({ callId, data });
  const res = await Call.findByIdAndUpdate(callId, data);
  return JSON.parse(JSON.stringify(res));
};

export default action_updateCallDetails;
