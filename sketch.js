function make2DArray(cols, rows){
  let arr = new Array(rows)
  for (let i = 0; i<arr.length; i++){
    arr[i] = new Array(cols).fill(0);
  }
  return arr;
}

let grid;
let w = 10; // Size of 1 grid square
let cols, rows;


function setup() {
  createCanvas(600, 600);
  cols = width/w;
  rows = height/w;
  grid = make2DArray(cols, rows)

  for (let i = 0; i < rows; i++){
    for (let j=0; j < cols; j++){
      grid[i][j] = 0
    }
  }

}

function mouseDragged(){
  let col = floor(mouseX / w);
  let row = floor(mouseY / w);
  grid[row][col] = 1
}

function draw() {
  background(0);

  for (let i = 0; i < rows; i++){
    for (let j=0; j < cols; j++){
      stroke(255);
      fill(grid[i][j]*255);
      let x = j*w;
      let y = i*w;
      square(x, y, w);
    }
  }

  // 0 = black, 1 = white
  let nextGrid = make2DArray(cols, rows);
  for (let i = 0; i < rows; i++){
    for (let j = 0; j < cols; j++){
      let state = grid[i][j];
      
      if(state === 1){
        if((i+1) < rows && grid[i+1][j] === 0){
        // nextGrid[i][j] = 0;
        nextGrid[i+1][j] = 1;

        } else {
        nextGrid[i][j] = 1;
        } 
      }
    }
  }
  grid = nextGrid;
}

