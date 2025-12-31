"use client";

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] 
        bg-pink-500 rounded-full blur-[180px] opacity-40" />

      <div className="absolute top-1/2 -right-40 w-[700px] h-[700px] 
        bg-blue-500 rounded-full blur-[200px] opacity-35" />

      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] 
        bg-purple-500 rounded-full blur-[180px] opacity-30" />
    </div>
  );
}
