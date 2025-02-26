
interface FileWithPreview extends File {
  preview?: string;
}

export const setupRoomChannel = (
  roomCode: string,
  peerId: string,
  onPeerUpdate: (peers: { id: string; lastSeen: number }[]) => void,
  onFilesReceived: (files: FileWithPreview[]) => void
) => {
  const channel = new BroadcastChannel(`room-${roomCode}`);
  
  channel.postMessage({ type: 'presence', peerId, timestamp: Date.now() });

  channel.onmessage = (event) => {
    const { type, peerId: remotePeerId, timestamp, files } = event.data;
    
    if (type === 'presence') {
      onPeerUpdate(current => {
        const updated = [...current];
        const existingPeerIndex = updated.findIndex(p => p.id === remotePeerId);
        
        if (existingPeerIndex >= 0) {
          updated[existingPeerIndex].lastSeen = timestamp;
        } else {
          updated.push({ id: remotePeerId, lastSeen: timestamp });
        }
        
        return updated;
      });

      channel.postMessage({ type: 'presence', peerId, timestamp: Date.now() });
    } else if (type === 'files') {
      onFilesReceived(files);
    }
  };

  const interval = setInterval(() => {
    channel.postMessage({ type: 'presence', peerId, timestamp: Date.now() });
  }, 5000);

  return () => {
    clearInterval(interval);
    channel.close();
  };
};

export const shareFiles = (roomCode: string, files: FileWithPreview[]) => {
  const channel = new BroadcastChannel(`room-${roomCode}`);
  channel.postMessage({ 
    type: 'files',
    files: files.map(file => ({
      ...file,
      preview: file.preview
    }))
  });
  channel.close();
};
