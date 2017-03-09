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

### Bugs
- first line has 0 length
- gui does not update ([updateDisplay](https://workshop.chromeexperiments.com/examples/gui/#10--Updating-the-Display-Manually))

### Features
- UX/UI
  - mouse pan/zoom

- Rendering
  - WebGl 2 (more shader features)

- Geometry
  - arbitrary shapes (Square, Triangle, ...)
  - 3D:
    - tube with multiple stages
    - transform lines into quads in z direction
    - sphere interpretation
  - Josephus Problem

### Performance
- optimize use of BufferAttribute (internal gl calls, [discussion](https://github.com/mrdoob/three.js/pull/9631))

### Contributing
- Typings
    - Three (update to r82)
      - add BufferAttribute.setArray() to Type Definition
    - dat.gui
      - check propName with keyof
