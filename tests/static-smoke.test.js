const assert = require('node:assert');
const fs = require('node:fs');

const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');
const mandelbrot = fs.readFileSync('mandelbrot.js', 'utf8');
const conway = fs.readFileSync('conway.js', 'utf8');

assert(html.includes('conway.js'), 'loads Conway script');
assert(html.includes('mandelbrot.js'), 'loads Mandelbrot script');
assert(!html.includes('mendelbrot.js'), 'does not load misspelled Mandelbrot script');

assert(mandelbrot.includes('class MandelbrotSimulation'), 'uses correctly spelled Mandelbrot class');
assert(!mandelbrot.includes('Mendelbrot'), 'does not contain misspelled Mandelbrot class name');

for (const handler of ['setup', 'draw', 'mousePressed', 'mouseDragged', 'mouseReleased', 'windowResized']) {
  assert(script.includes(`function ${handler}(`), `defines ${handler} handler`);
}

assert(script.includes('Copy Share URL'), 'adds share URL control');
assert(script.includes("url.searchParams.set('mode'"), 'share URL includes mode');
assert(script.includes("url.searchParams.set('seed'"), 'share URL includes seed');
assert(script.includes('applyPreset(params)'), 'applies URL preset params');
assert(mandelbrot.includes('getPreset()'), 'Mandelbrot exposes preset state');
assert(mandelbrot.includes('applyPreset(params)'), 'Mandelbrot accepts preset state');
assert(conway.includes('class ConwayGameOfLife'), 'Conway class exists');

console.log('static smoke tests passed');
