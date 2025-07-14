let currentMode = 'conway'; // 'conway' or 'mendelbrot'
let toggleButton;

function setup() {
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
    conwaySetup();
  } else {
    mendelSetup();
  }
}

function draw() {
  if (currentMode === 'conway') {
    conwayDraw();
  } else {
    mendelDraw();
  }
}

function mousePressed() {
  if (currentMode === 'conway') {
    conwayMousePressed();
  } else {
    mendelMousePressed();
  }
}

function mouseDragged() {
  if (currentMode === 'conway') {
    conwayMouseDragged();
  } else {
    mendelMouseDragged();
  }
}

function windowResized() {
  // Update button position
  toggleButton.position(10, 10);
  
  if (currentMode === 'conway') {
    conwayWindowResized();
  } else {
    mendelWindowResized();
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
    conwaySetup();
  } else {
    mendelSetup();
  }
}