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
    
    const colorMap: Record<NonNullable<LampColor>, string> = {
      'red': 'bg-red-500',
      'orange': 'bg-orange-500',
      'yellow': 'bg-yellow-300',
      'green': 'bg-green-500',
      'blue': 'bg-blue-500',
      'purple': 'bg-purple-500',
      'pink': 'bg-pink-500',
    };
    
    return colorMap[hall.color];
  };

  const renderCell = (row: number, col: number) => {
    const room = getRoom(row, col);
    return (
      <div
        className={cn(
          'relative bg-indigo-800/80 border border-indigo-600/50',
          'flex flex-col items-center justify-center p-2 cursor-pointer',
          'aspect-square text-center text-white w-full h-full'
        )}
        style={{ width: '120px', height: '120px' }}
        onClick={() => onRoomClick(room, { row, col })}
      >
        {room && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
            <div className="text-2xl font-bold text-white">{room.keyLetter}</div>
            <div className="text-xs text-white/80 mt-1 text-center">{room.name}</div>
            {room.keyWord && (
              <div className="text-xs text-white/60 mt-1">({room.keyWord})</div>
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
