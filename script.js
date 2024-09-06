window.onload = () => {


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const spongebobFrames = document.getElementById("spongebob");
const patrickFrames = document.getElementById("patrick");


const blockSize = 70;
speed = blockSize/10;


class Pacman {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = "";
    this.nextDirection = "";
    this.frameCount = 1;
    this.currentFrame = 1;
    this.currentFrameX = 1;
    this.currentFrameY = 1;
    this.animationStartX = 17;
    this.animationStartY = 46;
    this.lastFrameTime = 0;
    this.frameDuration = 70;
    this.startAnimation();
    this.direct = '';
   
  }
  draw(){
    ctx.save()
    ctx.drawImage(spongebobFrames, (this.currentFrameX - 1) * 180 + this.animationStartX, (this.currentFrameY - 1) * 156 + this.animationStartY , 162, 138,  this.x - 90, this.y - 90, 250, 230 );
    ctx.restore()
  }


  changeAnimation(){

    //idle animation at:  x: 17, y: 46 width: 162, height 138, 12 frames, 180px horizontal between starting point at frame 1 and starting point of next frame, 156px vertical diffences between frames in first row and frames in second row.
    // run right: x: 17, y: 387 , frameCount: 8
    // run down: y: 1906, frameCount : 8
    // run up: y: 2091, frameCount : 8
   
    switch(this.direct){
        case "ArrowUp":
          if (this.animationStartY !== 2092) {
            this.currentFrame = 1; // Reset frame when switching animation
          }
          this.frameCount = 8;
          this.animationStartY = 2092;
          break;
        case "ArrowDown":
          if (this.animationStartY !== 1907) {
            this.currentFrame = 1; // Reset frame when switching animation
          }
          this.frameCount = 8;
          this.animationStartY = 1907;
          break;
        case "ArrowLeft":
          if (this.animationStartY !== 4904) {
            this.currentFrame = 1;
          }
          this.frameCount = 8;
          this.animationStartY = 4904;
          break;
        case "ArrowRight":
          if (this.animationStartY !== 387) {
            this.currentFrame = 1;
          }
          this.frameCount = 8;
          this.animationStartY = 387;
          break;
        case "":
          if (this.animationStartY !== 46) {
            this.currentFrame = 1;
          }
          this.frameCount = 12;
          this.animationStartY = 46;
          break;
      }
    this.currentFrame = this.currentFrame == this.frameCount? 1 : this.currentFrame + 1;
    if(this.currentFrame <= 8){
      this.currentFrameX = this.currentFrame;
      this.currentFrameY = 1;
    } else{
      this.currentFrameX = this.currentFrame - 8;
      this.currentFrameY = 2;
    }
  }

  startAnimation() {
    const animate = (timestamp) => {
        const deltaTime = timestamp - this.lastFrameTime;
        if (deltaTime > this.frameDuration){
          this.changeAnimation(); // Update the animation frame
          this.lastFrameTime = timestamp;
        }
        
        requestAnimationFrame(animate); // Loop the animation
    };
    this.lastFrameTime = performance.now(); //initialize the last frame time
    requestAnimationFrame(animate); // Start the animation loop
}
  

  hitwall(){
    return (
      map[Math.floor(this.y/blockSize)][Math.floor(this.x/blockSize)] == 1 ||
      map[Math.floor((this.y + blockSize - 0.1)/blockSize)][Math.floor(this.x/blockSize)] == 1 ||
      map[Math.floor(this.y /blockSize)][Math.floor((this.x + blockSize - 0.1)/blockSize)] == 1 ||
      map[Math.floor((this.y + blockSize - 0.1)/blockSize)][Math.floor((this.x + blockSize - 0.1)/blockSize)] == 1 
      // ||
    //   this.x + this.width >= canvas.width || 
    //   this.y <= 0 || 
    //   this.y + this.height >= canvas.height
    // 
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
        this.moveForward(); //move forward to test if it hit the wall
        if (this.hitwall()) {
          this.pauseMoving(); //if hit wall move back (using pauseMoving()) and keep going in the previous direction
          this.direction = tempDirection;  
        } 
        this.direct = this.direction;
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
      event.preventDefault();
      pacman.nextDirection = 'ArrowUp';
      break;
    case 'ArrowDown':
      event.preventDefault();
      pacman.nextDirection = 'ArrowDown';
      break;
    case 'ArrowLeft':
      event.preventDefault();
      pacman.nextDirection = 'ArrowLeft';
      break;
    case 'ArrowRight':
      event.preventDefault();
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
    this.nextDirection = this.randomizeDirection();  // Initialize random direction
    this.direction = "";
    this.currentFrameX = 1;
    this.lastFrameTime = 0;
    this.frameCount = 10;
    this.frameDuration = 70;
    this.startAnimation();

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
      map[Math.floor((this.y + blockSize - 0.1)/blockSize)][Math.floor((this.x + blockSize - 0.1)/blockSize)] == 1 
      // ||
      // this.x + this.width >= canvas.width || 
      // this.y <= 0 || 
      // this.y + this.height >= canvas.height
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
          
      } 
     
  }

  moveForward(){
    switch(this.direction){
      case "ArrowUp":
        this.y -= speed/2;
        break;
      case "ArrowDown":
        this.y += speed/2;
        break;
      case "ArrowLeft":
        this.x -= speed/2;
        break;
      case "ArrowRight":
        this.x += speed/2;
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
    this.nextDirection = this.randomizeDirection();
  }

  draw(){
    ctx.save();
    ctx.drawImage(patrickFrames, (this.currentFrameX - 1) * 100, 20 , 100, 110, this.x - 70, this.y - 70, 200, 200 );
    ctx.restore();
  }

  changeAnimation() {
    this.currentFrameX = this.currentFrameX == this.frameCount ? 1 : this.currentFrameX + 1;
    
}

  startAnimation() {
    const animate = (timestamp) => {
        const deltaTime = timestamp - this.lastFrameTime;
        if (deltaTime > this.frameDuration){
          this.changeAnimation(); // Update the animation frame
          this.lastFrameTime = timestamp;
        }
        
        requestAnimationFrame(animate); // Loop the animation
    };
    this.lastFrameTime = performance.now(); //initialize the last frame time
    requestAnimationFrame(animate); // Start the animation loop
}
}

points = 0;
const pacman = new Pacman(blockSize, blockSize, blockSize, blockSize);
const ghosts = [new Ghost(280,280,70,70, 'blue'), new Ghost(280,280,70,70, 'yellow'), new Ghost(280,280,70,70, 'green'), new Ghost(280,280,70,70, 'purple'), new Ghost(280,280,70,70, 'pink')];
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawMap();
  drawFood();
  pacman.changeDirectionIfPossible();
  pacman.moveForward();
  pacman.eat();
  
  
  
  document.getElementById('points').textContent = `POINTS:  ${points}`;
  if (pacman.hitwall()){
    pacman.pauseMoving();
    pacman.direct = "";
  }
  if (pacman.hitGhost()) {
    // Pause Pac-Man and ghosts
    pacman.pauseMoving();
    ghosts.forEach(ghost => ghost.pauseMoving());
  
    // Optionally show a game-over message or a collision message
    ctx.save();
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("Pac-Man Hit a Ghost!", canvas.width / 2, canvas.height / 2);
    ctx.restore();
  
    // Pause the game and reset after 2 seconds
    setTimeout(() => {
      // Clear any displayed message
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Reset positions and state
      reset();
  
      // Resume the game animation
      animate();
    }, 2000); // 2000 milliseconds = 2 seconds
  
    return; // Exit the function to avoid further animation until resume
  }
  
  if (pacman.isfinishEating()) {
  while (ghosts.length > 0) {
    ghosts.pop();
  }
}
  
  pacman.draw();
  ghosts.forEach(ghost => {
    ghost.changeDirectionIfPossible(); // Check if the ghost can change direction
    ghost.moveForward();               // Move the ghost in its current direction
    
    if (ghost.hitwall()) {
      ghost.pauseMoving();              // Pause and choose a new direction if a wall is hit
    }
    
    ghost.draw();                       // Draw the ghost on the canvas
  });
  
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
};


requestAnimationFrame(animate);

};