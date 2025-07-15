
let currentMode = 'conway'; // 'conway' or 'mendelbrot'
let toggleButton;
let conwayGame;
let mendelbrotSim;

function setup() {
  // Create class instances
  conwayGame = new ConwayGameOfLife();
  mendelbrotSim = new MendelbrotSimulation();

  // Create toggle button
  toggleButton = createButton('Switch to Mendelbrot');
  toggleButton.position(10, 10);
  toggleButton.mousePressed(toggleMode);
  toggleButton.style('background-color', '#4CAF50');
  toggleButton.style('color', 'white');
  toggleButton.style('border', 'none');
  toggleButton.style('padding', '10px 20px');
  toggleButton.style('font-size', '16px');
  toggleButton.style('cursor', 'pointer');

  if (currentMode === 'conway') {
    conwayGame.setup();
  } else {
    mendelbrotSim.setup();
  }
}

function draw() {
  if (currentMode === 'conway') {
    conwayGame.draw();
  } else {
    mendelbrotSim.draw();
  }
}

function doubleClicked() {
  if (currentMode === 'conway') {
    conwayGame.doubleClicked();
  } else {
    mendelbrotSim.doubleClicked();
  }
}

function mousePressed() {
  if (currentMode === 'conway') {
    conwayGame.mousePressed();
  } else {
    mendelbrotSim.mousePressed();
  }
}

function mouseDragged() {
  if (currentMode === 'conway') {
    conwayGame.mouseDragged();
  } else {
    mendelbrotSim.mouseDragged();
  }
}

function mouseReleased() {
  if (currentMode === 'conway' && typeof conwayGame.mouseReleased === 'function') {
    conwayGame.mouseReleased();
  } else {
    mendelbrotSim.mouseReleased();
  }
}

function windowResized() {
  // Update button position
  toggleButton.position(10, 10);

  if (currentMode === 'conway') {
    conwayGame.windowResized();
  } else {
    mendelbrotSim.windowResized();
  }
}

function toggleMode() {
  // Clear existing elements
  removeElements();

  // Switch mode
  if (currentMode === 'conway') {
    currentMode = 'mendelbrot';
    toggleButton = createButton('Switch to Conway');
  } else {
    currentMode = 'conway';
    toggleButton = createButton('Switch to Mendelbrot');
  }

  // Style the new button
  toggleButton.position(10, 10);
  toggleButton.mousePressed(toggleMode);
  toggleButton.style('background-color', '#4CAF50');
  toggleButton.style('color', 'white');
  toggleButton.style('border', 'none');
  toggleButton.style('padding', '10px 20px');
  toggleButton.style('font-size', '16px');
  toggleButton.style('cursor', 'pointer');

  // Setup the new mode
  if (currentMode === 'conway') {
    conwayGame.setup();
  } else {
    mendelbrotSim.setup();
  }
}
