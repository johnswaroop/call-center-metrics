"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, UserCheck } from "lucide-react";
import { DialogDemo } from "../local/form-dialog";
import StatusChips from "./statusChips";
import Nav from "./../local/nav";
import { ICall } from "@/models/call";

// Mock data for the dashboard
const mockData = [
  {
    id: 1,
    agentName: "John Doe",
    customerId: "CUST001",
    queryType: "Reservation",
    keywords: ["check-in", "sea view"],
    emailSent: true,
    userVerified: true,
  },
  {
    id: 2,
    agentName: "Jane Smith",
    customerId: "CUST002",
    queryType: "Billing",
    keywords: ["refund", "extra charges"],
    emailSent: false,
    userVerified: true,
  },
  {
    id: 3,
    agentName: "Mike Johnson",
    customerId: "CUST003",
    queryType: "Facilities",
    keywords: ["pool", "gym hours"],
    emailSent: true,
    userVerified: false,
  },
  {
    id: 4,
    agentName: "Sarah Brown",
    customerId: "CUST004",
    queryType: "Reservation",
    keywords: ["cancellation", "date change"],
    emailSent: true,
    userVerified: true,
  },
  {
    id: 5,
    agentName: "Chris Lee",
    customerId: "CUST005",
    queryType: "Facilities",
    keywords: ["room service", "late checkout"],
    emailSent: false,
    userVerified: true,
  },
];

export default function Component({ calls }: { calls: ICall[] }) {
  return (
    <div className="container mx-auto p-6 ">
      <Nav />

      <div className="grid gap-4 md:grid-cols-4 my-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Total Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Emails Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.filter((item) => item.emailSent).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Users Verified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.filter((item) => item.userVerified).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Unique Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mockData.map((item) => item.customerId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-semibold">Conversation Log</h2>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <div className="flex space-x-2 items-center">
            <DialogDemo />
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto p-2">
        <CallList calls={calls} />
      </div>
    </div>
  );
}

const CallList = ({ calls }: { calls: ICall[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="text-base">
          <TableHead>ID</TableHead>
          <TableHead>Call Name</TableHead>
          {/* <TableHead>Query Type</TableHead> */}
          <TableHead>Keywords</TableHead>
          <TableHead>Email Sent</TableHead>
          <TableHead>User Verified</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-lg">
        {calls.map((item, key) => (
          <TableRow
            onClick={() => {
              location.href = `/result/${item._id}`;
            }}
            className="cursor-pointer"
            key={item._id + "row"}
          >
            <TableCell>{key + 1}</TableCell>
            <TableCell>{item.callName}</TableCell>
            {/* <TableCell>
            <Badge className="text-sm" variant="outline">
              {item.queryType}
            </Badge>
          </TableCell> */}
            <TableCell>
              {item.keywords
                .map((keyword, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="mr-1 mb-1 text-sm"
                  >
                    {keyword}
                  </Badge>
                ))
                .slice(0, 4)}
            </TableCell>
            <TableCell>
              {item.emailSent && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </TableCell>
            <TableCell>
              {item.emailConfirmed && (
                <UserCheck className="h-5 w-5 text-green-500" />
              )}
            </TableCell>
            <TableCell>
              <StatusChips status="COMPLETED" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
