import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function StatusChips({
  status,
}: {
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
}) {
  return (
    <div className="flex flex-wrap">
      {status == "IN_PROGRESS" && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1"
        >
          <Clock className="w-4 h-4" />
          <span>In Progress</span>
        </Badge>
      )}
      {status == "COMPLETED" && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 hover:bg-green-200"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Completed</span>
        </Badge>
      )}

      {status == "FAILED" && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200"
        >
          <XCircle className="w-4 h-4" />
          <span>Failed</span>
        </Badge>
      )}
    </div>
  );
}
