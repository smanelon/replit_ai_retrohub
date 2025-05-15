import React from "react";

export function KeyboardControlKey({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center h-8 min-w-8 px-2 bg-gray-900 border border-gray-700 rounded text-xs text-gray-300">
      {children}
    </div>
  );
}