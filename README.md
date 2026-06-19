# zhach-gol

Zhach's Conway Game of Life and Mandelbrot visualizer.

## Run

Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

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
