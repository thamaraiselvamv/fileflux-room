
interface RoomJoinProps {
  inputRoomCode: string;
  onInputChange: (value: string) => void;
  onCreateRoom: () => void;
  onJoinRoom: (code: string) => void;
}

export const RoomJoin = ({ inputRoomCode, onInputChange, onCreateRoom, onJoinRoom }: RoomJoinProps) => {
  return (
    <div className="space-y-6">
      <button
        onClick={onCreateRoom}
        className="w-full p-6 text-left glass glass-dark hover:opacity-90 transition-opacity"
      >
        <h2 className="text-xl font-semibold mb-2">Create a Room</h2>
        <p className="text-sm text-muted-foreground">
          Generate a unique room code and start sharing files securely.
        </p>
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or
          </span>
        </div>
      </div>

      <div className="glass glass-dark p-6">
        <h2 className="text-xl font-semibold mb-4">Join a Room</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter room code"
            value={inputRoomCode}
            onChange={(e) => onInputChange(e.target.value.toUpperCase())}
            className="flex-1 p-2 bg-background border rounded-md"
          />
          <button
            onClick={() => onJoinRoom(inputRoomCode)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};
