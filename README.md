# zhach-gol

Zhach's Conway Game of Life and Mandelbrot visualizer.

## Run

Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Modes and controls

- Conway: draw cells with click/drag, adjust FPS/rules, pause, step, clear, or randomize.
- Mandelbrot: double-click to zoom, reset the view, and adjust X/Y ranges or iterations.
- Use **Switch to Mandelbrot/Conway** to swap modes.
- Use **Copy Share URL** to save the current mode/preset.

Deployment URL: <http://localhost:8000> for local static serving.

## Scope

Small Conway/Mandelbrot playground. Prioritize stability, controls, and shareable presets before adding new simulations.

## Shareable presets

The app reads URL parameters for reproducible views:

- `mode=conway|mandelbrot`
- `seed=<number>` for Conway's initial random grid
- Mandelbrot view params: `xMin`, `xMax`, `yMin`, `yMax`, `iter`

Use the **Copy Share URL** button to copy the current mode/preset.

## Tests

```bash
npm test
```
