const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");




class Pacman {
  constructor(x, y, width, height, direction) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = direction;
   
  }
  draw(){
    ctx.save()
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height)
    
    ctx.restore()
  }
  
  hitwall(){
    
    
    return (
      map[Math.floor(this.y/blockSize)][Math.floor(this.x/blockSize)] == 1 || 
      this.x + this.width >= canvas.width || 
      this.y <= 0 || 
      this.y + this.height >= canvas.height
    );
  }
 
  pauseMoving(){
    switch(this.direction){
      case "ArrowUp":
        this.y += 0.5;
        break;
      case "ArrowDown":
        this.y -= 0.5;
        break;
      case "ArrowLeft":
        this.x += 0.5;
        break;
      case "ArrowRight":
        this.x -= 0.5;
        break;
    }
  }
 
  moveForward(){
    switch(this.direction){
      case "ArrowUp":
        this.y -= 0.5
        break;
      case "ArrowDown":
        this.y += 0.5
        break;
      case "ArrowLeft":
        this.x -= 0.5
        break;
      case "ArrowRight":
        this.x += 0.5;
        break;
    }
  }
}

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      pacman.direction = 'ArrowUp';
      break;
    case 'ArrowDown':
      pacman.direction = 'ArrowDown';
      break;
    case 'ArrowLeft':
      pacman.direction = 'ArrowLeft';
      break;
    case 'ArrowRight':
      pacman.direction = 'ArrowRight';
      break;
  }
});
const pacman = new Pacman(5,5, 4, 4, '')
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  pacman.moveForward();
  let gridX = Math.floor(pacman.x/blockSize);
  let gridY = Math.floor(pacman.y/blockSize);
  drawMap();
    document.getElementById('output').textContent = `${pacman.x}   ${pacman.y}  ${gridX} ${gridY}`
  if (pacman.hitwall()){
    pacman.pauseMoving();
    document.getElementById('output').textContent = `${pacman.x}   ${pacman.y}`
  }
  pacman.draw();
}



let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const blockSize = 5;

function drawMap(){
map.forEach((row, y)=> {
  row.forEach((column, x)=> {
    if(column == 1){
      ctx.fillRect(x * blockSize, y*blockSize, blockSize, blockSize)
    }
  })
})
}

drawMap();

let gameInternal = setInterval(animate, 1000/60);






