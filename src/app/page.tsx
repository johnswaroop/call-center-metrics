import { getAllCalls } from "@/actions/db_actions";
import HotelDashboard from "../app/components/local/hotel-dashboard";
import { ICall } from "@/models/call";

export default async function Home() {
  const calls = (await getAllCalls()) as ICall[];
  return (
    <div>
      <HotelDashboard calls={calls} />
    </div>
  );
}
