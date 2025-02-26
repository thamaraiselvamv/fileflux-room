
import { Copy, QrCode, Upload, X } from "lucide-react";
import { useState } from "react";

interface FileWithPreview extends File {
  preview?: string;
}

interface FileUploadProps {
  roomCode: string;
  qrCodeUrl: string;
  selectedFiles: FileWithPreview[];
  onFileSelect: (files: FileWithPreview[]) => void;
  onRemoveFile: (index: number) => void;
  onCopyRoomCode: () => void;
  onGenerateQRCode: (code: string) => void;
}

export const FileUpload = ({
  roomCode,
  qrCodeUrl,
  selectedFiles,
  onFileSelect,
  onRemoveFile,
  onCopyRoomCode,
  onGenerateQRCode,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

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
    
    const files = Array.from(e.dataTransfer.files) as FileWithPreview[];
    onFileSelect(files);
  };

  return (
    <div className="space-y-4">
      <div className="glass glass-dark p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Room Code: {roomCode}</span>
          <button
            onClick={onCopyRoomCode}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => onGenerateQRCode(roomCode)}
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
                onFileSelect(Array.from(e.target.files) as FileWithPreview[]);
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
                    onClick={() => onRemoveFile(index)}
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
  );
};
