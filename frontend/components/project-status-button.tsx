'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import { ProjectStatusOrder } from '@/app/student_applications/project_detail_helper'; 
import { Application_Status, Project_Status } from "@/utils/types";
import { cn } from "@/lib/utils"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { ChevronRight } from "lucide-react"

interface ProjectStatusButtonProp {
  status: Project_Status;
  setProjStatus: (new_status: Project_Status) => void;
}

const statusConfig: Record<Project_Status, {color: string}> = {
  NEW: { color: "bg-white" },
  DRAFT: { color: "bg-white text-black" },
  REVIEW: { color: "bg-[#D7B634]" },
  REJECTED: { color: "bg-[#E75973]" },
  APPROVED: { color: "bg-[#81C26C]" },
  DISPATCHED: { color: "bg-[#000080]" },
  AWARDED: { color: "bg-[#4B006E]" },
  ACTIVE: { color: "bg-[#008080]" },
  COMPLETED: { color: "bg-[#154406]" },
  CANCELLED: { color: "bg-black" },
}
const checkStatusSelectable = (current_status: Project_Status, targetStatus: Project_Status) : boolean => {
  const currentIndex = ProjectStatusOrder.indexOf(current_status);
  const targetIndex = ProjectStatusOrder.indexOf(targetStatus);

  return  targetIndex >= currentIndex ? true : false; // if target index is less than or equal to the current index, then the target status is not selectable
}

function getNextStatus(currentStatus: Project_Status): Project_Status{
  const currentStatusIndex = ProjectStatusOrder.indexOf(currentStatus);
  return currentStatusIndex <  ProjectStatusOrder.length -1 ? ProjectStatusOrder[currentStatusIndex+1] : currentStatus;
}
export function ProjectStatusButton({status, setProjStatus}:ProjectStatusButtonProp){
  const currentConfig = statusConfig[status];
  function handleStatusChange (target_status: Project_Status){
    if(target_status !== status) {// if the current status is not the status that was clicked, then call function
      setProjStatus(target_status);
    }
  }

  const borderColor = status === Project_Status.DRAFT ? "border-black text-black" : "border-white text-white";

  const handleNextStatus = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log("next clicked")
    setProjStatus(getNextStatus(status))
  }
  return (
    <div className="flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={cn("h-9 px-4 rounded-l-full flex items-center font-medium text-white focus:outline-none",currentConfig.color)} >
            <div className="flex items-center space-x-2">
              <div className={cn("w-2 h-2 rounded-full bg-current")} />
              <span>{status}</span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 max-w-40 bg-[#413F46]/95 border-gray-400">
          {ProjectStatusOrder.map((statusKey) => {
            const isSelectable = checkStatusSelectable(status, statusKey);
            return (
              <DropdownMenuItem
                key={statusKey}
                disabled={!isSelectable}
                onClick={() => isSelectable && handleStatusChange(statusKey)}
                className={cn(
                  "flex items-center space-x-2 text-white focus:outline-none",
                  isSelectable ? "hover:bg-gray-800" : "opacity-50 cursor-not-allowed",
                )}
              >
                <div className={cn("w-2 h-2 rounded-full",statusConfig[statusKey].color)} />
                <span>{statusKey}</span>
                {statusKey === status && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <button
        onClick={handleNextStatus}
        className={cn(
          "h-9 px-2 rounded-r-full border-l flex items-center",
          currentConfig.color ,borderColor,
        )}
      >
        <ChevronRight className={`h-5 w-5 ${borderColor}`} />
      </button>
    </div>
  );
}