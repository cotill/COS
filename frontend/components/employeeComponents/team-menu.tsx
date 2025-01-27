import React from "react";

type Members = {
  full_name: string;
  major: string;
  email: string;
  resume: string;
};

interface TeamMenuProps {
  onClose: () => void;
  teamsData: {
    projectName: string;
    university: string;
    teamName: string;
    members: Members[];
  };
}

const TeamMenu: React.FC<TeamMenuProps> = ({ onClose, teamsData }) => {
  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black opacity-10 z-40" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div className="w-1/4 bg-gray-900 text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-l font-semibold">{teamsData.projectName}</span>
            </div>
            <button className="text-xl font-bold" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <span>University: {teamsData.university}</span>
            </div>
            <div>
              <span>Team Name: {teamsData.teamName}</span>
            </div>
            {teamsData.members.map((member, index) => (
              <div className="flex flex-col gap-3" key={index}>
                <div className="flex justify-between items-center">
                  <span className="flex-1">
                    {member.full_name} - {member.major}
                  </span>
                  <div className="flex space-x-2 flex-wrap">
                    <button
                      className="outline rounded-lg p-0.5"
                      onClick={() => alert(`Email: ${member.email}`)}
                    >
                      Email
                    </button>
                    <button
                      className="outline rounded-lg p-0.5"
                      onClick={() => window.open(member.resume, "_blank")}
                    >
                      View Resume
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamMenu;
