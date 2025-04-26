# Blue Prince Back Rooms Mapper

A web application for tracking room mapping progress with colored lamps, key words, and key letters. This application is inspired by the reference at [room-glow-mapper.lovable.app](https://room-glow-mapper.lovable.app/).

## Features

- Create a grid-based map of rooms
- Add details to each room:
  - Room name
  - Key word
  - Key letter
  - Colored lamps on each side (north, east, south, west)
- Save your progress to local storage
- Export your map as a JSON file
- Import previously saved maps

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

## Getting Started
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
