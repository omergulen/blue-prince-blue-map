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
  const [selectedColors, setSelectedColors] = React.useState<LampColor[]>(room?.colors || []);
  const [doors, setDoors] = React.useState({
    north: room?.doors?.north || false,
    east: room?.doors?.east || false,
    south: room?.doors?.south || false,
    west: room?.doors?.west || false
  });

  React.useEffect(() => {
    if (room) {
      setName(room.name || '');
      setKeyWord(room.keyWord || '');
      setKeyLetter(room.keyLetter || '');
      setSelectedColors(room.colors || []);
      setDoors({
        north: room.doors?.north || false,
        east: room.doors?.east || false,
        south: room.doors?.south || false,
        west: room.doors?.west || false
      });
    } else {
      setName('');
      setKeyWord('');
      setKeyLetter('');
      setSelectedColors([]);
      setDoors({
        north: false,
        east: false,
        south: false,
        west: false
      });
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
      colors: selectedColors,
      doors,
    };

    onSave(updatedRoom);
    onOpenChange(false);
  };
  
  const toggleDoor = (direction: 'north' | 'east' | 'south' | 'west') => {
    setDoors(prev => ({
      ...prev,
      [direction]: !prev[direction]
    }));
  };
  
  const toggleColor = (colorValue: LampColor) => {
    setSelectedColors(prev => {
      // If color is already selected, remove it
      if (prev.includes(colorValue)) {
        return prev.filter(c => c !== colorValue);
      }
      // Otherwise add it
      return [...prev, colorValue];
    });
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
      <div className="space-y-3">
        <Label className="text-base">Lamp Colors (select multiple)</Label>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption.label}
              type="button"
              className={`w-10 h-10 rounded-full border-2 ${
                selectedColors.includes(colorOption.value) ? 'border-white shadow-md' : 'border-gray-400'
              } ${
                colorOption.value
                  ? `bg-${colorOption.value}-${colorOption.value === 'yellow' ? '300' : '500'}`
                  : 'bg-gray-200'
              }`}
              style={{
                background: colorOption.value === 'prismatic'
                  ? 'linear-gradient(to right, #ef4444, #3b82f6, #22c55e)'
                  : colorOption.value
                    ? {
                        'red': '#ef4444',
                        'orange': '#f97316',
                        'yellow': '#eab308',
                        'green': '#22c55e',
                        'blue': '#3b82f6',
                        'purple': '#a855f7',
                        'pink': '#ec4899',
                      }[colorOption.value as Exclude<NonNullable<LampColor>, 'prismatic'>] 
                    : '#e5e7eb'
              }}
              onClick={() => toggleColor(colorOption.value)}
              title={colorOption.label}
            />
          ))}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {selectedColors.length > 0 
            ? `Selected colors: ${selectedColors.map(c => colorOptions.find(opt => opt.value === c)?.label).join(', ')}` 
            : 'No colors selected'}
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
          
          <div className="grid gap-2">
            <Label className="text-base">Doors</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="door-north"
                  checked={doors.north}
                  onChange={() => toggleDoor('north')}
                  className="mr-2 h-4 w-4"
                />
                <Label htmlFor="door-north">North Door</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="door-east"
                  checked={doors.east}
                  onChange={() => toggleDoor('east')}
                  className="mr-2 h-4 w-4"
                />
                <Label htmlFor="door-east">East Door</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="door-south"
                  checked={doors.south}
                  onChange={() => toggleDoor('south')}
                  className="mr-2 h-4 w-4"
                />
                <Label htmlFor="door-south">South Door</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="door-west"
                  checked={doors.west}
                  onChange={() => toggleDoor('west')}
                  className="mr-2 h-4 w-4"
                />
                <Label htmlFor="door-west">West Door</Label>
              </div>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              Select which sides of the room have doors
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
