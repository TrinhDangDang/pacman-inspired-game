const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");




class Pacman {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = "";
    this.nextDirection = "";
   
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
  
  changeDirectionIfPossible(){
      if (this.direction == this.nextDirection) return;
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForward();
        if (this.hitwall()) {
            this.pauseMoving();
            this.direction = tempDirection;
        } else {
            this.pauseMoving();
        }
    }
    

  
  pauseMoving(){
    switch(this.direction){
      case "ArrowUp":
        this.y += 1;
        break;
      case "ArrowDown":
        this.y -= 1;
        break;
      case "ArrowLeft":
        this.x += 1;
        break;
      case "ArrowRight":
        this.x -= 1;
        break;
    }
  }
 
  moveForward(){
    switch(this.direction){
      case "ArrowUp":
        this.y -= 1
        break;
      case "ArrowDown":
        this.y += 1
        break;
      case "ArrowLeft":
        this.x -= 1
        break;
      case "ArrowRight":
        this.x += 1;
        break;
    }
  }
  
  eat(){
   if( map[Math.floor(this.y/blockSize)][Math.floor(this.x/blockSize)] == 2 ){
     map[Math.floor(this.y/blockSize)][Math.floor(this.x/blockSize)] = 3;
   }else{
     return;
   }
  }
}






window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowUp':
      pacman.nextDirection = 'ArrowUp';
      break;
    case 'ArrowDown':
      pacman.nextDirection = 'ArrowDown';
      break;
    case 'ArrowLeft':
      pacman.nextDirection = 'ArrowLeft';
      break;
    case 'ArrowRight':
      pacman.nextDirection = 'ArrowRight';
      break;
  }
});

class Ghost {
  constructor(x, y, width, height, color){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.direction = '';  // Start with no direction
    this.randomizeDirection();  // Initialize random direction
  }

  randomizeDirection() {
    const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const randomIndex = Math.floor(Math.random() * directions.length);
    this.direction = directions[randomIndex];  // Set initial random direction  // Make sure initial and next direction match
  }

  hitwall(){
    return (
      map[Math.floor(this.y / blockSize)][Math.floor(this.x / blockSize)] == 1 || 
      this.x + this.width > canvas.width || 
      this.y < 0 || 
      this.y + this.height > canvas.height
    );
  }

  changeDirectionIfPossible() {
    // If ghost hits a wall, randomize direction
    if (this.hitwall()) {
      this.pauseMoving();
      this.randomizeDirection();
    }
  }

  moveForward(){
    switch(this.direction){
      case "ArrowUp":
        this.y -= 1;
        break;
      case "ArrowDown":
        this.y += 1;
        break;
      case "ArrowLeft":
        this.x -= 1;
        break;
      case "ArrowRight":
        this.x += 1;
        break;
    }
  }

  pauseMoving() {
    switch(this.direction){
      case "ArrowUp":
        this.y += 1;
        break;
      case "ArrowDown":
        this.y -= 1;
        break;
      case "ArrowLeft":
        this.x += 1;
        break;
      case "ArrowRight":
        this.x -= 1;
        break;
    }
  }

  draw(){
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}



const pacman = new Pacman(5,5, 5, 5, '');
const ghosts = [new Ghost(20,20,5,5, 'blue'), new Ghost(20, 20, 5, 5, 'yello'), new Ghost(20,20,5,5, 'green'), new Ghost(20,20,5,5, 'purple'), new Ghost(20,20,5,5, 'pink')]
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawMap();
  drawFood();
  pacman.changeDirectionIfPossible();
  pacman.moveForward();
  pacman.eat();
  
  let gridX = Math.floor(pacman.x/blockSize);
  let gridY = Math.floor(pacman.y/blockSize);
  
  
    document.getElementById('output').textContent = `${pacman.x}   ${pacman.y}  ${gridX} ${gridY}`
  if (pacman.hitwall()){
    pacman.pauseMoving();
    document.getElementById('output').textContent = `${pacman.x}   ${pacman.y}`
  }
  pacman.draw();
  ghosts.forEach((ghost, index) => {
    ghost.changeDirectionIfPossible();
  ghost.moveForward();
  ghost.draw();
  })
  
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


function drawFood() {
  map.forEach(( row, y) => {
    row.forEach(( cell , x) => {
      if (cell == 2) {
         // Set a color for the food
        ctx.fillRect(x * blockSize, y * blockSize, 2, 2);
      }
    });
  });
}
function drawMap(){
map.forEach((row, y)=> {
  row.forEach((column, x)=> {
    if(column == 1){
      ctx.fillRect(x * blockSize, y*blockSize, blockSize, blockSize);
    }
  })
})
}


let gameInternal = setInterval(animate, 1000/24);






