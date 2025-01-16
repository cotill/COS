import React from "react";
import Link from "next/link";

interface TeamMenuProps {
  onClose: () => void;
}

const TeamMenu: React.FC<TeamMenuProps> = ({ onClose }) => {
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
              <span className="text-l font-semibold">Project Name</span>
            </div>
            <button className="text-xl font-bold" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div>
                <span>University: Greendale Community College</span>
            </div>
            <div>
                <span>Team Name: Greendale Human Being</span>
            </div>
            <div className="flex items-center justify-between">
                <span>Member 1 - Degree</span>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's email shows up now *wow*")}>
                    Email
                </button>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's resume shows up now *wow*")}>
                    View Resume
                </button>
            </div>
            <div className="flex items-center justify-between">
                <span>Member 2 - Degree</span>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's email shows up now *wow*")}>
                    Email
                </button>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's resume shows up now *wow*")}>
                    View Resume
                </button>
            </div>
            <div className="flex items-center justify-between">
                <span>Member 3 - Degree</span>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's email shows up now *wow*")}>
                    Email
                </button>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's resume shows up now *wow*")}>
                    View Resume
                </button>
            </div>
            <div className="flex items-center justify-between">
                <span>Member 4 - Degree</span>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's email shows up now *wow*")}>
                    Email
                </button>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's resume shows up now *wow*")}>
                    View Resume
                </button>
            </div>
            <div className="flex items-center justify-between">
                <span>Member 5 - Degree</span>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's email shows up now *wow*")}>
                    Email
                </button>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's resume shows up now *wow*")}>
                    View Resume
                </button>
            </div>
            <div className="flex items-center justify-between">
                <span>Member 6 - Degree</span>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's email shows up now *wow*")}>
                    Email
                </button>
                <button className="outline rounded-lg p-0.5" onClick={() => alert("Pretend that the person's resume shows up now *wow*")}>
                    View Resume
                </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamMenu;