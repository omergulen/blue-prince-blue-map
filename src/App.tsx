import { useState, useEffect } from 'react'
import { Room, Hall, RoomMap, Position, LampColor } from './types/room'

// Interface for backward compatibility with old room format
interface LegacyRoom extends Omit<Room, 'colors'> {
  color?: LampColor;
}
import RoomGrid from './components/RoomGrid'
import RoomEditor from './components/RoomEditor'
import HallEditor from './components/HallEditor'
import { Button } from './components/ui/button'
import { Toaster } from './components/ui/toaster'
import { useToast } from './components/ui/use-toast'
import { downloadJSON } from './lib/utils'

function App() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [halls, setHalls] = useState<Hall[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedHall, setSelectedHall] = useState<Hall | null>(null)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [selectedDirection, setSelectedDirection] = useState<'horizontal' | 'vertical'>('horizontal')
  const [roomEditorOpen, setRoomEditorOpen] = useState(false)
  const [hallEditorOpen, setHallEditorOpen] = useState(false)
  const [gridSize, setGridSize] = useState({ rows: 9, cols: 5 })
  const [mapName, setMapName] = useState('My Room Map')
  const { toast } = useToast()

  // Load map from localStorage on initial render
  useEffect(() => {
    const savedMap = localStorage.getItem('roomMap')
    if (savedMap) {
      try {
        const parsedMap: RoomMap = JSON.parse(savedMap)
        
        // Ensure all rooms have colors property and doors (for backward compatibility)
        const updatedRooms = parsedMap.rooms.map(room => ({
          ...room,
          // Convert old color property to colors array if needed
          colors: room.colors || ((room as LegacyRoom).color ? [(room as LegacyRoom).color] : []),
          doors: room.doors || {
            north: false,
            east: false,
            south: false,
            west: false
          }
        }))
        
        setRooms(updatedRooms)
        setHalls(parsedMap.halls || [])
        setGridSize(parsedMap.gridSize)
        setMapName(parsedMap.name)
        toast({
          title: 'Map Loaded',
          description: 'Your saved map has been loaded from local storage.',
        })
      } catch (error) {
        console.error('Error loading map:', error)
      }
    }
  }, [toast])

  const handleRoomClick = (room: Room | null, position: Position) => {
    setSelectedRoom(room)
    setSelectedPosition(position)
    setRoomEditorOpen(true)
  }

  const handleHallClick = (hall: Hall | null, position: Position, direction: 'horizontal' | 'vertical') => {
    setSelectedHall(hall)
    setSelectedPosition(position)
    setSelectedDirection(direction)
    setHallEditorOpen(true)
  }

  const handleSaveRoom = (room: Room) => {
    const updatedRooms = [...rooms.filter(r => r.id !== room.id), room]
    setRooms(updatedRooms)
    saveMapToLocalStorage(updatedRooms, halls)
  }

  const handleSaveHall = (hall: Hall) => {
    const updatedHalls = [...halls.filter(h => h.id !== hall.id), hall]
    setHalls(updatedHalls)
    saveMapToLocalStorage(rooms, updatedHalls)
  }

  const saveMapToLocalStorage = (
    updatedRooms: Room[] = rooms, 
    updatedHalls: Hall[] = halls
  ) => {
    const map: RoomMap = {
      rooms: updatedRooms,
      halls: updatedHalls,
      gridSize,
      name: mapName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem('roomMap', JSON.stringify(map))
  }

  const handleSaveMap = () => {
    saveMapToLocalStorage()
    toast({
      title: 'Map Saved',
      description: 'Your map has been saved to local storage.',
    })
  }

  const handleExportMap = () => {
    const map: RoomMap = {
      rooms,
      halls,
      gridSize,
      name: mapName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    downloadJSON(map, `${mapName.toLowerCase().replace(/\s+/g, '-')}.json`)
    toast({
      title: 'Map Exported',
      description: 'Your map has been exported as a JSON file.',
    })
  }

  const handleImportMap = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const map: RoomMap = JSON.parse(e.target?.result as string)
        
        // Ensure all rooms have colors property and doors (for backward compatibility)
        const updatedRooms = map.rooms.map(room => ({
          ...room,
          // Convert old color property to colors array if needed
          colors: room.colors || ((room as LegacyRoom).color ? [(room as LegacyRoom).color] : []),
          doors: room.doors || {
            north: false,
            east: false,
            south: false,
            west: false
          }
        }))
        
        setRooms(updatedRooms)
        setHalls(map.halls || [])
        setGridSize(map.gridSize)
        setMapName(map.name)
        saveMapToLocalStorage(updatedRooms, map.halls)
        toast({
          title: 'Map Imported',
          description: 'Your map has been imported successfully.',
        })
      } catch (error) {
        console.error('Error importing map:', error)
        toast({
          title: 'Import Error',
          description: 'There was an error importing your map.',
          variant: 'destructive',
        })
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const handleClearMap = () => {
    if (confirm('Are you sure you want to clear the map? This action cannot be undone.')) {
      setRooms([])
      setHalls([])
      localStorage.removeItem('roomMap')
      toast({
        title: 'Map Cleared',
        description: 'Your map has been cleared.',
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col items-center">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Blue Prince Back Rooms Mapper</h1>
        <div className="flex justify-center gap-4 mb-8">
          <Button 
            onClick={handleSaveMap}
            className="bg-transparent border border-white hover:bg-white/10"
          >
            <span className="mr-2">💾</span> Save Map
          </Button>
          <Button 
            onClick={handleExportMap}
            className="bg-transparent border border-white hover:bg-white/10"
          >
            <span className="mr-2">📎</span> Export Map
          </Button>
          <Button 
            onClick={() => document.getElementById('import-input')?.click()}
            className="bg-transparent border border-white hover:bg-white/10"
          >
            <span className="mr-2">📂</span> Import Map
          </Button>
          <Button 
            onClick={handleClearMap}
            className="bg-transparent border border-white hover:bg-white/10 text-red-300"
          >
            <span className="mr-2">🚫</span> Clear Map
          </Button>
          <input 
            id="import-input" 
            type="file" 
            accept=".json" 
            className="hidden" 
            onChange={handleImportMap} 
          />
        </div>
      </header>

      <main className="flex flex-col items-center w-full">
        <RoomGrid 
          rooms={rooms}
          halls={halls}
          gridSize={gridSize} 
          onRoomClick={handleRoomClick}
          onHallClick={handleHallClick}
        />
        <div className="mt-4 text-sm text-white/70">
          Click on any cell to add or edit room information (including room color)<br />
          Click on any hall to edit its properties (lamp color and wall/passage at each end)
        </div>
      </main>

      <RoomEditor 
        open={roomEditorOpen} 
        onOpenChange={setRoomEditorOpen} 
        room={selectedRoom} 
        position={selectedPosition || { row: 0, col: 0 }} 
        onSave={handleSaveRoom} 
      />
      
      <HallEditor
        open={hallEditorOpen}
        onOpenChange={setHallEditorOpen}
        hall={selectedHall}
        position={selectedPosition || { row: 0, col: 0 }}
        direction={selectedDirection}
        onSave={handleSaveHall}
      />
      
      <Toaster />
    </div>
  )
}

export default App
