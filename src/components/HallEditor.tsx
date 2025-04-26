import React from 'react';
import { Hall, Position, LampColor } from '../types/room';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';

interface HallEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hall: Hall | null;
  position: Position;
  direction: 'horizontal' | 'vertical';
  onSave: (hall: Hall) => void;
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

const HallEditor: React.FC<HallEditorProps> = ({ 
  open, 
  onOpenChange, 
  hall, 
  position, 
  direction,
  onSave 
}) => {
  const [startIsWall, setStartIsWall] = React.useState(hall?.startIsWall ?? false);
  const [endIsWall, setEndIsWall] = React.useState(hall?.endIsWall ?? false);
  const [color, setColor] = React.useState<LampColor>(hall?.color || null);

  React.useEffect(() => {
    if (hall) {
      setStartIsWall(hall.startIsWall);
      setEndIsWall(hall.endIsWall);
      setColor(hall.color);
    } else {
      setStartIsWall(false);
      setEndIsWall(false);
      setColor(null);
    }
  }, [hall]);
  
  const locationText = `at position (${position.row}, ${position.col})`;
  const directionText = direction === 'horizontal' ? 'Horizontal' : 'Vertical';
  
  const startEndLabels = {
    horizontal: { start: 'Left', end: 'Right' },
    vertical: { start: 'Top', end: 'Bottom' }
  };

  const handleSave = () => {
    const updatedHall: Hall = {
      id: hall?.id || `hall-${Date.now()}`,
      position,
      direction,
      startIsWall,
      endIsWall,
      color,
    };

    onSave(updatedHall);
    onOpenChange(false);
  };

  const renderConnectionToggle = (
    label: string,
    isWall: boolean,
    onChange: (isWall: boolean) => void
  ) => {
    return (
      <div className="flex flex-col gap-2">
        <Label className="text-base">{label} Connection</Label>
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              id={`${label.toLowerCase()}-passage`}
              name={`${label.toLowerCase()}Type`}
              checked={!isWall}
              onChange={() => onChange(false)}
              className="mr-2 h-4 w-4"
            />
            <Label htmlFor={`${label.toLowerCase()}-passage`}>Passage (Open)</Label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id={`${label.toLowerCase()}-wall`}
              name={`${label.toLowerCase()}Type`}
              checked={isWall}
              onChange={() => onChange(true)}
              className="mr-2 h-4 w-4"
            />
            <Label htmlFor={`${label.toLowerCase()}-wall`}>Wall (Closed)</Label>
          </div>
        </div>
      </div>
    );
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

  const renderHallPreview = () => {
    const isHorizontal = direction === 'horizontal';
    
    return (
      <div className="flex items-center justify-center mt-4">
        <div className="relative bg-indigo-900 p-4 rounded border border-indigo-400" style={{ width: '180px', height: '80px' }}>
          <div className={`absolute ${isHorizontal ? 'w-full h-2 top-1/2 -translate-y-1/2' : 'h-full w-2 left-1/2 -translate-x-1/2'} flex items-center justify-center`}>
            {/* Hall */}
            <div className={`absolute ${isHorizontal ? 'w-full h-full' : 'h-full w-full'} bg-indigo-400/30`}></div>
            
            {/* Start wall */}
            <div 
              className={`absolute ${
                isHorizontal 
                  ? 'left-0 w-1/4 h-full' 
                  : 'top-0 h-1/4 w-full'
              } ${startIsWall ? 'bg-indigo-400' : 'bg-transparent'}`}
            ></div>
            
            {/* End wall */}
            <div 
              className={`absolute ${
                isHorizontal 
                  ? 'right-0 w-1/4 h-full' 
                  : 'bottom-0 h-1/4 w-full'
              } ${endIsWall ? 'bg-indigo-400' : 'bg-transparent'}`}
            ></div>
            
            {/* Lamp */}
            {color && (
              <div 
                className="absolute rounded-full w-4 h-4"
                style={{
                  backgroundColor: {
                    'red': '#ef4444',
                    'orange': '#f97316',
                    'yellow': '#eab308',
                    'green': '#22c55e',
                    'blue': '#3b82f6',
                    'purple': '#a855f7',
                    'pink': '#ec4899',
                  }[color as NonNullable<LampColor>] || 'transparent'
                }}
              ></div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 text-white border border-indigo-400">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {hall ? 'Edit' : 'Add'} {directionText} Hall {locationText}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="text-center text-sm text-gray-400 mb-2">
            Configure the connections at each end of this hall and its lamp color
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {renderConnectionToggle(startEndLabels[direction].start, startIsWall, setStartIsWall)}
            {renderConnectionToggle(startEndLabels[direction].end, endIsWall, setEndIsWall)}
          </div>
          
          {renderHallPreview()}
          
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

export default HallEditor;
