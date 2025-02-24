"use client"; // This makes it a client component

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{ width: 150, height: 150, margin: "20px auto" }}>
      <CircularProgressbar
        value={progress}
        text={`${progress}%`}
        styles={buildStyles({
          textSize: "16px",
          pathColor: progress === 100 ? "#4CAF50" : "#FF3D00",
          textColor: "#000",
          trailColor: "#d6d6d6",
        })}
      />
    </div>
  );
}
