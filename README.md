- [✔] Reproduce seismic 3d style
- [✔] Hover/click interactions
  - [✔] mouseover follows swipe guestures on phone in an odd way.
  - [✔] create mesh for raycasting
    - Earcut for polygon from points: https://github.com/mapbox/earcut
    - Libtess for polygon from points: https://github.com/brendankenny/libtess.js
    - consider using threejs globe and rendering it alongside the other things: https://github.com/vasturiano/three-globe
    - hexed polygons might work too: https://vasturiano.github.io/three-globe/example/hexed-polygons/
- [✔] Remove CPU/GPU-intensive features on small screens
- [✔] Center on selected country
  - [ ] Centering on selected country creates a small "zoom in" effect because the
        camera doesn't arc around the globe but moves directly to the new position.
        Maybe the OrbitControls.dollyIn() / .dollyOut() can fix this?
- [✔] Clicks interfere with orbit controls (countries get selected as spinnign the globe)
- [ ] Rebuild in R3F
  - [ ] Env map
  - [ ] FakeGlowMaterial
  - [ ] Load GLB
  - [ ] Check if onPointer events for each mesh create multiple raycasts
- [✔] show country name on hover
- [ ] Plot points
- [ ] Arcs
- [ ] Bars extending outwards
- [✔] Better environment for reflections
  - [ ] Look at Seismic 3D to see how they did "stars"
- [ ] GUI for configuration
- [ ] Try different styles

# Credits

- Space env map is modified from this [milky way image](https://commons.wikimedia.org/wiki/File:ESO_-_Milky_Way.jpg)
- Uses [FakeGlowMaterial](https://github.com/ektogamat/fake-glow-material-threejs) from @ektogamat
- Inspired by [Seismic3D](https://shahnab.github.io/Seismic3D/)