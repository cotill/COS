import React from 'react';

interface HeadingbarProps {
  text: string;
}

const Headingbar: React.FC<HeadingbarProps> = ({ text }) => {
  return (
    <div className="relative w-full h-32 overflow-hidden rounded-xl bg-black flex items-center">
      <div className="absolute left-0 top-0 w-3/4 h-full bg-gradient-to-r from-green-500 to-transparent flex items-center">
        <p className="text-white text-lg font-semibold ml-6">{text}</p>
      </div>

      <div className="absolute right-0 top-0 w-1/2 h-full">
        <video
          className="w-full h-full object-cover"
          src="/TTG_Video.mov"
          autoPlay
          loop
          muted
        />
      </div>
    </div>
  );
};

export default Headingbar;
