import React from "react";

type Members = {
  full_name: string;
  major: string;
  email: string;
  resume: string;
};

type Team = {
  team_name: string;
  university: string;
  // title: string;
  bio: string;
  members: Members[];
}

interface TeamMenuProps {
  onClose: () => void;
  teamsData: Team | null;
  title: string;
}

const TeamMenu: React.FC<TeamMenuProps> = ({ onClose, teamsData, title }) => {
  if (teamsData == null) {
    return (
      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div
          className="bg-gray-900 text-white rounded-lg shadow-lg w-auto max-w-[450px] max-h-[300px] overflow-y-auto"
        >
          <div className="sticky top-0 bg-gray-900 z-10 p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button className="text-2xl font-bold" onClick={onClose}>
                &times;
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <span>No team details available as the project has not been awarded at this time.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div
          className="bg-gray-900 text-white rounded-lg shadow-lg w-auto max-w-[450px] max-h-[300px] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="sticky top-0 bg-gray-900 z-10 p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button className="text-2xl font-bold" onClick={onClose}>
                &times;
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-4 space-y-3">
            <div>
              <span>University: {teamsData.university}</span>
            </div>
            <div>
              <span>Team Name: {teamsData.team_name}</span>
            </div>
            <div>
              <span>About: {teamsData.bio}</span>
            </div>
            <div>
              <span>Members:</span>
            </div>
            {teamsData.members.map((member, index) => (
              <div
                className="flex items-center justify-between"
                key={index}
              >
                <span>
                  {member.full_name}{/* - {member.major}*/}
                </span>
                <div className="flex space-x-4">
                  <span>
                    {member.email}
                  </span>
                  {/* <button
                    className="outline rounded-lg px-2 py-1"
                    onClick={() => alert(`Email: ${member.email}`)}
                  >
                    Email
                  </button> */}
                  <button
                    className="outline rounded-lg px-2 py-1"
                    onClick={() => window.open(member.resume, "_blank")}
                  >
                    View Resume
                  </button>
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
