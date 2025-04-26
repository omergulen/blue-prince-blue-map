import React from 'react';
import { Room, Position } from '../types/room';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface RoomEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: Room | null;
  position: Position;
  onSave: (room: Room) => void;
}



const RoomEditor: React.FC<RoomEditorProps> = ({ open, onOpenChange, room, position, onSave }) => {
  const [name, setName] = React.useState(room?.name || '');
  const [keyWord, setKeyWord] = React.useState(room?.keyWord || '');
  const [keyLetter, setKeyLetter] = React.useState(room?.keyLetter || '');

  React.useEffect(() => {
    if (room) {
      setName(room.name || '');
      setKeyWord(room.keyWord || '');
      setKeyLetter(room.keyLetter || '');
    } else {
      setName('');
      setKeyWord('');
      setKeyLetter('');
    }
  }, [room]);
  
  const locationText = `at position (${position.row}, ${position.col})`;

  const handleSave = () => {
    const updatedRoom: Room = {
      id: room?.id || `room-${Date.now()}`,
      name,
      keyWord,
      keyLetter: keyLetter.charAt(0).toUpperCase(),
      position,
    };

    onSave(updatedRoom);
    onOpenChange(false);
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-gray-900 text-white border border-indigo-400">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {room ? 'Edit' : 'Add'} Room {locationText}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-base">Room Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter room name"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="keyWord" className="text-base">Key Word</Label>
            <Input
              id="keyWord"
              value={keyWord}
              onChange={(e) => setKeyWord(e.target.value)}
              placeholder="Enter keyword"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="keyLetter" className="text-base">Key Letter</Label>
            <Input
              id="keyLetter"
              value={keyLetter}
              onChange={(e) => setKeyLetter(e.target.value.charAt(0))}
              placeholder="A-Z"
              maxLength={1}
              className="bg-gray-800 border-gray-700 text-white text-center font-bold text-lg"
            />
            <div className="text-sm text-gray-400 mt-1">
              This letter will be displayed prominently in the room
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-500 text-gray-300">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomEditor;
