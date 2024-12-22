'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { X } from 'lucide-react'
import { Application, Member } from '@/utils/types'
import { createClient } from '@/utils/supabase/client'

interface TeamDetailsDialogProps {team : Application | null
  onClose: () => void
  onApprove: (application_id: number, projectId: number) => void
  onReject: (application_id: number, projectId: number) => void
}
async function openResume(resume_filepath: string) {
  const supabase = createClient();
  const {data, error} = await supabase.storage.from("applicants_resumes").createSignedUrl(resume_filepath, 600); // this link is valid for 10mins
  if(data?.signedUrl){
    window.open(data.signedUrl,'_blank');
  }
  else {
    console.error("Error fetching resume:", error?.message);
    alert("Unable to fetch the resume. Please try again.");
  }
}

export function TeamDetailsDialog({ team, onClose, onApprove, onReject }: TeamDetailsDialogProps) {
  if (!team) return null

  return (
    
    <DialogContent className="bg-gray-900 text-white max-w-md">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl">{team.team_name}</DialogTitle>
        </div>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 mb-2">Team detail:</p>
          <p>{team.about_us}</p>
        </div>
        <div>
          <p className="text-gray-400 mb-2">Team members:</p>
          <div className="space-y-2">
            {team.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
                <div>
                  <p>{member.full_name}</p>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => openResume(member.resume)}>
                  View Resume
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
                <Button
                    variant="outline"
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    onClick={() => onReject(team.application_id, team.project_id)}
                >
                    Reject
                </Button>
            </DialogClose>
            <DialogClose asChild>
                <Button
                    variant="outline"
                    className="bg-green-500/10 hover:bg-green-500/20 text-green-400"
                    onClick={() => onApprove(team.application_id, team.project_id)}
                >
                    Approve
                </Button>
            </DialogClose>
        </div>
      </div>
    </DialogContent>
  )
}

