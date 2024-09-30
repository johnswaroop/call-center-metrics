"use server";

import { getCallDetails } from "@/actions/db_actions";
import { ModernTranscriptionResults } from "@/app/components/local/ModernTranscriptionResults";
import { ICall } from "@/models/call";

export default async function Result({
  params,
}: {
  params: { [label: string]: string };
}) {
  const callData = (await getCallDetails(params.id)) as ICall;
  return <ModernTranscriptionResults {...callData} />;
}
