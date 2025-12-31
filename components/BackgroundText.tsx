"use client";

const BackgroundText: React.FC = () => {
  return (
    <div
      className="
        fixed inset-0 flex text-center items-center justify-center
        pointer-events-none select-none
        z-0
      "
    >
      <h1
        className="
          text-[18rem]/70 font-extrabold uppercase tracking-widest
          text-gray-600/10
          
        "
        
      >
        Pastebin lite
      </h1>
    </div>
  );
};

export default BackgroundText;
