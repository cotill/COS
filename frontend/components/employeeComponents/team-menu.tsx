import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Members = {
  full_name: string;
  role: string;
  email: string;
  ttg: string;
};

type Team = {
  team_name: string;
  university: string;
  members: Members[];
  supervisor_name: string;
  supervisor_email: string;
};

interface TeamMenuProps {
  onClose: () => void;
  teamsData: Team | null;
  title: string;
}

const TeamMenu: React.FC<TeamMenuProps> = ({ onClose, teamsData, title }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white rounded-lg shadow-lg max-w-[450px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {teamsData ? (
            <>
              <div className='flex flex-col'>
                <span className="text-gray-400">Team Name: </span>
                <span>{teamsData.team_name}</span>
              </div>
              <div className='flex flex-col'>
                <span className="text-gray-400">University: </span>
                <span>{teamsData.university}</span>
              </div>
              <div className='flex flex-col'>
                <span className="text-gray-400">Supervisor: </span>
                  <div
                    className="flex flex-col bg-gray-800 p-2 rounded-md"
                  >
                    <div className='flex items-center justify-between'>
                    <div className='flex'>
                      <p>Name:&nbsp;</p>
                      <p>{teamsData.supervisor_name}</p>
                    </div>
                    </div>
                    <div className='flex'>
                      <p className='text-sm text-gray-400'>Email:&nbsp;</p>
                      <p className='text-sm'> {teamsData.supervisor_email}</p>
                    </div>
                  </div>
              </div>
              <div>
                <div>
                  <span className="text-gray-400">Members:</span>
                </div>
                <div className={`space-y-2 ${teamsData.members.length > 2 ? "max-h-48 overflow-y-scroll scrollbar" : ""}`}>
                  {teamsData.members.map((member, index) => (
                    <div
                      key={index}
                      className="flex flex-col bg-gray-800 p-2 rounded-md"
                    >
                      <div className='flex items-center justify-between'>
                      <div>
                        <p>{member.full_name}</p>
                      </div>
                      </div>
                      <div className='flex'>
                        <p className='text-sm text-gray-400'>Email:&nbsp;</p>
                        <p className='text-sm'> {member.email}</p>
                      </div>
                      <div className='flex'>
                        <p className='text-sm text-gray-400'>TTG:&nbsp;</p>
                        <p className='text-sm'>{member.ttg ? member.ttg : "N/A"}</p>
                      </div>
                    </div>
                  ))}
                  <div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='flex flex-col'>
                <span className="text-gray-400">Team Name: </span>
                <span>N/A</span>
              </div>
              <div className='flex flex-col'>
                <span className="text-gray-400">University: </span>
                <span>N/A</span>
              </div>
              <div className='flex flex-col'>
                <span className="text-gray-400">Supervisor: </span>
                  <div
                    className="flex flex-col bg-gray-800 p-2 rounded-md"
                  >
                    <div className='flex items-center justify-between'>
                    <div className='flex'>
                      <p>Name:&nbsp;</p>
                      <p>N/A</p>
                    </div>
                    </div>
                    <div className='flex'>
                      <p className='text-sm text-gray-400'>Email:&nbsp;</p>
                      <p className='text-sm'>N/A</p>
                    </div>
                  </div>
              </div>
              <div>
                <div>
                  <span className="text-gray-400">Members:</span>
                </div>
                <div>
                    <div
                      className="flex flex-col bg-gray-800 p-2 rounded-md"
                    >
                      <div className='flex items-center justify-between'>
                      <div>
                        <p>No team assigned</p>
                      </div>
                      </div>
                      <div className='flex'>
                        <p className='text-sm text-gray-400'>Email:&nbsp;</p>
                        <p className='text-sm'> N/A</p>
                      </div>
                      <div className='flex'>
                        <p className='text-sm text-gray-400'>TTG:&nbsp;</p>
                        <p className='text-sm'>N/A</p>
                      </div>
                    </div>
                  <div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMenu;
