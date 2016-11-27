# TimesTableWebGL
Interactive diagram of times tables as seen in [this video](https://www.youtube.com/watch?v=qhbuKbxJsk8) from Mathologer.

Written in Typescript, rendering with Three.js.

## [Live Demo](https://mathiaslengler.github.io/demos/TimesTableWebGL/index.html)

requires browser that supports WebGL

## Building
- `npm install`
- `npm pack` to build once
- `npm start` to start development server

## Todo

### Bugs

- the first line has always 0 length

### Functionality

- slow animate
- GUI
    - multiplierIncrement x^3 slider
    - opacity x^2 slider/gamma slider
- coloring methods
- winston logging
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

- Typings
    - Three (update to r82)
        - add BufferAttribute.setArray() to Type Definition
