
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { generateRoomCode } from "@/lib/utils";
import QRCode from "qrcode";
import { RoomHeader } from "@/components/room/RoomHeader";
import { RoomJoin } from "@/components/room/RoomJoin";
import { FileUpload } from "@/components/room/FileUpload";
import { setupRoomChannel, shareFiles } from "@/services/roomService";

interface FileWithPreview extends File {
  preview?: string;
}

interface Peer {
  id: string;
  lastSeen: number;
}

const Index = () => {
  const [roomCode, setRoomCode] = useState("");
  const [inputRoomCode, setInputRoomCode] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [peers, setPeers] = useState<Peer[]>([]);
  const [peerId, setPeerId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    setPeerId(Math.random().toString(36).substr(2, 9));

    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      joinRoom(roomParam);
    }
  }, []);

  useEffect(() => {
    if (roomCode) {
      const cleanup = setupRoomChannel(
        roomCode,
        peerId,
        setPeers,
        handleReceivedFiles
      );

      return () => {
        cleanup();
      };
    }
  }, [roomCode, peerId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeers(current => 
        current.filter(peer => Date.now() - peer.lastSeen < 10000)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleReceivedFiles = (files: FileWithPreview[]) => {
    const newFiles = files.map(file => {
      if (file.preview) {
        const blob = dataURLtoBlob(file.preview);
        return {
          ...file,
          preview: URL.createObjectURL(blob)
        };
      }
      return file;
    });
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Files received",
      description: `${files.length} new file(s) shared to the room`,
    });
  };

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleFileSelection = (files: FileWithPreview[]) => {
    const newFiles = files.map(file => {
      if (file.type.startsWith('image/')) {
        file.preview = URL.createObjectURL(file);
      }
      return file;
    });
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    if (roomCode) {
      shareFiles(roomCode, newFiles);
    }

    toast({
      title: "Files selected",
      description: `${files.length} file(s) ready to share`,
    });
  };

  const generateQRCode = async (code: string) => {
    try {
      const url = await QRCode.toDataURL(`${window.location.origin}?room=${code}`);
      setQrCodeUrl(url);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
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

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <RoomHeader roomCode={roomCode} peerCount={peers.length + 1} />
        
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
            <RoomJoin
              inputRoomCode={inputRoomCode}
              onInputChange={setInputRoomCode}
              onCreateRoom={createRoom}
              onJoinRoom={joinRoom}
            />
          ) : (
            <FileUpload
              roomCode={roomCode}
              qrCodeUrl={qrCodeUrl}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelection}
              onRemoveFile={removeFile}
              onCopyRoomCode={copyRoomCode}
              onGenerateQRCode={generateQRCode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
