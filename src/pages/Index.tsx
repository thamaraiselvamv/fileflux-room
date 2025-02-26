import { useState, useEffect } from "react";
import { Moon, Sun, Upload, Copy, QrCode, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateRoomCode } from "@/lib/utils";
import QRCode from "qrcode";

interface FileWithPreview extends File {
  preview?: string;
}

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [inputRoomCode, setInputRoomCode] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      joinRoom(roomParam);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const generateQRCode = async (code: string) => {
    try {
      const url = await QRCode.toDataURL(`${window.location.origin}?room=${code}`);
      setQrCodeUrl(url);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

  const handleFileSelection = (files: FileWithPreview[]) => {
    const newFiles = files.map(file => {
      if (file.type.startsWith('image/')) {
        file.preview = URL.createObjectURL(file);
      }
      return file;
    });
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Files selected",
      description: `${files.length} file(s) ready to share`,
    });
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files) as FileWithPreview[];
    handleFileSelection(files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      toast({
        title: "Copied!",
        description: "Room code copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy room code",
        variant: "destructive",
      });
    }
  };

  const createRoom = () => {
    const code = generateRoomCode();
    setRoomCode(code);
    generateQRCode(code);
    window.history.pushState({}, '', `?room=${code}`);
    toast({
      title: "Room created!",
      description: `Your room code is: ${code}`,
    });
  };

  const joinRoom = (code: string) => {
    if (code.length === 0) {
      toast({
        title: "Error",
        description: "Please enter a room code",
        variant: "destructive",
      });
      return;
    }

    setRoomCode(code);
    generateQRCode(code);
    window.history.pushState({}, '', `?room=${code}`);
    toast({
      title: "Room joined!",
      description: `You've joined room: ${code}`,
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter room code"
                    value={inputRoomCode}
                    onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                    className="flex-1 p-2 bg-background border rounded-md"
                  />
                  <button
                    onClick={() => joinRoom(inputRoomCode)}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="glass glass-dark p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Room Code: {roomCode}</span>
                  <button
                    onClick={copyRoomCode}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => generateQRCode(roomCode)}
                    className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
                  >
                    <QrCode className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {qrCodeUrl && (
                <div className="glass glass-dark p-4 flex justify-center">
                  <img src={qrCodeUrl} alt="Room QR Code" className="w-32 h-32" />
                </div>
              )}

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
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your files here or click to browse
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    id="fileInput"
                    multiple
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        handleFileSelection(Array.from(e.target.files) as FileWithPreview[]);
                      }
                    }}
                  />
                  <label
                    htmlFor="fileInput"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    Select Files
                  </label>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                            {file.preview ? (
                              <img
                                src={file.preview}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <span className="text-xs text-center p-2 break-all">
                                  {file.name}
                                </span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
