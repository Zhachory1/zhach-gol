let grid;
let cols;
let rows;
let resolution = 10; // Size of each cell

let frSlider; // Declare the slider variable
let frLabel;

// Slider to control the threshold for cells to become alive based on their number of neighbors
let rebirthSlider;
let rebirthLabel;
let rebirthStr = 'Rebirth Threshold: ';

// Slider to control the threshold to kill cells due to under population
let underPopSlider;
let underPopLabel;
let underPopStr = 'Under Population Death Threshold: ';

// Slider to control the threshold to kill cells due to over population
let overPopSlider;
let overPopLabel;
let overPopStr = 'Over Population Death Threshold: ';

function randomColor() {
  return color(
    floor(random(255)),
    floor(random(255)),
    floor(random(255)));
}

function createFrameRateSlider(height_pos) {
  frSlider = createSlider(1, 60, 30, 1); // Min FPS: 1, Max FPS: 60, Default: 30, Step: 1
  frSlider.position(10, height - height_pos); // Position it below the canvas
  frSlider.style('width', '180px'); // Set a width for the slider
  // Create a paragraph element for the label
  frLabel = createElement('p', 'FPS: 30'); // Initial text
  frLabel.position(frSlider.x + frSlider.width + 10, frSlider.y - 10); // Position next to slider
  frLabel.style('color', 'white'); // Make text visible on dark background
  frLabel.style('font-family', 'monospace'); // Optional: adjust font
  frLabel.style('font-size', '16px'); // Optional: adjust font size
}

function createrebirthSlider(height_pos) {
  rebirthSlider = createSlider(1, 7, 3, 1);
  rebirthSlider.position(10, height - height_pos);
  rebirthSlider.style('width', '180px');
  rebirthLabel = createElement('p', rebirthStr + '3');
  rebirthLabel.position(rebirthSlider.x + rebirthSlider.width + 10, rebirthSlider.y - 10);
  rebirthLabel.style('color', 'white');
  rebirthLabel.style('font-family', 'monospace');
  rebirthLabel.style('font-size', '16px');
}
function createunderPopSlider(height_pos) {
  underPopSlider = createSlider(1, 7, 2, 1);
  underPopSlider.position(10, height - height_pos);
  underPopSlider.style('width', '180px');
  underPopLabel = createElement('p', underPopStr + '2');
  underPopLabel.position(underPopSlider.x + underPopSlider.width + 10, underPopSlider.y - 10);
  underPopLabel.style('color', 'white');
  underPopLabel.style('font-family', 'monospace');
  underPopLabel.style('font-size', '16px');
}
function createoverPopSlider(height_pos) {
  overPopSlider = createSlider(1, 7, 3, 1);
  overPopSlider.position(10, height - height_pos);
  overPopSlider.style('width', '180px');
  overPopLabel = createElement('p', overPopLabel + '3');
  overPopLabel.position(overPopSlider.x + overPopSlider.width + 10, overPopSlider.y - 10);
  overPopLabel.style('color', 'white');
  overPopLabel.style('font-family', 'monospace');
  overPopLabel.style('font-size', '16px');
}

function repositionSliders() {
  frSlider.position(10, height - 30);
  rebirthSlider.position(10, height - 50);
  overPopSlider.position(10, height - 70);
  underPopSlider.position(10, height - 90);
  frLabel.position(frSlider.x + frSlider.width + 10, frSlider.y - 10);
  rebirthLabel.position(rebirthSlider.x + rebirthSlider.width + 10, rebirthSlider.y - 10);
  underPopLabel.position(underPopSlider.x + underPopSlider.width + 10, underPopSlider.y - 10);
  overPopLabel.position(overPopSlider.x + overPopSlider.width + 10, overPopSlider.y - 10);
}

function conwaySetup() {
  // Use windowWidth and windowHeight to make the canvas full screen
  createCanvas(windowWidth, windowHeight);

  // Recalculate cols and rows based on new canvas size
  cols = floor(width / resolution); // Use floor to ensure integer number of columns
  rows = floor(height / resolution); // Use floor to ensure integer number of rows


  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (floor(random(2)) == 1) {
        grid[i][j] = randomColor()
      } else {
        grid[i][j] = 0
      }
    }
  }
  var sliderFunctions = [
    createFrameRateSlider,
    createrebirthSlider,
    createoverPopSlider,
    createunderPopSlider];

  let height_pos = 30;
  sliderFunctions.forEach(function(sliderFunc) {
    sliderFunc(height_pos);
    height_pos += 20;
  });
}

function conwayDraw() {
  // Get the value from the slider and set the frame rate
  let fps = frSlider.value();
  frameRate(fps);
  background(0); // Black background

  // Draw the grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] != 0) {
        fill(grid[i][j]); // White for alive cells
        stroke(0);
        rect(x, y, resolution - 1, resolution - 1);
      }
    }
  }

  // Compute the next generation
  let next = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let state = grid[i][j];

      // Count live neighbours
      let sum = 0;
      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          let col = (i + k + cols) % cols; // Wrap around for edges
          let row = (j + l + rows) % rows; // Wrap around for edges
          if (grid[col][row] != 0) {
            sum += 1;
          }
        }
      }
      sum -= state == 0 ? 0 : 1; // Subtract the cell itself from the neighbour count

      // Apply Conway's Game of Life rules
      if (state != 0 &&
        (sum < underPopSlider.value() ||
          sum > overPopSlider.value())) {
        next[i][j] = 0; // Dies due to underpopulation or overpopulation
      } else if (state == 0 &&
        sum == rebirthSlider.value()) {
        next[i][j] = randomColor(); // Becomes alive due to reproduction
      } else {
        next[i][j] = state; // Stays the same
      }
    }
  }
  frLabel.html('FPS: ' + fps); // <-- This line updates the text!
  rebirthLabel.html(rebirthStr + rebirthSlider.value());
  underPopLabel.html(underPopStr + underPopSlider.value());
  overPopLabel.html(overPopStr + overPopSlider.value());
  grid = next; // Update the grid for the next frame
}

// Helper function to create a 2D array
function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

// Modified function to handle mouse presses (now also makes the initial cell alive)
function conwayMousePressed() {
  drawCellAtMouse();
}

// New function to handle mouse dragging
function conwayMouseDragged() {
  drawCellAtMouse();
}

// Helper function to draw a cell at mouse position, used by both mousePressed and mouseDragged
function drawCellAtMouse() {
  // Convert mouse coordinates to grid coordinates
  let mouseCol = floor(mouseX / resolution);
  let mouseRow = floor(mouseY / resolution);

  // Check if the mouse is within the grid boundaries and not on the slider
  if (mouseCol >= 0 && mouseCol < cols && mouseRow >= 0 && mouseRow < rows && mouseY < height) {
    grid[mouseCol][mouseRow] = randomColor(); // Set the cell to alive
  }
}

// Add this function to handle window resizing
function conwayWindowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / resolution);
  rows = floor(height / resolution);
  // Re-initialize grid with current alive cells to prevent out-of-bounds issues
  let tempGrid = make2DArray(cols, rows);
  for (let i = 0; i < min(cols, grid.length); i++) {
    for (let j = 0; j < min(rows, grid[0].length); j++) {
      tempGrid[i][j] = grid[i][j];
    }
  }
  grid = tempGrid;
  repositionSliders(); // Reposition slider
}