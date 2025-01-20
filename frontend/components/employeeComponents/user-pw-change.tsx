"use client"

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ChangePasswordProps {
  handleConfirm: (newPassword: string, confirmPassword: string) => void;
}

const ChangePassword = ({handleConfirm}: ChangePasswordProps) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  
  const toggleVisibility = () => setIsVisible(prevState => !prevState);

  const handleCancel = () => {
      setNewPassword("");
      setConfirmPassword("");
      console.log("textboxes cleaned")
    };

  return (
    <div className="p-4 text-white justify-center">
      <h2 className="text-lg font-semibold underline mb-2">Change Password</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

        {/* New Password */}
        <div className="relative flex flex-col">
          <label htmlFor="new-password" className="font-medium">
            New Password
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={isVisible ? "text" : "password"}
              className="border border-gray-300 rounded px-4 py-2 text-black w-full pr-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className="absolute inset-y-0 right-0 flex items-center px-3 text-black focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
            >
              {isVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative flex flex-col">
          <label htmlFor="confirm-password" className="font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={isVisible ? "text" : "password"}
              className="border border-gray-300 rounded px-4 py-2 text-black w-full pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="absolute inset-y-0 right-0 flex items-center px-3 text-black focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label={isVisible ? "Hide password" : "Show password"}
            >
              {isVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Cancel/Confirm buttons */}
      <div className="flex justify-between items-center mt-6 px-4">
        <button
          className="bg-red-600 text-white px-8 py-2 mb-6 rounded hover:bg-red-600"
          type="button"
          onClick={() => handleCancel}
        >
          Cancel
        </button>
        <button
          className="bg-green-600 text-white px-8 py-2 mb-6 rounded hover:bg-green-600"
          type="button"
          onClick={() => handleConfirm(newPassword, confirmPassword)}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
