# TimesTableWebGL
Interactive diagram of times tables as seen in [this video](https://www.youtube.com/watch?v=qhbuKbxJsk8) from Mathologer.

Written in Typescript, rendering with Three.js.

## [Live Demo](https://mathiaslengler.github.io/demos/TimesTableWebGL/index.html)

- requires browser that supports WebGL

## Building
- `npm install`
- `npm pack` to build once
- `npm start` to start development server

## Todo

### Bugs

- the first line has always 0 length
- move modified TypeScript definitions out of node_modules
- dat.gui ignores step setting and doesn't create sliders

### Functionality

- different coloring methods
- arbitrary shapes (Square, Triangle, ...)
- 3D:
    - tube with multiple stages
    - transform lines into quads in z direction
    - sphere interpretation
- Josephus Problem

### Performance

- benchmarking
- optimize use of BufferAttribute (internal gl calls, [discussion](https://github.com/mrdoob/three.js/pull/9631))

### Contributing

- add BufferAttribute.setArray() to Type Definition

