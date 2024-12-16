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

interface TeamMember {
  name: string
  role: string
  specialization: string
}

interface TeamDetailsDialogProps {
  team: {
    id: number
    teamName: string
    members: TeamMember[]
  } | null
  onClose: () => void
  onApprove: (teamId: number) => void
  onReject: (teamId: number) => void
}

export function TeamDetailsDialog({ team, onClose, onApprove, onReject }: TeamDetailsDialogProps) {
  if (!team) return null

  return (
    
    <DialogContent className="bg-gray-900 text-white max-w-md">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl">{team.teamName}</DialogTitle>
        </div>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <p className="text-gray-400">Team detail:</p>
          <p>maybe allow team to quickly say something</p>
        </div>
        <div>
          <p className="text-gray-400 mb-2">Team members:</p>
          <div className="space-y-2">
            {team.members.map((member, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
                <div>
                  <p>{member.name}</p>
                  <p className="text-sm text-gray-400">{member.specialization}</p>
                </div>
                <Button variant="outline" size="sm">
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
                    onClick={() => onReject(team.id)}
                >
                    Reject
                </Button>
            </DialogClose>
            <DialogClose asChild>
                <Button
                    variant="outline"
                    className="bg-green-500/10 hover:bg-green-500/20 text-green-400"
                    onClick={() => onApprove(team.id)}
                >
                    Approve
                </Button>
            </DialogClose>
        </div>
      </div>
    </DialogContent>
  )
}

