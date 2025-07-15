
// Custom RangeSlider Class
class RangeSlider {
  constructor(x, y, w, h, minP, maxP, initialMin, initialMax) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.minPossible = minP; // Minimum possible value for the slider
    this.maxPossible = maxP; // Maximum possible value for the slider

    this.knobRadius = h * 1.2; // Size of the knobs

    // Initial values for the min and max knobs
    this.minVal = initialMin;
    this.maxVal = initialMax;

    // Convert initial values to pixel positions
    this.minKnobX = map(this.minVal, this.minPossible, this.maxPossible, this.x, this.x + this.width);
    this.maxKnobX = map(this.maxVal, this.minPossible, this.maxPossible, this.x, this.x + this.width);

    this.draggingMin = false;
    this.draggingMax = false;
  }

  display() {
    // Draw the slider track
    noStroke();
    fill(150);
    rect(this.x, this.y, this.width, this.height, this.height / 2); // Rounded rectangle

    // Draw the selected range
    fill(70, 130, 180); // Blue color for the selected range
    let startFillX = min(this.minKnobX, this.maxKnobX);
    let endFillX = max(this.minKnobX, this.maxKnobX);
    rect(startFillX, this.y, endFillX - startFillX, this.height, this.height / 2);


    // Draw the min knob
    stroke(0);
    strokeWeight(1);
    if (this.draggingMin) {
      fill(255, 100, 100); // Red when dragging
    } else {
      fill(255);
    }
    ellipse(this.minKnobX, this.y + this.height / 2, this.knobRadius);

    // Draw the max knob
    if (this.draggingMax) {
      fill(100, 255, 100); // Green when dragging
    } else {
      fill(255);
    }
    ellipse(this.maxKnobX, this.y + this.height / 2, this.knobRadius);
  }

  // Check if mouse is over the min knob
  isMouseOverMinKnob() {
    let d = dist(mouseX, mouseY, this.minKnobX, this.y + this.height / 2);
    return d < this.knobRadius / 2;
  }

  // Check if mouse is over the max knob
  isMouseOverMaxKnob() {
    let d = dist(mouseX, mouseY, this.maxKnobX, this.y + this.height / 2);
    return d < this.knobRadius / 2;
  }

  mousePressed() {
    if (this.isMouseOverMinKnob()) {
      this.draggingMin = true;
    } else if (this.isMouseOverMaxKnob()) {
      this.draggingMax = true;
    }
  }

  mouseDragged() {
    if (this.draggingMin) {
      // Constrain the knob's movement within the slider track
      this.minKnobX = constrain(mouseX, this.x, this.x + this.width);
      // Ensure min knob doesn't go beyond max knob
      this.minKnobX = min(this.minKnobX, this.maxKnobX);
      // Update the value
      this.minVal = map(this.minKnobX, this.x, this.x + this.width, this.minPossible, this.maxPossible);
    } else if (this.draggingMax) {
      // Constrain the knob's movement within the slider track
      this.maxKnobX = constrain(mouseX, this.x, this.x + this.width);
      // Ensure max knob doesn't go below min knob
      this.maxKnobX = max(this.maxKnobX, this.minKnobX);
      // Update the value
      this.maxVal = map(this.maxKnobX, this.x, this.x + this.width, this.minPossible, this.maxPossible);
    }
  }

  mouseReleased() {
    this.draggingMin = false;
    this.draggingMax = false;
  }

  getMin() {
    return this.minVal;
  }

  getMax() {
    return this.maxVal;
  }
}

class MendelbrotSimulation {
  constructor() {
    this.img = null;
    this.frameRate = 15;

    // UI elements
    this.xRange = null;
    this.yRange = null;
    this.iter = null;

    this.xRangeLabel = null;
    this.yRangeLabel = null;
    this.iterLabel = null;

    // memoize cache for log
    this.log_cache = {};

    // String constants
    this.xRangeStr = 'X Range Min/Max: ';
    this.yRangeStr = 'Y Range Min/Max: ';
    this.iterationStr = 'Convergence Threshold: ';
  }

  log(x) {
    if (!(x in this.log_cache)) {
      this.log_cache[x] = Math.log(x);
    }
    return this.log_cache[x];
  }

  // Calculates whether the given point diverges to infinity or not.
  // Will return 0 if it stays bounded. Otherwise, will return the
  // number of iterations it took before it started diverging
  mandelIter(cx, cy, maxIter) {
    var x = 0.0;
    var y = 0.0;
    var xx = 0;
    var yy = 0;
    var xy = 0;

    var i = maxIter;
    while (i-- && xx + yy <= 4) {
      xy = x * y;
      xx = x * x;
      yy = y * y;
      x = xx - yy + cx;
      y = xy + xy + cy;
    }
    return maxIter - i;
  }

  createXRangeSlider(height_pos) {
    // Create a new RangeSlider instance
    this.xRange = new RangeSlider(10, windowHeight - height_pos, 180, 10, -2, 1, -2, 1);

    // Create text elements to display the values
    this.xRangeLabel = createP(
      this.xRangeStr + this.xRange.getMin() + "/" + this.xRange.getMax());
    this.xRangeLabel.position(
      this.xRange.x + this.xRange.width + 10,
      this.xRange.y - 20);
    this.xRangeLabel.style('color', 'white');
    this.xRangeLabel.style('font-family', 'monospace');
    this.xRangeLabel.style('font-size', '16px');
  }

  createYRangeSlider(height_pos) {
    // Create a new RangeSlider instance
    this.yRange = new RangeSlider(10, windowHeight - height_pos, 180, 10, -1, 1, -1, 1);

    // Create text elements to display the values
    this.yRangeLabel = createP(
      this.yRangeStr + this.yRange.getMin() + "/" + this.yRange.getMax());
    this.yRangeLabel.position(
      this.yRange.x + this.yRange.width + 10,
      this.yRange.y - 20);
    this.yRangeLabel.style('color', 'white');
    this.yRangeLabel.style('font-family', 'monospace');
    this.yRangeLabel.style('font-size', '16px');
  }

  createIterSlider(height_pos) {
    this.iter = createSlider(100, 1000, 250, 10);
    this.iter.position(10, windowHeight - height_pos);
    this.iter.style('width', '180px');
    this.iterLabel = createElement('p', this.iterationStr + this.iter.value());
    this.iterLabel.position(this.iter.x + this.iter.width + 10, this.iter.y - 10);
    this.iterLabel.style('color', 'white');
    this.iterLabel.style('font-family', 'monospace');
    this.iterLabel.style('font-size', '16px');
  }

  repositionSliders() {
    this.iter.position(10, windowHeight - 30);
    this.yRange.y = windowHeight - 50;
    this.xRange.y = windowHeight - 70;
    this.iterLabel.position(this.iter.x + this.iter.width + 10, this.iter.y - 10);
    this.yRangeLabel.position(this.yRange.x + this.yRange.width + 10, this.yRange.y - 10);
    this.xRangeLabel.position(this.xRange.x + this.xRange.width + 10, this.xRange.y - 10);
  }

  updateImg() {
    // Load the image's pixels.
    this.img.loadPixels();

    // precalculate some things in vars for quick and easier access
    let iter_log = this.log(this.iter.value() - 1);
    let xmin = this.xRange.getMin();
    let xmax = this.xRange.getMax();
    let ymin = this.yRange.getMin();
    let ymax = this.yRange.getMax();
    let maxIter = this.iter.value();

    // Set the pixels based on Mandelbrot calculation
    for (let ix = 0; ix < this.img.width; ix += 1) {
      for (let iy = 0; iy < this.img.height; iy += 1) {
        let x = xmin + (xmax - xmin) * ix / (this.img.width - 1);
        let y = ymin + (ymax - ymin) * iy / (this.img.height - 1);
        let iterations = this.mandelIter(x, y, maxIter);

        // Each pixel has four values which is flattened into this
        // one image array (RGB + alpha). This is waaaay faster than
        // calling the this.img.set(x, y, Color()) method.
        let ppos = 4 * (this.img.width * iy + ix);

        if (iterations >= maxIter) {
          // Point is in the Mandelbrot set - make it black
          this.img.pixels[ppos] = 0;     // Red
          this.img.pixels[ppos + 1] = 0; // Green
          this.img.pixels[ppos + 2] = 0; // Blue
        } else {
          // Point escapes - color based on how quickly it escapes
          // This creates a smooth color gradient
          let c = 3 * this.log(iterations + 1) / iter_log;

          if (c < 1) {
            // Red to yellow transition
            this.img.pixels[ppos] = 255 * c;
            this.img.pixels[ppos + 1] = 0;
            this.img.pixels[ppos + 2] = 0;
          }
          else if (c < 2) {
            // Yellow to white transition
            this.img.pixels[ppos] = 255;
            this.img.pixels[ppos + 1] = 255 * (c - 1);
            this.img.pixels[ppos + 2] = 0;
          } else {
            // White
            this.img.pixels[ppos] = 255;
            this.img.pixels[ppos + 1] = 255;
            this.img.pixels[ppos + 2] = 255 * (c - 2);
          }
        }

        // Always set alpha to full value to get full color
        this.img.pixels[ppos + 3] = 255;
      }
    }

    // Update the image.
    this.img.updatePixels();
  }

  setup() {
    createCanvas(windowWidth, windowHeight);
    this.img = createImage(600, 400);

    const sliderFunctions = [
      (pos) => this.createIterSlider(pos),
      (pos) => this.createYRangeSlider(pos),
      (pos) => this.createXRangeSlider(pos),
    ];

    let height_pos = 30;
    sliderFunctions.forEach((sliderFunc) => {
      sliderFunc(height_pos);
      height_pos += 20;
    });
  }

  draw() {
    frameRate(this.frameRate);
    background(0);

    // Update img
    this.updateImg();

    // Display the image centered
    let imgWidth = this.img.width;
    let imgHeight = this.img.height;
    let x = (windowWidth - imgWidth) / 2;
    let y = (windowHeight - imgHeight) / 2;
    image(this.img, x, y);

    // Update labels
    this.iterLabel.html(this.iterationStr + this.iter.value());
    this.xRangeLabel.html(this.xRangeStr +
      this.xRange.getMin().toFixed(3) + "/" +
      this.xRange.getMax().toFixed(3));
    this.yRangeLabel.html(this.yRangeStr +
      this.yRange.getMin().toFixed(3) + "/" +
      this.yRange.getMax().toFixed(3));
    
    // Display the sliders
    this.xRange.display();
    this.yRange.display();
  }

  mousePressed() {
    this.xRange.mousePressed();
    this.yRange.mousePressed();
  }

  mouseDragged() {
    this.xRange.mouseDragged();
    this.yRange.mouseDragged();
  }

  mouseReleased() {
    this.xRange.mouseReleased();
    this.yRange.mouseReleased();
  }

  windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    this.repositionSliders();
  }
}
