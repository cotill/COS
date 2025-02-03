import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

type Members = {
  full_name: string;
  role: string;
  email: string;
  resume: string;
};

type Team = {
  team_name: string;
  university: string;
  bio: string;
  members: Members[];
};

interface TeamMenuProps {
  onClose: () => void;
  teamsData: Team | null;
  title: string;
}

async function openResume(resume_filepath: string) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("applicants_resumes")
    .createSignedUrl(resume_filepath, 600); // Link valid for 10 mins

  if (data?.signedUrl) {
    window.open(data.signedUrl, "_blank");
  } else {
    alert("Unable to fetch the resume. Please try again.");
  }
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
                <span className="text-gray-400">Team detail: </span>
                <span className="max-h-32 overflow-y-auto scrollbar bg-gray-800 rounded-md p-2">{teamsData.bio}</span>
              </div>
              <div>
                <div>
                  <span className="text-gray-400">Members:</span>
                </div>
                <div className={`space-y-2 ${teamsData.members.length > 3 ? "max-h-48 overflow-y-scroll scrollbar" : ""}`}>
                  {teamsData.members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-800 p-2 rounded-md"
                    >
                      <div>
                        <p>{member.full_name}</p>
                        <p className="text-sm text-gray-400">{member.role}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openResume(member.resume)}
                      >
                        View Resume
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <span>No team details available as the project has not been awarded at this time.</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeamMenu;
