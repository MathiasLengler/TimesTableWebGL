# TimesTableWebGL
Interactive diagram of times tables as seen in [this video](https://www.youtube.com/watch?v=qhbuKbxJsk8) from Mathologer.

Written in Typescript, rendering with Three.js.

## [Live Demo](https://mathiaslengler.github.io/TimesTableWebGL/)

requires browser that supports WebGL

## Development
- `npm install`
- `npm start`

## Todo

### Dependencies
- update to typescript 2.2 when intellij supports it

### Features
- UX/UI
  - replace dat.gui with react/react-toolbox
  - responsive
  - touch support
  
- Rendering
  - WebGl 2

- Geometry
  - arbitrary shapes (Square, Triangle, ...)
  - 3D:
    - tube with multiple stages
    - transform lines into quads in z direction
    - sphere interpretation
  - Josephus Problem

### Contributing
- Typings
    - Three (update to r82)
      - add BufferAttribute.setArray() to Type Definition
    - dat.gui
      - check propName with keyof
