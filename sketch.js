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
let c;
let rand;

function setup() {
  createCanvas(600, 800);
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
  background(color(135, 206, 255));

  for (let i = 0; i < rows; i++){
    for (let j=0; j < cols; j++){
      noStroke()

      if (grid[i][j] > 0){
        // let r = Math.floor(Math.random() * 254 + 1);
        // let g = Math.floor(Math.random() * 254 + 1);
        // let b = Math.floor(Math.random() * 254 + 1);
        // c = color(r, g, b);
        // fill(c);
        fill(color(250))
      } else{
        fill(color(135, 206, 255))
      }
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
      
      /*
      if the state is 1
        check if the row below is not out of bounds and air
      else
        we hit ground
      */
      if(state !== 0){
        if((i+1) < rows && grid[i+1][j] === 0){
          nextGrid[i+1][j] = grid[i][j];
        } else if ((i+1) < rows && grid[i+1][j+1] === 0 && grid[i+1][j-1] === 0){
          rand = Math.random() < 0.5 ? -1 : 1;
          nextGrid[i+1][j+rand] = grid[i][j];
        } else if ((i+1) < rows && grid[i+1][j+1] === 0){
          nextGrid[i+1][j+1] = grid[i][j];
        } else if ((i+1) < rows && grid[i+1][j-1] === 0){
          nextGrid[i+1][j-1] = grid[i][j];
        } else {
          nextGrid[i][j] = grid[i][j];
        } 
      }
    }
  
  }
  grid = nextGrid;
}
