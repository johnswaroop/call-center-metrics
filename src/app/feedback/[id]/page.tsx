import { getCallDetails } from "@/actions/db_actions";
import FeedbackForm from "@/app/components/local/feedBackForm";
import { ICall } from "@/models/call";
import React from "react";

async function Feedback({ params }: { params: { [label: string]: string } }) {
  const callData = (await getCallDetails(params.id)) as ICall;

  return (
    <FeedbackForm
      _id={callData._id}
      userQuery={callData.userQuery}
      agentAnswer={callData.agentAnswer}
    />
  );
}

export default Feedback;
