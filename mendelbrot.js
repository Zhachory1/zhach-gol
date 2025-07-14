
class MendelbrotSimulation {
  constructor() {
    this.grid = null;
    this.cols = 0;
    this.rows = 0;
    this.resolution = 10;
    
    // UI elements
    this.frSlider = null;
    this.frLabel = null;
    this.rebirthSlider = null;
    this.rebirthLabel = null;
    this.underPopSlider = null;
    this.underPopLabel = null;
    this.overPopSlider = null;
    this.overPopLabel = null;
    
    // String constants
    this.rebirthStr = 'Rebirth Threshold: ';
    this.underPopStr = 'Under Population Death Threshold: ';
    this.overPopStr = 'Over Population Death Threshold: ';
  }

  randomColor() {
    return color(
      floor(random(255)),
      floor(random(255)),
      floor(random(255))
    );
  }

  createFrameRateSlider(height_pos) {
    this.frSlider = createSlider(1, 60, 30, 1);
    this.frSlider.position(10, height - height_pos);
    this.frSlider.style('width', '180px');
    this.frLabel = createElement('p', 'FPS: 30');
    this.frLabel.position(this.frSlider.x + this.frSlider.width + 10, this.frSlider.y - 10);
    this.frLabel.style('color', 'white');
    this.frLabel.style('font-family', 'monospace');
    this.frLabel.style('font-size', '16px');
  }

  createRebirthSlider(height_pos) {
    this.rebirthSlider = createSlider(1, 7, 3, 1);
    this.rebirthSlider.position(10, height - height_pos);
    this.rebirthSlider.style('width', '180px');
    this.rebirthLabel = createElement('p', this.rebirthStr + '3');
    this.rebirthLabel.position(this.rebirthSlider.x + this.rebirthSlider.width + 10, this.rebirthSlider.y - 10);
    this.rebirthLabel.style('color', 'white');
    this.rebirthLabel.style('font-family', 'monospace');
    this.rebirthLabel.style('font-size', '16px');
  }

  createUnderPopSlider(height_pos) {
    this.underPopSlider = createSlider(1, 7, 2, 1);
    this.underPopSlider.position(10, height - height_pos);
    this.underPopSlider.style('width', '180px');
    this.underPopLabel = createElement('p', this.underPopStr + '2');
    this.underPopLabel.position(this.underPopSlider.x + this.underPopSlider.width + 10, this.underPopSlider.y - 10);
    this.underPopLabel.style('color', 'white');
    this.underPopLabel.style('font-family', 'monospace');
    this.underPopLabel.style('font-size', '16px');
  }

  createOverPopSlider(height_pos) {
    this.overPopSlider = createSlider(1, 7, 3, 1);
    this.overPopSlider.position(10, height - height_pos);
    this.overPopSlider.style('width', '180px');
    this.overPopLabel = createElement('p', this.overPopStr + '3');
    this.overPopLabel.position(this.overPopSlider.x + this.overPopSlider.width + 10, this.overPopSlider.y - 10);
    this.overPopLabel.style('color', 'white');
    this.overPopLabel.style('font-family', 'monospace');
    this.overPopLabel.style('font-size', '16px');
  }

  repositionSliders() {
    this.frSlider.position(10, height - 30);
    this.rebirthSlider.position(10, height - 50);
    this.overPopSlider.position(10, height - 70);
    this.underPopSlider.position(10, height - 90);
    this.frLabel.position(this.frSlider.x + this.frSlider.width + 10, this.frSlider.y - 10);
    this.rebirthLabel.position(this.rebirthSlider.x + this.rebirthSlider.width + 10, this.rebirthSlider.y - 10);
    this.underPopLabel.position(this.underPopSlider.x + this.underPopSlider.width + 10, this.underPopSlider.y - 10);
    this.overPopLabel.position(this.overPopSlider.x + this.overPopSlider.width + 10, this.overPopSlider.y - 10);
  }

  setup() {
    createCanvas(windowWidth, windowHeight);
    this.cols = floor(width / this.resolution);
    this.rows = floor(height / this.resolution);

    this.grid = this.make2DArray(this.cols, this.rows);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        if (floor(random(2)) == 1) {
          this.grid[i][j] = this.randomColor();
        } else {
          this.grid[i][j] = 0;
        }
      }
    }

    const sliderFunctions = [
      (pos) => this.createFrameRateSlider(pos),
      (pos) => this.createRebirthSlider(pos),
      (pos) => this.createOverPopSlider(pos),
      (pos) => this.createUnderPopSlider(pos)
    ];

    let height_pos = 50;
    sliderFunctions.forEach((sliderFunc) => {
      sliderFunc(height_pos);
      height_pos += 20;
    });
  }

  draw() {
    let fps = this.frSlider.value();
    frameRate(fps);
    background(0);

    // Draw the grid
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let x = i * this.resolution;
        let y = j * this.resolution;
        if (this.grid[i][j] != 0) {
          fill(this.grid[i][j]);
          stroke(0);
          rect(x, y, this.resolution - 1, this.resolution - 1);
        }
      }
    }

    // Compute the next generation
    let next = this.make2DArray(this.cols, this.rows);

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let state = this.grid[i][j];

        // Count live neighbours
        let sum = 0;
        for (let k = -1; k <= 1; k++) {
          for (let l = -1; l <= 1; l++) {
            let col = (i + k + this.cols) % this.cols;
            let row = (j + l + this.rows) % this.rows;
            if (this.grid[col][row] != 0) {
              sum += 1;
            }
          }
        }
        sum -= state == 0 ? 0 : 1;

        // Apply Conway's Game of Life rules
        if (state != 0 && (sum < this.underPopSlider.value() || sum > this.overPopSlider.value())) {
          next[i][j] = 0;
        } else if (state == 0 && sum == this.rebirthSlider.value()) {
          next[i][j] = this.randomColor();
        } else {
          next[i][j] = state;
        }
      }
    }

    this.frLabel.html('FPS: ' + fps);
    this.rebirthLabel.html(this.rebirthStr + this.rebirthSlider.value());
    this.underPopLabel.html(this.underPopStr + this.underPopSlider.value());
    this.overPopLabel.html(this.overPopStr + this.overPopSlider.value());
    this.grid = next;
  }

  make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }

  mousePressed() {
    this.drawCellAtMouse();
  }

  mouseDragged() {
    this.drawCellAtMouse();
  }

  drawCellAtMouse() {
    let mouseCol = floor(mouseX / this.resolution);
    let mouseRow = floor(mouseY / this.resolution);

    if (mouseCol >= 0 && mouseCol < this.cols && mouseRow >= 0 && mouseRow < this.rows && mouseY < height) {
      this.grid[mouseCol][mouseRow] = this.randomColor();
    }
  }

  windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    this.cols = floor(width / this.resolution);
    this.rows = floor(height / this.resolution);
    let tempGrid = this.make2DArray(this.cols, this.rows);
    for (let i = 0; i < min(this.cols, this.grid.length); i++) {
      for (let j = 0; j < min(this.rows, this.grid[0].length); j++) {
        tempGrid[i][j] = this.grid[i][j];
      }
    }
    this.grid = tempGrid;
    this.repositionSliders();
  }
}
