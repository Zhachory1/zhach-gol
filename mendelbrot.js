let mendelGrid;
let mendelCols;
let mendelRows;
let mendelResolution = 10; // Size of each cell

let mendelFrSlider; // Declare the slider variable
let mendelFrLabel;

// Slider to control the threshold for cells to become alive based on their number of neighbors
let mendelRebirthSlider;
let mendelRebirthLabel;
let mendelRebirthStr = 'Rebirth Threshold: ';

// Slider to control the threshold to kill cells due to under population
let mendelUnderPopSlider;
let mendelUnderPopLabel;
let mendelUnderPopStr = 'Under Population Death Threshold: ';

// Slider to control the threshold to kill cells due to over population
let mendelOverPopSlider;
let mendelOverPopLabel;
let mendelOverPopStr = 'Over Population Death Threshold Threshold: ';

function mendelrandomColor() {
  return color(
    floor(random(255)),
    floor(random(255)),
    floor(random(255)));
}

function mendelCreateFrameRateSlider(height_pos) {
  mendelFrSlider = createSlider(1, 60, 30, 1); // Min FPS: 1, Max FPS: 60, Default: 30, Step: 1
  mendelFrSlider.position(10, height - height_pos); // Position it below the canvas
  mendelFrSlider.style('width', '180px'); // Set a width for the slider
  // Create a paragraph element for the label
  mendelFrLabel = createElement('p', 'FPS: 30'); // Initial text
  mendelFrLabel.position(mendelFrSlider.x + mendelFrSlider.width + 10, mendelFrSlider.y - 10); // Position next to slider
  mendelFrLabel.style('color', 'white'); // Make text visible on dark background
  mendelFrLabel.style('font-family', 'monospace'); // Optional: adjust font
  mendelFrLabel.style('font-size', '16px'); // Optional: adjust font size
}

function mendelCreateRebirthSlider(height_pos) {
  mendelRebirthSlider = createSlider(1, 7, 3, 1);
  mendelRebirthSlider.position(10, height - height_pos);
  mendelRebirthSlider.style('width', '180px');
  mendelRebirthLabel = createElement('p', mendelRebirthStr + '3');
  mendelRebirthLabel.position(mendelRebirthSlider.x + mendelRebirthSlider.width + 10, mendelRebirthSlider.y - 10);
  mendelRebirthLabel.style('color', 'white');
  mendelRebirthLabel.style('font-family', 'monospace');
  mendelRebirthLabel.style('font-size', '16px');
}
function mendelCreateUnderPopSlider(height_pos) {
  mendelUnderPopSlider = createSlider(1, 7, 2, 1);
  mendelUnderPopSlider.position(10, height - height_pos);
  mendelUnderPopSlider.style('width', '180px');
  mendelUnderPopLabel = createElement('p', mendelUnderPopStr + '2');
  mendelUnderPopLabel.position(mendelUnderPopSlider.x + mendelUnderPopSlider.width + 10, mendelUnderPopSlider.y - 10);
  mendelUnderPopLabel.style('color', 'white');
  mendelUnderPopLabel.style('font-family', 'monospace');
  mendelUnderPopLabel.style('font-size', '16px');
}
function mendelCreateOverPopSlider(height_pos) {
  mendelOverPopSlider = createSlider(1, 7, 3, 1);
  mendelOverPopSlider.position(10, height - height_pos);
  mendelOverPopSlider.style('width', '180px');
  mendelOverPopLabel = createElement('p', mendelOverPopStr + '3');
  mendelOverPopLabel.position(mendelOverPopSlider.x + mendelOverPopSlider.width + 10, mendelOverPopSlider.y - 10);
  mendelOverPopLabel.style('color', 'white');
  mendelOverPopLabel.style('font-family', 'monospace');
  mendelOverPopLabel.style('font-size', '16px');
}

function mendelRepositionSliders() {
  mendelFrSlider.position(10, height - 30);
  mendelRebirthSlider.position(10, height - 50);
  mendelOverPopSlider.position(10, height - 70);
  mendelUnderPopSlider.position(10, height - 90);
  mendelFrLabel.position(mendelFrSlider.x + mendelFrSlider.width + 10, mendelFrSlider.y - 10);
  mendelRebirthLabel.position(mendelRebirthSlider.x + mendelRebirthSlider.width + 10, mendelRebirthSlider.y - 10);
  mendelUnderPopLabel.position(mendelUnderPopSlider.x + mendelUnderPopSlider.width + 10, mendelUnderPopSlider.y - 10);
  mendelOverPopLabel.position(mendelOverPopSlider.x + mendelOverPopSlider.width + 10, mendelOverPopSlider.y - 10);
}

function mendelSetup() {
  // Use windowWidth and windowHeight to make the canvas full screen
  createCanvas(windowWidth, windowHeight);

  // Recalculate cols and rows based on new canvas size
  mendelCols = floor(width / mendelResolution); // Use floor to ensure integer number of columns
  mendelRows = floor(height / mendelResolution); // Use floor to ensure integer number of rows


  mendelGrid = mendelMake2DArray(mendelCols, mendelRows);
  for (let i = 0; i < mendelCols; i++) {
    for (let j = 0; j < mendelRows; j++) {
      if (floor(random(2)) == 1) {
        mendelGrid[i][j] = mendelRandomColor()
      } else {
        mendelGrid[i][j] = 0
      }
    }
  }
  var sliderFunctions = [
    mendelCreateFrameRateSlider,
    mendelCreateRebirthSlider,
    mendelCreateOverPopSlider,
    mendelCreateUnderPopSlider];

  let height_pos = 50;
  sliderFunctions.forEach(function(sliderFunc) {
    sliderFunc(height_pos);
    height_pos += 20;
  });
}

function mendelDraw() {
  // Get the value from the slider and set the frame rate
  let fps = mendelFrSlider.value();
  frameRate(fps);
  background(0); // Black background

  // Draw the grid
  for (let i = 0; i < mendelCols; i++) {
    for (let j = 0; j < mendelRows; j++) {
      let x = i * mendelResolution;
      let y = j * mendelResolution;
      if (mendelGrid[i][j] != 0) {
        fill(mendelGrid[i][j]); // White for alive cells
        stroke(0);
        rect(x, y, mendelResolution - 1, mendelResolution - 1);
      }
    }
  }

  // Compute the next generation
  let next = mendelMake2DArray(mendelCols, mendelRows);

  for (let i = 0; i < mendelCols; i++) {
    for (let j = 0; j < mendelRows; j++) {
      let state = mendelGrid[i][j];

      // Count live neighbours
      let sum = 0;
      for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
          let col = (i + k + mendelCols) % mendelCols; // Wrap around for edges
          let row = (j + l + mendelRows) % mendelRows; // Wrap around for edges
          if (mendelGrid[col][row] != 0) {
            sum += 1;
          }
        }
      }
      sum -= state == 0 ? 0 : 1; // Subtract the cell itself from the neighbour count

      // Apply Conway's Game of Life rules
      if (state != 0 &&
        (sum < mendelUnderPopSlider.value() ||
          sum > mendelOverPopSlider.value())) {
        next[i][j] = 0; // Dies due to underpopulation or overpopulation
      } else if (state == 0 &&
        sum == mendelRebirthSlider.value()) {
        next[i][j] = mendelRandomColor(); // Becomes alive due to reproduction
      } else {
        next[i][j] = state; // Stays the same
      }
    }
  }
  mendelFrLabel.html('FPS: ' + fps); // <-- This line updates the text!
  mendelRebirthLabel.html(mendelRebirthStr + mendelRebirthSlider.value());
  mendelUnderPopLabel.html(mendelUnderPopStr + mendelUnderPopSlider.value());
  mendelOverPopLabel.html(mendelOverPopStr + mendelOverPopSlider.value());
  mendelGrid = next; // Update the grid for the next frame
}

// Helper function mendelto create a 2D array
function mendelMake2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

// Modified function to handle mouse presses (now also makes the initial cell alive)
function mendelMousePressed() {
  mendelDrawCellAtMouse();
}

// New function to handle mouse dragging
function mendelMouseDragged() {
  mendelDrawCellAtMouse();
}

// Helper function to draw a cell at mouse position, used by both mousePressed and mouseDragged
function mendelDrawCellAtMouse() {
  // Convert mouse coordinates to grid coordinates
  let mouseCol = floor(mouseX / mendelResolution);
  let mouseRow = floor(mouseY / mendelResolution);

  // Check if the mouse is within the grid boundaries and not on the slider
  if (mouseCol >= 0 && mouseCol < mendelCols && mouseRow >= 0 && mouseRow < mendelRows && mouseY < height) {
    mendelGrid[mouseCol][mouseRow] = mendelRandomColor(); // Set the cell to alive
  }
}

// Add this function to handle window resizing
function mendelWindowResized() {
  resizeCanvas(windowWidth, windowHeight);
  mendelCols = floor(width / mendelResolution);
  mendelRows = floor(height / mendelResolution);
  // Re-initialize grid with current alive cells to prevent out-of-bounds issues
  let tempGrid = mendelMake2DArray(mendelCols, mendelRows);
  for (let i = 0; i < min(mendelCols, mendelGrid.length); i++) {
    for (let j = 0; j < min(mendelRows, mendelGrid[0].length); j++) {
      tempGrid[i][j] = mendelGrid[i][j];
    }
  }
  mendelGrid = tempGrid;
  mendelRepositionSliders(); // Reposition slider
}