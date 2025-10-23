function make2DArray(cols, rows) {
	let arr = new Array(rows);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(cols).fill(0);
	}
	return arr;
}

function isFull() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (grid[i][j] === 0) {
				return false; // Found an empty cell
			}
		}
	}
	return true; // All cells are non-zero
}

function resetCanvas() {
	if (isFull() && !resetPending) {
		resetPending = true;

		setTimeout(() => {
			grid = make2DArray(cols, rows);
			console.log("Grid reset!");
			num_sand = 0;
			c = newColor();
			resetPending = false;
		}, 1000);
	}
}

/*
  Grid  will be our 2D Array
  w will determine each square/unit of sand size
  Define cols and rows
  c represents color for the sand
  rand is used to randomize sand direction
  num_sand is a counter to change the sand's color after a certain limit
*/

let grid;
let w = 5;
let cols, rows;
let c;
let rand;
let num_sand = 0;
let resetPending = false; // global flag
let halfBrush = 1;

/*
  Start with our default color
  Set cols and rows
  Create a 2D array populated with 0s
*/
function setup() {
	canvas = createCanvas(600, 800);
	canvas.parent("canvas-container");
	canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
	c = color(250);
	cols = width / w;
	rows = height / w;
	grid = make2DArray(cols, rows);
}

// Generates a random color
function newColor() {
	let r = Math.floor(Math.random() * 254 + 1);
	let g = Math.floor(Math.random() * 254 + 1);
	let b = Math.floor(Math.random() * 254 + 1);
	return color(r, g, b);
}

function mouseDragged() {
	num_sand += 1;
	if (num_sand === 500) {
		c = newColor();
		num_sand = 0;
	}

	// Get mouse coordinates
	let col = floor(mouseX / w);
	let row = floor(mouseY / w);

	for (let i = -halfBrush; i <= halfBrush; i++) {
		for (let j = -halfBrush; j <= halfBrush; j++) {
			if (random(1) < 0.75) {
				if (row + i < rows && row + i >= 0 && col + j < cols && col + j >= 0) {
					// To prevent adding new sand to already existing sand
					if (grid[row + i][col + j] === 0) {
						grid[row + i][col + j] = c;
					}
				}
			}
		}
	}
}

function draw() {
	//Will only reset if sand fills canvas
	resetCanvas();
	background(color(135, 206, 255));
	noStroke();

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			// If there is a sand particle
			if (grid[i][j] !== 0) {
				fill(grid[i][j]);
			} else {
				// There is no sand particle, keep background color
				fill(color(135, 206, 255)); // Sky blue
			}

			let x = j * w;
			let y = i * w;
			square(x, y, w);
		}
	}

	// 0 = black, 1 = white
	let nextGrid = make2DArray(cols, rows);
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			let state = grid[i][j];
			/*
      if the state is 1
        if the unit below is not out of bounds and air
          go down
        else if the unit below to the left and right are not out of bounds and are air
            randomly go in either direction
        else if ...
          go right
        else if ...
          go left
        else
          There's no where we can slide to, we stay the same
      */
			if (state !== 0) {
				if (i + 1 < rows && grid[i + 1][j] === 0) {
					nextGrid[i + 1][j] = state;
				} else if (
					i + 1 < rows &&
					grid[i + 1][j + 1] === 0 &&
					grid[i + 1][j - 1] === 0
				) {
					rand = Math.random() < 0.5 ? -1 : 1;
					nextGrid[i + 1][j + rand] = state;
				} else if (i + 1 < rows && grid[i + 1][j + 1] === 0) {
					nextGrid[i + 1][j + 1] = state;
				} else if (i + 1 < rows && grid[i + 1][j - 1] === 0) {
					nextGrid[i + 1][j - 1] = state;
				} else {
					nextGrid[i][j] = state;
				}
			}
		}
	}
	grid = nextGrid;
}
