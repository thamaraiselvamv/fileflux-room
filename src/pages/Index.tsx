
import { useState } from "react";
import { Moon, Sun, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateRoomCode } from "@/lib/utils";

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const { toast } = useToast();
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      // TODO: Implement file upload
      toast({
        title: "File received",
        description: `Ready to share: ${files[0].name}`,
      });
    }
  };

  const createRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    toast({
      title: "Room created!",
      description: `Your room code is: ${code}`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="flex justify-end mb-8">
          <button 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            onClick={() => document.documentElement.classList.toggle("dark")}
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </button>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Secure File Sharing
          </h1>
          <p className="text-lg text-muted-foreground">
            Share files instantly with anyone, anywhere.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!roomCode ? (
            <div className="space-y-6">
              <button
                onClick={createRoom}
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
                <input
                  type="text"
                  placeholder="Enter room code"
                  className="w-full p-2 bg-background border rounded-md"
                />
              </div>
            </div>
          ) : (
            <div
              className={`glass glass-dark p-8 transition-all duration-300 ${
                isDragging ? "border-primary border-2" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-primary animate-float" />
                <h2 className="text-xl font-semibold mb-2">
                  Room Code: {roomCode}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your file here or click to browse
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="fileInput"
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      // TODO: Implement file upload
                      toast({
                        title: "File selected",
                        description: `Ready to share: ${e.target.files[0].name}`,
                      });
                    }
                  }}
                />
                <label
                  htmlFor="fileInput"
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                >
                  Select File
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
