import React from "react";

interface trainingTrackerProps {
  active: number;
}

const trainingTracker: React.FC<trainingTrackerProps> = ({ active }) => {
  const levels = [0, 1, 2, 3];

  return (
    <div className="flex items-center space-x-4">
      {levels.map((level, index) => (
        <React.Fragment key={level}>
          <div
            className={`flex items-center justify-center w-16 h-16 rounded-full text-white font-bold ${
              active === level
                ? "bg-green-500"
                : active === level - 1
                ? "bg-yellow-500"
                : "bg-gray-400"
            }`}
          >
            {level}
          </div>
          {index < levels.length - 1 && (
            <div className="flex-grow h-[2px] bg-gray-300" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default trainingTracker;
