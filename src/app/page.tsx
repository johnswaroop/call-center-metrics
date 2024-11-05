import { getAllCalls } from "@/actions/db_actions";
import HotelDashboard from "../app/components/local/hotel-dashboard";
import { ICall } from "@/models/call";
import { unstable_noStore as nostore } from "next/cache";
export default async function Home() {
  nostore();
  const calls = (await getAllCalls()) as ICall[];
  return (
    <div>
      <HotelDashboard calls={calls} />
    </div>
  );
}
