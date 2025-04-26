export type LampColor = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'prismatic' | null;

export interface Position {
  row: number;
  col: number;
}

export interface Room {
  id: string;
  name: string;
  keyWord: string;
  keyLetter: string;
  position: Position;
  color: LampColor;
  doors: {
    north: boolean;
    east: boolean;
    south: boolean;
    west: boolean;
  };
}

export interface Hall {
  id: string;
  position: Position;
  direction: 'horizontal' | 'vertical';
  startIsWall: boolean; // true = wall, false = passage
  endIsWall: boolean; // true = wall, false = passage
  color: LampColor; // color of the lamp on this hall
}

export interface RoomMap {
  rooms: Room[];
  halls: Hall[];
  gridSize: {
    rows: number;
    cols: number;
  };
  name: string;
  createdAt: string;
  updatedAt: string;
}
