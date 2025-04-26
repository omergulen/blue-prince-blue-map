import React from 'react';
import { Hall, Position, LampColor } from '../types/room';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

interface WallEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wall: Hall | null;
  position: Position;
  direction: 'horizontal' | 'vertical';
  onSave: (wall: Hall) => void;
}

const colorOptions: { value: LampColor; label: string }[] = [
  { value: null, label: 'None' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
];

const WallEditor: React.FC<WallEditorProps> = ({ 
  open, 
  onOpenChange, 
  wall, 
  position, 
  direction,
  onSave 
}) => {
  const [startIsWall, setStartIsWall] = React.useState(wall?.startIsWall ?? false);
  const [endIsWall, setEndIsWall] = React.useState(wall?.endIsWall ?? false);
  const [color, setColor] = React.useState<LampColor>(wall?.color || null);

  React.useEffect(() => {
    if (wall) {
      setStartIsWall(wall.startIsWall);
      setEndIsWall(wall.endIsWall);
      setColor(wall.color);
    } else {
      setStartIsWall(false);
      setEndIsWall(false);
      setColor(null);
    }
  }, [wall]);
  
  const locationText = `at position (${position.row}, ${position.col})`;
  const directionText = direction === 'horizontal' ? 'Horizontal' : 'Vertical';

  const handleSave = () => {
    const updatedWall: Hall = {
      id: wall?.id || `hall-${Date.now()}`,
      position,
      direction,
      startIsWall,
      endIsWall,
      color,
    };

    onSave(updatedWall);
    onOpenChange(false);
  };

  const renderColorSelector = () => {
    return (
      <div className="space-y-3">
        <Label className="text-base">Lamp Color</Label>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption.label}
              type="button"
              className={`w-10 h-10 rounded-full border-2 ${
                color === colorOption.value ? 'border-white shadow-md' : 'border-gray-400'
              } ${
                colorOption.value
                  ? `bg-${colorOption.value}-${colorOption.value === 'yellow' ? '300' : '500'}`
                  : 'bg-gray-200'
              }`}
              style={{
                backgroundColor: colorOption.value 
                  ? {
                      'red': '#ef4444',
                      'orange': '#f97316',
                      'yellow': '#eab308',
                      'green': '#22c55e',
                      'blue': '#3b82f6',
                      'purple': '#a855f7',
                      'pink': '#ec4899',
                    }[colorOption.value as NonNullable<LampColor>] 
                  : '#e5e7eb'
              }}
              onClick={() => setColor(colorOption.value)}
              title={colorOption.label}
            />
          ))}
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {color ? `Selected color: ${colorOptions.find(opt => opt.value === color)?.label || 'None'}` : 'No color selected'}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-gray-900 text-white border border-indigo-400">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {wall ? 'Edit' : 'Add'} {directionText} {startIsWall && endIsWall ? 'Hall' : 'Passage'} {locationText}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <Label className="text-base">{direction === 'horizontal' ? 'Left' : 'Top'} Connection</Label>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="start-passage"
                    name="startType"
                    checked={!startIsWall}
                    onChange={() => setStartIsWall(false)}
                    className="mr-2 h-4 w-4"
                  />
                  <Label htmlFor="start-passage">Passage (Open)</Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="start-wall"
                    name="startType"
                    checked={startIsWall}
                    onChange={() => setStartIsWall(true)}
                    className="mr-2 h-4 w-4"
                  />
                  <Label htmlFor="start-wall">Wall (Closed)</Label>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label className="text-base">{direction === 'horizontal' ? 'Right' : 'Bottom'} Connection</Label>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="end-passage"
                    name="endType"
                    checked={!endIsWall}
                    onChange={() => setEndIsWall(false)}
                    className="mr-2 h-4 w-4"
                  />
                  <Label htmlFor="end-passage">Passage (Open)</Label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="end-wall"
                    name="endType"
                    checked={endIsWall}
                    onChange={() => setEndIsWall(true)}
                    className="mr-2 h-4 w-4"
                  />
                  <Label htmlFor="end-wall">Wall (Closed)</Label>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400 text-center">
            {startIsWall && endIsWall ? 'Hall blocks movement between rooms' : 'Passage allows movement between rooms'}
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

export default WallEditor;
