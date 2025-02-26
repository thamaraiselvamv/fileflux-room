
import { Moon, Sun, Users } from "lucide-react";

interface RoomHeaderProps {
  roomCode: string;
  peerCount: number;
}

export const RoomHeader = ({ roomCode, peerCount }: RoomHeaderProps) => {
  return (
    <div className="flex justify-between mb-8">
      <div className="flex items-center gap-2">
        {roomCode && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{peerCount} users in room</span>
          </div>
        )}
      </div>
      <button 
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        onClick={() => document.documentElement.classList.toggle("dark")}
      >
        <Sun className="h-6 w-6 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      </button>
    </div>
  );
};
