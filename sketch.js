function make2DArray(cols, rows, base = 0) {
	let arr = new Array(rows);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(cols).fill(base);
	}
	return arr;
}

function resetCanvas() {
	if (resetPending) return;
	resetPending = true;
	const interval = setInterval(() => {
		// Shift all rows down by one
		for (let row = rows - 1; row > 0; row--) {
			for (let col = 0; col < cols; col++) {
				grid[row][col] = grid[row - 1][col];
			}
		}
		// Clear the top row
		for (let col = 0; col < cols; col++) {
			grid[0][col] = 0;
		}
		// Check if grid is empty
		let empty = true;
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				if (grid[row][col] !== 0) {
					empty = false;
					break;
				}
			}
			if (!empty) break;
		}
		if (empty) {
			clearInterval(interval);
			resetPending = false;
			num_sand = 0;
			console.log("Grid drained!");
		}
	}, 30); // Adjust delay for speed
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
let halfBrush = 2;
let gravity = 0.25;

// Reusable arrays for optimization
let nextGrid;
let nextVelocity;

window.brushColor = [250, 0, 0];
let brushColor;

/*
  Start with our default color
  Set cols and rows
  Create a 2D array populated with 0s
*/
function setup() {
	canvas = createCanvas(700, 800);
	canvas.parent("canvas-container");
	// canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
	c = brushColor;
	brushColor = color(r, g, b) || color(250);
	cols = width / w;
	rows = height / w;
	grid = make2DArray(cols, rows);
	velocityGrid = make2DArray(cols, rows, 1);
	// Initialize reusable arrays
	nextGrid = make2DArray(cols, rows);
	nextVelocity = make2DArray(cols, rows, 1);
}

// Generates a random color
// function newColor() {
// 	let r = Math.floor(Math.random() * 254 + 1);
// 	let g = Math.floor(Math.random() * 254 + 1);
// 	let b = Math.floor(Math.random() * 254 + 1);
// 	return color(r, g, b);
// }

function mouseDragged() {
	num_sand += 1;
	// if (num_sand === 150) {
	// 	c = brushColor;
	// 	num_sand = 0;
	// }

	// Get mouse coordinates
	let col = floor(mouseX / w);
	let row = floor(mouseY / w);

	for (let i = -halfBrush; i <= halfBrush; i++) {
		for (let j = -halfBrush; j <= halfBrush; j++) {
			if (random(1) < 0.75) {
				if (row + i < rows && row + i >= 0 && col + j < cols && col + j >= 0) {
					// To prevent adding new sand to already existing sand
					if (grid[row + i][col + j] === 0) {
						grid[row + i][col + j] = color(...window.brushColor);
					}
				}
			}
		}
	}
}

function draw() {
	//Will only reset if sand fills canvas
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

	// Clear nextGrid and nextVelocity for reuse
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			nextGrid[i][j] = 0;
			nextVelocity[i][j] = 1;
		}
	}

	for (let i = rows - 1; i >= 0; i--) {
		for (let j = 0; j < cols; j++) {
			let state = grid[i][j];
			let velocity = velocityGrid[i][j] + gravity;
			let spot = Math.floor(i + velocity);
			/*
	  if the state is sand
		if the unit below is not out of bounds and is in the air
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
				if (spot < rows && grid[spot][j] === 0) {
					nextGrid[spot][j] = state;
					nextVelocity[spot][j] = velocity;
				} else if (
					spot < rows &&
					grid[spot][j + 1] === 0 &&
					grid[spot][j - 1] === 0
				) {
					rand = Math.random() < 0.5 ? -1 : 1;
					nextGrid[spot][j + rand] = state;
					nextVelocity[spot][j + rand] = velocity;
				} else if (spot < rows && grid[spot][j + 1] === 0) {
					nextGrid[spot][j + 1] = state;
					nextVelocity[spot][j + 1] = velocity;
				} else if (spot < rows && grid[spot][j - 1] === 0) {
					nextGrid[spot][j - 1] = state;
					nextVelocity[spot][j - 1] = velocity;
				} else {
					nextGrid[i][j] = state;
					nextVelocity[i][j] = 1;
				}
			}
		}
	}
	// Swap references for next frame
	let tempGrid = grid;
	let tempVelocity = velocityGrid;
	grid = nextGrid;
	velocityGrid = nextVelocity;
	nextGrid = tempGrid;
	nextVelocity = tempVelocity;
}
