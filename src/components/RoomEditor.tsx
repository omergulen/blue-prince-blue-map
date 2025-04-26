import React from 'react';
import { Room, Position, LampColor } from '../types/room';
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
  const [color, setColor] = React.useState<LampColor>(room?.color || null);

  React.useEffect(() => {
    if (room) {
      setName(room.name || '');
      setKeyWord(room.keyWord || '');
      setKeyLetter(room.keyLetter || '');
      setColor(room.color || null);
    } else {
      setName('');
      setKeyWord('');
      setKeyLetter('');
      setColor(null);
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
      color,
    };

    onSave(updatedRoom);
    onOpenChange(false);
  };
  
  const colorOptions: { value: LampColor; label: string }[] = [
    { value: null, label: 'None' },
    { value: 'red', label: 'Red' },
    { value: 'orange', label: 'Orange' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'pink', label: 'Pink' },
    { value: 'prismatic', label: 'Prismatic' },
  ];
  
  const renderColorSelector = () => {
    return (
      <div className="grid gap-2">
        <Label className="text-base">Room Color</Label>
        <div className="grid grid-cols-4 gap-2">
          {colorOptions.map((option) => (
            <div
              key={option.label}
              className={`
                flex flex-col items-center justify-center p-2 rounded-md cursor-pointer
                ${color === option.value ? 'ring-2 ring-white' : 'ring-1 ring-gray-600'}
                ${option.value ? `bg-${option.value}-500/20` : 'bg-gray-700'}
              `}
              onClick={() => setColor(option.value)}
            >
              <div 
                className={`w-6 h-6 rounded-full mb-1 ${option.value === 'prismatic' ? 'bg-gradient-to-r from-red-500 via-blue-500 to-green-500' : option.value ? `bg-${option.value}-500` : 'bg-gray-500'}`}
              />
              <span className="text-xs">{option.label}</span>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          This color will be used to highlight the room
        </div>
      </div>
    );
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
          {renderColorSelector()}
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
