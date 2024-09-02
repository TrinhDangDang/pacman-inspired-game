const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const spongebobFrames = document.getElementById("spongebob");


const blockSize = 70;
speed = blockSize/8;


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
    ctx.drawImage(spongebobFrames, 20, 49, 155, 132,  this.x - 10, this.y - 15, 200, 200 )
    ctx.restore()
  }
  
  hitwall(){
    return (
      map[Math.floor(this.y/blockSize)][Math.floor(this.x/blockSize)] == 1 ||
      map[Math.floor((this.y + blockSize - 0.1)/blockSize)][Math.floor(this.x/blockSize)] == 1 ||
      map[Math.floor(this.y /blockSize)][Math.floor((this.x + blockSize - 0.1)/blockSize)] == 1 ||
      map[Math.floor((this.y + blockSize - 0.1)/blockSize)][Math.floor((this.x + blockSize - 0.1)/blockSize)] == 1 ||
      this.x + this.width >= canvas.width || 
      this.y <= 0 || 
      this.y + this.height >= canvas.height
    );
  }
  
 hitGhost() {
    for (const ghost of ghosts) {
        if (
            Math.floor(ghost.x / blockSize) === Math.floor(this.x / blockSize) &&
            Math.floor(ghost.y / blockSize) === Math.floor(this.y / blockSize)
        ) {
            return true; // Collision detected
        }
    }
    return false; // No collision detected
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
        this.y += speed;
        break;
      case "ArrowDown":
        this.y -= speed;
        break;
      case "ArrowLeft":
        this.x += speed;
        break;
      case "ArrowRight":
        this.x -= speed;
        break;
    }
  }
 
  moveForward(){
    switch(this.direction){
      case "ArrowUp":
        this.y -= speed;
        break;
      case "ArrowDown":
        this.y += speed;
        break;
      case "ArrowLeft":
        this.x -= speed;
        break;
      case "ArrowRight":
        this.x += speed;
        break;
    }
  }
  
  isfinishEating() {
  return points === 221;
}
  
  eat(){
   if( map[Math.floor(this.y/blockSize)][Math.floor(this.x/blockSize)] == 2 || map[Math.floor(this.y/blockSize)][Math.floor(this.x/blockSize)] == 3){
     points ++;
     map[Math.floor(this.y/blockSize)][Math.floor(this.x/blockSize)] = 4;
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
    this.direction = this.randomizeDirection();  // Start with no direction
      // Initialize random direction
  }

  randomizeDirection() {
    const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];  // Set initial random direction  // Make sure initial and next direction match
  }

 hitwall(){
    return (
      map[Math.floor(this.y/blockSize)][Math.floor(this.x/blockSize)] == 1 ||
      map[Math.floor((this.y + blockSize - 0.1)/blockSize)][Math.floor(this.x/blockSize)] == 1 ||
      map[Math.floor(this.y /blockSize)][Math.floor((this.x + blockSize - 0.1)/blockSize)] == 1 ||
      map[Math.floor((this.y + blockSize - 0.1)/blockSize)][Math.floor((this.x + blockSize - 0.1)/blockSize)] == 1 ||
      this.x + this.width >= canvas.width || 
      this.y <= 0 || 
      this.y + this.height >= canvas.height
    );
  }

 
  changeDirectionIfPossible() {
    // If ghost hits a wall, randomize direction
    if (this.hitwall()) {
      this.pauseMoving();
      let nextDirection = this.randomizeDirection();
     	
      this.direction = nextDirection;
    }
  }

  moveForward(){
    switch(this.direction){
      case "ArrowUp":
        this.y -= speed;
        break;
      case "ArrowDown":
        this.y += speed;
        break;
      case "ArrowLeft":
        this.x -= speed;
        break;
      case "ArrowRight":
        this.x += speed;
        break;
    }
  }

  pauseMoving() {
    switch(this.direction){
      case "ArrowUp":
        this.y += speed;
        break;
      case "ArrowDown":
        this.y -= speed;
        break;
      case "ArrowLeft":
        this.x += speed;
        break;
      case "ArrowRight":
        this.x -= speed;
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


points = 0;
const pacman = new Pacman(blockSize, blockSize, blockSize, blockSize);
const ghosts = [new Ghost(280,280,70,70, 'blue'), new Ghost(280,280,70,70, 'yellow'), new Ghost(280,280,70,70, 'green'), new Ghost(280,280,70,70, 'purple'), new Ghost(280,280,70,70, 'pink')];
let isGamePaused = false;
function animate() {
  if (isGamePaused) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawMap();
  drawFood();
  pacman.changeDirectionIfPossible();
  pacman.moveForward();
  pacman.eat();
  
  
  
    document.getElementById('output').textContent = `${points}`;
  if (pacman.hitwall()){
    pacman.pauseMoving();
  }
  if (pacman.hitGhost()) {
    isGamePaused = true; // Pause the game

    // Reset positions
    reset();

    // Optionally show a game-over message
  

    setTimeout(() => {
      isGamePaused = false; // Resume the game after 2 seconds
    }, 3000); // 2000 milliseconds = 2 seconds

    return; // Exit the function to avoid further animation until resume
  }
  if (pacman.isfinishEating()) {
  while (ghosts.length > 0) {
    ghosts.pop();
  }
}
  pacman.draw();
  ghosts.forEach((ghost, index) => {
    ghost.changeDirectionIfPossible();
  ghost.moveForward();
  ghost.draw();
  })
  requestAnimationFrame(animate);
}


function reset(){
  
  
  pacman.x = 70;
  pacman.y = 70;
  pacman.direction = "";
  pacman.nextDirection = "";

  
  for (const ghost of ghosts){
    ghost.x = 280;
    ghost.y = 280;
  }
}

let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 3, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
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
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 3, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];





function drawFood() {
  map.forEach(( row, y) => {
    row.forEach(( cell , x) => {
      if (cell == 2) {
         // Set a color for the food
        ctx.fillRect(x * blockSize + 20, y * blockSize + 20, blockSize/3, blockSize/3);
      } 
      if(cell == 3){
        ctx.fillStyle = "black";
        ctx.fillRect(x * blockSize + 20, y * blockSize + 20, blockSize/2, blockSize/2);
      }
    });
  });
}
function drawMap(){
map.forEach((row, y)=> {
  row.forEach((column, x)=> {
    if(column == 1){
      ctx.fillStyle = "black"; // Blue color for the walls
        
        // Draw the main block of the wall
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);

      
    }
  })
})
}


requestAnimationFrame(animate);