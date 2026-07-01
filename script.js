let currentMode = 'conway'; // 'conway' or 'mandelbrot'
let toggleButton;
let shareButton;
let conwayGame;
let mandelbrotSim;
let currentSeed;

function getUrlParams() {
  return new URLSearchParams(window.location.search);
}

function numberParam(params, key, fallback) {
  const parsed = Number(params.get(key));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function setup() {
  const params = getUrlParams();
  currentMode = params.get('mode') === 'mandelbrot' ? 'mandelbrot' : 'conway';
  currentSeed = numberParam(params, 'seed', Math.floor(Math.random() * 1000000000));
  randomSeed(currentSeed);

  conwayGame = new ConwayGameOfLife();
  mandelbrotSim = new MandelbrotSimulation();

  createControls();
  setupCurrentMode(params);
}

function createControls() {
  toggleButton = createButton(currentMode === 'conway' ? 'Switch to Mandelbrot' : 'Switch to Conway');
  toggleButton.position(10, 10);
  toggleButton.mousePressed(toggleMode);
  styleButton(toggleButton, '#4CAF50');

  shareButton = createButton('Copy Share URL');
  shareButton.position(190, 10);
  shareButton.mousePressed(copyShareUrl);
  styleButton(shareButton, '#3b82f6');
}

function styleButton(button, backgroundColor) {
  button.style('background-color', backgroundColor);
  button.style('color', 'white');
  button.style('border', 'none');
  button.style('padding', '10px 20px');
  button.style('font-size', '16px');
  button.style('cursor', 'pointer');
}

function setupCurrentMode(params = getUrlParams()) {
  if (currentMode === 'conway') {
    randomSeed(currentSeed);
    conwayGame.setup();
  } else {
    mandelbrotSim.setup();
    mandelbrotSim.applyPreset(params);
  }
}

function draw() {
  if (currentMode === 'conway') {
    conwayGame.draw();
  } else {
    mandelbrotSim.draw();
  }
}

function doubleClicked() {
  if (currentMode === 'conway' && typeof conwayGame.doubleClicked === 'function') {
    conwayGame.doubleClicked();
  } else if (currentMode === 'mandelbrot' && typeof mandelbrotSim.doubleClicked === 'function') {
    mandelbrotSim.doubleClicked();
  }
}

function mousePressed() {
  if (currentMode === 'conway' && typeof conwayGame.mousePressed === 'function') {
    conwayGame.mousePressed();
  } else if (currentMode === 'mandelbrot' && typeof mandelbrotSim.mousePressed === 'function') {
    mandelbrotSim.mousePressed();
  }
}

function mouseDragged() {
  if (currentMode === 'conway' && typeof conwayGame.mouseDragged === 'function') {
    conwayGame.mouseDragged();
  } else if (currentMode === 'mandelbrot' && typeof mandelbrotSim.mouseDragged === 'function') {
    mandelbrotSim.mouseDragged();
  }
}

function mouseReleased() {
  if (currentMode === 'conway' && typeof conwayGame.mouseReleased === 'function') {
    conwayGame.mouseReleased();
  } else if (currentMode === 'mandelbrot' && typeof mandelbrotSim.mouseReleased === 'function') {
    mandelbrotSim.mouseReleased();
  }
}

function windowResized() {
  toggleButton.position(10, 10);
  shareButton.position(190, 10);

  if (currentMode === 'conway' && typeof conwayGame.windowResized === 'function') {
    conwayGame.windowResized();
  } else if (currentMode === 'mandelbrot' && typeof mandelbrotSim.windowResized === 'function') {
    mandelbrotSim.windowResized();
  }
}

function toggleMode() {
  removeElements();
  currentMode = currentMode === 'conway' ? 'mandelbrot' : 'conway';
  createControls();
  setupCurrentMode();
}

function currentShareUrl() {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('mode', currentMode);
  url.searchParams.set('seed', String(currentSeed));

  if (currentMode === 'mandelbrot') {
    for (const [key, value] of Object.entries(mandelbrotSim.getPreset())) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function copyShareUrl() {
  const shareUrl = currentShareUrl();
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(shareUrl);
    shareButton.html('Copied!');
    setTimeout(() => shareButton.html('Copy Share URL'), 1200);
  } else {
    window.prompt('Copy this URL', shareUrl);
  }
}
