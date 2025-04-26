import React from 'react';
import { Room, Hall, Position, LampColor } from '../types/room';
import { cn } from '../lib/utils';

interface RoomGridProps {
  rooms: Room[];
  halls: Hall[];
  gridSize: { rows: number; cols: number; };
  onRoomClick: (room: Room | null, position: Position) => void;
  onHallClick: (hall: Hall | null, position: Position, direction: 'horizontal' | 'vertical') => void;
}

const RoomGrid: React.FC<RoomGridProps> = ({ rooms, halls, gridSize, onRoomClick, onHallClick }) => {
  const getRoom = (row: number, col: number): Room | null => {
    return rooms.find(room => room.position.row === row && room.position.col === col) || null;
  };

  const getHall = (row: number, col: number, direction: 'horizontal' | 'vertical'): Hall | null => {
    return halls.find(hall => 
      hall.position.row === row && 
      hall.position.col === col && 
      hall.direction === direction
    ) || null;
  };
  
  const getHallColor = (hall: Hall | null): string => {
    if (!hall || !hall.color) return '';
    
    if (hall.color === 'prismatic') {
      return 'bg-gradient-to-r from-red-500 via-blue-500 to-green-500';
    }
    
    const colorMap: Record<Exclude<NonNullable<LampColor>, 'prismatic'>, string> = {
      'red': 'bg-red-500',
      'orange': 'bg-orange-500',
      'yellow': 'bg-yellow-500', // Fixed yellow to be brighter
      'green': 'bg-green-500',
      'blue': 'bg-blue-500',
      'purple': 'bg-purple-500',
      'pink': 'bg-pink-500',
    };
    
    return colorMap[hall.color as Exclude<NonNullable<LampColor>, 'prismatic'>];
  };

  const getRoomColorClass = (room: Room | null) => {
    if (!room || !room.colors || room.colors.length === 0) return 'bg-indigo-800/80 border-indigo-600/50';
    
    // If there's only one color
    if (room.colors.length === 1) {
      const color = room.colors[0];
      if (color === 'prismatic') {
        return 'bg-gradient-to-r from-red-500 via-blue-500 to-green-500 border-white/50';
      }
      
      const colorMap = {
        'red': 'bg-red-500/30 border-red-500',
        'orange': 'bg-orange-500/30 border-orange-500',
        'yellow': 'bg-yellow-300/30 border-yellow-300',
        'green': 'bg-green-500/30 border-green-500',
        'blue': 'bg-blue-500/30 border-blue-500',
        'purple': 'bg-purple-500/30 border-purple-500',
        'pink': 'bg-pink-500/30 border-pink-500',
        'null': 'bg-indigo-800/80 border-indigo-600/50'
      } as Record<string, string>;
      
      return colorMap[color as Exclude<NonNullable<LampColor>, 'prismatic'>];
    }
    
    // If there are multiple colors, return a special class
    return 'bg-indigo-800/80 border-indigo-600/50'; // We'll handle multiple colors with inline styles
  };


  const renderCell = (row: number, col: number) => {
    const room = getRoom(row, col);
    const roomColorClass = getRoomColorClass(room);
    
    return (
      <div
        className={cn(
          'relative border-2',
          roomColorClass,
          'flex flex-col items-center justify-center p-2 cursor-pointer',
          'aspect-square text-center text-white w-full h-full'
        )}
        style={{
          width: '120px', 
          height: '120px',
          background: room?.colors && room.colors.length > 1 
            ? `linear-gradient(135deg, ${room.colors.map(color => {
                if (color === 'prismatic') return 'linear-gradient(to right, #ef4444, #3b82f6, #22c55e)';
                return color ? {
                  'red': '#ef444480',
                  'orange': '#f9731680',
                  'yellow': '#eab30880',
                  'green': '#22c55e80',
                  'blue': '#3b82f680',
                  'purple': '#a855f780',
                  'pink': '#ec489980',
                  'null': '#e5e7eb80'
                }[color as string] : '#e5e7eb80';
              }).join(', ')})`
            : undefined
        }}
        onClick={() => onRoomClick(room, { row, col })}
      >
        {room && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
            <div className="text-2xl font-bold text-white">{room.keyLetter}</div>
            <div className="text-xs text-white/80 mt-1 text-center">{room.name}</div>
            {room.keyWord && (
              <div className="text-xs text-white/60 mt-1">({room.keyWord})</div>
            )}
            {room.colors && room.colors.length > 0 && (
              <div className="absolute bottom-1 right-1 flex space-x-1">
                {room.colors.map((color, index) => (
                  <div 
                    key={`${color}-${index}`}
                    className={`w-3 h-3 rounded-full`}
                    style={{
                      background: color === 'prismatic'
                        ? 'linear-gradient(to right, #ef4444, #3b82f6, #22c55e)'
                        : color
                          ? {
                              'red': '#ef4444',
                              'orange': '#f97316',
                              'yellow': '#eab308',
                              'green': '#22c55e',
                              'blue': '#3b82f6',
                              'purple': '#a855f7',
                              'pink': '#ec4899',
                              'null': '#e5e7eb'
                            }[color as Exclude<NonNullable<LampColor>, 'prismatic'>] 
                          : '#e5e7eb'
                    }}
                  />
                ))}
              </div>
            )}
            
            {/* Door indicators */}
            {room.doors?.north && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-gray-600 border border-gray-400" />
            )}
            {room.doors?.east && (
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-gray-600 border border-gray-400" />
            )}
            {room.doors?.south && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-gray-600 border border-gray-400" />
            )}
            {room.doors?.west && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-gray-600 border border-gray-400" />
            )}
          </div>
        )}
      </div>
    );
  };

  const renderHorizontalHall = (row: number, col: number) => {
    const hall = getHall(row, col, 'horizontal');
    const colorClass = hall?.color ? getHallColor(hall) : '';
    
    return (
      <div 
        className="absolute top-0 left-0 w-full h-2 flex items-center justify-center cursor-pointer bg-indigo-400/30"
        onClick={() => onHallClick(hall, { row, col }, 'horizontal')}
      >
        {/* Left side wall/passage */}
        {hall?.startIsWall && (
          <div className="absolute left-0 w-1/3 h-full bg-indigo-400"></div>
        )}
        
        {/* Right side wall/passage */}
        {hall?.endIsWall && (
          <div className="absolute right-0 w-1/3 h-full bg-indigo-400"></div>
        )}
        
        {/* Lamp */}
        {hall?.color && (
          <div className={`absolute w-3 h-3 rounded-full ${colorClass}`}></div>
        )}
      </div>
    );
  };

  const renderVerticalHall = (row: number, col: number) => {
    const hall = getHall(row, col, 'vertical');
    const colorClass = hall?.color ? getHallColor(hall) : '';
    
    return (
      <div 
        className="absolute top-0 left-0 h-full w-2 flex items-center justify-center cursor-pointer bg-indigo-400/30"
        onClick={() => onHallClick(hall, { row, col }, 'vertical')}
      >
        {/* Top side wall/passage */}
        {hall?.startIsWall && (
          <div className="absolute top-0 h-1/3 w-full bg-indigo-400"></div>
        )}
        
        {/* Bottom side wall/passage */}
        {hall?.endIsWall && (
          <div className="absolute bottom-0 h-1/3 w-full bg-indigo-400"></div>
        )}
        
        {/* Lamp */}
        {hall?.color && (
          <div className={`absolute w-3 h-3 rounded-full ${colorClass}`}></div>
        )}
      </div>
    );
  };

  return (
    <div className="grid gap-0 bg-indigo-900 p-6 rounded-lg shadow-lg border border-indigo-400">
      <div className="grid grid-cols-1 gap-0 relative">
        {/* Top edge halls */}
        <div className="absolute top-0 left-0 right-0 flex z-10" style={{ transform: 'translateY(-50%)' }}>
          {Array.from({ length: gridSize.cols }).map((_, colIndex) => (
            <div 
              key={`top-hall-${colIndex}`} 
              className="relative" 
              style={{ width: '120px', height: '2px' }}
            >
              {renderHorizontalHall(0, colIndex)}
            </div>
          ))}
        </div>

        {/* Left edge halls */}
        <div className="absolute top-0 bottom-0 left-0 flex flex-col z-10" style={{ transform: 'translateX(-50%)' }}>
          {Array.from({ length: gridSize.rows }).map((_, rowIndex) => (
            <div 
              key={`left-hall-${rowIndex}`} 
              className="relative" 
              style={{ width: '2px', height: '120px' }}
            >
              {renderVerticalHall(rowIndex, 0)}
            </div>
          ))}
        </div>

        {/* Main grid */}
        {Array.from({ length: gridSize.rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex">
            {Array.from({ length: gridSize.cols }).map((_, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} className="relative">
                {/* Room cell */}
                {renderCell(rowIndex, colIndex)}
                
                {/* Horizontal hall (bottom) */}
                {rowIndex < gridSize.rows - 1 && (
                  <div className="absolute bottom-0 left-0 w-full h-2 translate-y-1/2 z-10">
                    {renderHorizontalHall(rowIndex + 1, colIndex)}
                  </div>
                )}
                
                {/* Vertical hall (right) */}
                {colIndex < gridSize.cols - 1 && (
                  <div className="absolute top-0 right-0 h-full w-2 translate-x-1/2 z-10">
                    {renderVerticalHall(rowIndex, colIndex + 1)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Right edge halls */}
        <div className="absolute top-0 bottom-0 right-0 flex flex-col z-10" style={{ transform: 'translateX(50%)' }}>
          {Array.from({ length: gridSize.rows }).map((_, rowIndex) => (
            <div 
              key={`right-hall-${rowIndex}`} 
              className="relative" 
              style={{ width: '2px', height: '120px' }}
            >
              {renderVerticalHall(rowIndex, gridSize.cols)}
            </div>
          ))}
        </div>

        {/* Bottom edge halls */}
        <div className="absolute bottom-0 left-0 right-0 flex z-10" style={{ transform: 'translateY(50%)' }}>
          {Array.from({ length: gridSize.cols }).map((_, colIndex) => (
            <div 
              key={`bottom-hall-${colIndex}`} 
              className="relative" 
              style={{ width: '120px', height: '2px' }}
            >
              {renderHorizontalHall(gridSize.rows, colIndex)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomGrid;
