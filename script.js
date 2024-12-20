


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const spongebobFrames = document.getElementById("spongebob");
const patrickFrames = document.getElementById("patrick");
const bfsMovementButton = document.getElementById("bfs-movement-when-in-range");
const randomMovementButton = document.getElementById("random-movement"); // Make sure this ID matches your HTML
// const dfsMovementButton = document.getElementById("dfs-movement")
const displayalgorithm = document.getElementById("display-message"); 
const eatSound = document.getElementById("eatsound");
const backgroundSound = document.getElementById("backgroundsound");
const gameOverSound = document.getElementById("gameOverSound");
const touchGhostSound = document.getElementById("touchGhost");
const winSound = document.getElementById("winSound");

let randomButtonValue = true;
let bfsButtonValue = false;
// let dfsButtonValue = false;
backgroundSound.volume = 0.4;

bfsMovementButton.addEventListener("click", function(){
  displayalgorithm.textContent = "You are currently selecting Breadth First Search movement for Patrick to chase after SpongeBob";
  bfsButtonValue = true;
  randomButtonValue = false;
  // dfsButtonValue = false;
});

randomMovementButton.addEventListener("click", function(){
  displayalgorithm.textContent = "You are currently selecting Random Movement, Patrick will move randomly until he reaches SpongeBob";
  randomButtonValue = true;
  bfsButtonValue = false;
  // dfsButtonValue = false;
});

// dfsMovementButton.addEventListener("click", () => {
//   displayalgorithm.textContent = "hello"
//   randomButtonValue = false;
//   bfsButtonValue = false;
//   dfsButtonValue = true;
// } )

let animationId;


const blockSize = 70;
let speed = blockSize/10;



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
    this.direct = '';
   
  }
  draw(){
    ctx.save()
    ctx.drawImage(spongebobFrames, (this.currentFrameX - 1) * 180 + this.animationStartX, (this.currentFrameY - 1) * 156 + this.animationStartY , 162, 138,  this.x - blockSize -30, this.y - blockSize -30, 250, 230 );
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

 updateAnimation(timestamp){
  const deltaTime = timestamp - this.lastFrameTime;
  if (deltaTime > this.frameDuration) {
    this.changeAnimation();
    this.lastFrameTime = timestamp
  }
 }
  

  hitwall(){
    return (
      map[Math.floor(this.y/blockSize)][Math.floor(this.x/blockSize)] == 1 ||
      map[Math.floor((this.y + blockSize - 0.1)/blockSize)][Math.floor(this.x/blockSize)] == 1 ||
      map[Math.floor(this.y /blockSize)][Math.floor((this.x + blockSize - 0.1)/blockSize)] == 1 ||
      map[Math.floor((this.y + blockSize - 0.1)/blockSize)][Math.floor((this.x + blockSize - 0.1)/blockSize)] == 1 
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
    if (this.x < 0) {
      this.x = canvas.width - 4;
    } else if (this.x > canvas.width) {
      this.x = 0;
    }
    
}
  

  
eat() {
  let row = Math.floor(this.y / blockSize);
  let col = Math.floor(this.x / blockSize);
  
  // Check if the current position contains food (2) or collectible (3)
  if (map[row][col] == 2) {
    eatSound.play();
    points++;
    map[row][col] = 4;  // Mark as eaten
      // Increment points
  } 
  if(map[row][col] == 3){
    eatSound.play();
    points = points + 2;
    map[row][col] = 4;
    
  }
}
isfinishedEating() {
  for(let i = 0; i < map.length; i++){
    for(let j = 0; j < map[0].length; j++){
      if(map[i][j] == 2 || map[i][j] == 3 ){
        return false;
      }
    }
  }
  return true;
}
}



// Keydown event for arrow keys
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

// Variables to store touch start and end positions
let touchStartX = 0;
let touchStartY = 0;

// Touchscreen input for Pac-Man
document.addEventListener('touchstart', function(e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;
  handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
}, { passive: true });

function handleSwipe(startX, startY, endX, endY) {
  const diffX = endX - startX;
  const diffY = endY - startY;

  // Determine if the swipe is more horizontal or vertical
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe
    if (diffX > 0) {
      pacman.nextDirection = 'ArrowRight'; // Swipe right
    } else {
      pacman.nextDirection = 'ArrowLeft';  // Swipe left
    }
  } else {
    // Vertical swipe
    if (diffY > 0) {
      pacman.nextDirection = 'ArrowDown';  // Swipe down
    } else {
      pacman.nextDirection = 'ArrowUp';    // Swipe up
    }
  }
}

class Ghost {
  constructor(x, y, width, height, range){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.nextDirection = this.randomizeDirection();  // Initialize random direction
    this.direction = this.randomizeDirection();
    this.currentFrameX = 1;
    this.lastFrameTime = 0;
    this.frameCount = 10;
    this.frameDuration = 70;
    this.range = range;
    // this.startAnimation();

  }

  randomizeDirection() {
    const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];  // Set initial random direction  // Make sure initial and next direction match
  }

 hitwall(){
    return (
      map[Math.floor(this.y/blockSize)][Math.floor(this.x/blockSize)] == 1 || // top left corner
      map[Math.floor((this.y + blockSize - 0.1)/blockSize)][Math.floor(this.x/blockSize)] == 1 || //bottom left corner
      map[Math.floor(this.y /blockSize)][Math.floor((this.x + blockSize - 0.1)/blockSize)] == 1 || //top right
      map[Math.floor((this.y + blockSize - 0.1)/blockSize)][Math.floor((this.x + blockSize - 0.1)/blockSize)] == 1 //bottom right
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

  moveForward() {
 // Only move if there's no wall
        switch (this.direction) {
            case "ArrowUp":
                this.y -= speed / 2;
                break;
            case "ArrowDown":
                this.y += speed / 2;
                break;
            case "ArrowLeft":
                this.x -= speed / 2;
                break;
            case "ArrowRight":
                this.x += speed / 2;
                break;
        }

        // Handle screen wrap-around
        if (this.x < 0) {
          this.x = canvas.width - 4;
        } else if (this.x > canvas.width) {
            this.x = 0;
        }
}


  pauseMoving() {
    switch(this.direction){
      case "ArrowUp":
        this.y += speed/2;
        break;
      case "ArrowDown":
        this.y -= speed/2;
        break;
      case "ArrowLeft":
        this.x += speed/2;
        break;
      case "ArrowRight":
        this.x -= speed/2;
        break;
    } 
  
  }
  isInRange(){
    let xDistance = Math.abs(parseInt(pacman.x/blockSize) - parseInt(this.x/blockSize));
    let yDistance = Math.abs(parseInt(pacman.y/blockSize) - parseInt(this.y/blockSize));

    return Math.sqrt(xDistance*xDistance + yDistance*yDistance) <= this.range
  }
  // CANNOT FIGURE DEPTH FIRST SEARCH, IT DOESNT FIND THE SHORTEST PATH, RETURNING UP THEN DOWN , LEFT THEN RIGHT, AND THEN RECALCULATE THEN GET STUCKED.  SWITCHING TO DIJKSTRA ALGORITHM INSTEAD 
  // dfs(map, targetX, targetY){
  //   let targetx = parseInt(targetX / blockSize);
  //   let targety = parseInt(targetY / blockSize);
  //   let map1 = map.map(row => row.slice());

  //   const stack = [{
  //     x: parseInt(this.x / blockSize), //x is the column in grid because x goes from left to right in the canvas
  //     y: parseInt(this.y / blockSize),// y is the row in grid, because y in canvas goes from top to bottom, very not intuitive but there are so much to fix
  //     moves: [],
  //   }]
  //   // console.log("Starting Stack", [...stack])
    
  //   while (stack.length > 0) {
  //     let topOfStack = stack.pop();
  //     // console.log(topOfStack)
  //     map1[topOfStack.y][topOfStack.x] = 9;
  //     map1.forEach((row, y)=> {
  //       row.forEach((cell, x)=> {
  //         if(cell == 9){
  //           ctx.fillStyle = "red"; 
              
  //             // Draw the main block of the wall
  //             ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
  //         }
  //       })
  //     })
  //     // Check if the target is reached
  //     if (topOfStack.x == targetx && topOfStack.y == targety) {
  //         // console.log("FOUND IT")
  //         return topOfStack.moves[0]; // Return the first move towards the target
  //     } else {
  //       // Add the valid neighboring cells to the stack
  //       let neighborCells = this.addAdjacentCellss(topOfStack, map1, targetX, targetY);
  //       // console.log(neighborCells)
  //       neighborCells.reverse()
  //       for (let i = 0; i < neighborCells.length; i++) {
  //         // console.log("adding cell:",neighborCells[i])
  //         stack.push(neighborCells[i]);
  //     }
  //     // console.log("Updated Stack",[...stack])
  //     } 
  // }

  // return null; 
  // }

  bfs(map, targetX, targetY) {
    let targetx = parseInt(targetX / blockSize);
    let targety = parseInt(targetY / blockSize);

    let mp = map.map(row => row.slice());  // Deep copy of the map

    let queue = [{
        x: parseInt(this.x / blockSize), //x is the column in grid because x goes from left to right in the canvas
        y: parseInt(this.y / blockSize),// y is the row in grid, because y in canvas goes from top to bottom, very not intuitive but there are so much to fix
        moves: [],
    }];

    while (queue.length > 0) {
        let popped = queue.shift();
        mp.forEach((row, y)=> {
        row.forEach((cell, x)=> {
          if(cell == 9){
            ctx.fillStyle = "red"; 
              
              // Draw the main block of the wall
              ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
          }
        })
      })
        // If the current position matches the target position, return the first move in the sequence
        if (popped.x == targetx && popped.y == targety) { //the target is found 
            return popped.moves[0];  // First move towards the target
        } else {
            // Mark the current cell as visited
            mp[popped.y][popped.x] = 9;

            // Add the valid neighboring cells to the queue
            let neighborCells = this.addAdjacentCells(popped, mp);
            for (let i = 0; i < neighborCells.length; i++) {
                queue.push(neighborCells[i]);
            }
        }
    }

    return null;  
}


addAdjacentCells(popped, mp) {
    let queue = [];
    let numRows = mp.length;
    let numColumns = mp[0].length;


     // Check up movement (y - 1)
     if (popped.y - 1 >= 0 && mp[popped.y - 1][popped.x] != 9 && mp[popped.y - 1][popped.x] != 1) {
      let tempMoves = popped.moves.slice();
      tempMoves.push("ArrowUp");
      queue.push({ x: popped.x, y: popped.y - 1, moves: tempMoves });
    }


    // Check right movement (x + 1)
    if (popped.x + 1 < numColumns && mp[popped.y][popped.x + 1] != 9 && mp[popped.y][popped.x + 1] != 1) {
      let tempMoves = popped.moves.slice();
      tempMoves.push("ArrowRight");
      queue.push({ x: popped.x + 1, y: popped.y, moves: tempMoves });
    }

    // Check down movement (y + 1)
    if (popped.y + 1 < numRows && mp[popped.y + 1][popped.x] != 9 && mp[popped.y + 1][popped.x] != 1) {
      let tempMoves = popped.moves.slice();
      tempMoves.push("ArrowDown");
      queue.push({ x: popped.x, y: popped.y + 1, moves: tempMoves });
    }
    // Check left movement (x - 1)
    if (popped.x - 1 >= 0 && mp[popped.y][popped.x - 1] != 9 && mp[popped.y][popped.x - 1] != 1) {
        let tempMoves = popped.moves.slice();
        tempMoves.push("ArrowLeft");
        queue.push({ x: popped.x - 1, y: popped.y, moves: tempMoves });
    }
    return queue;
}


//MEANT TO ADD CELLS FOR DEPTH FIRST SEARCH BUT DEPTH FIRST SEARCH IS SCRATCHED OUT 
// addAdjacentCellss(popped, mp, targetx, targety) {
//   let queue = [];
//   let numRows = mp.length;
//   let numColumns = mp[0].length;


//    // Check up movement (y - 1)
//    if (popped.y - 1 >= 0 && mp[popped.y - 1][popped.x] != 9 && mp[popped.y - 1][popped.x] != 1) {
//     let tempMoves = popped.moves.slice();
//     tempMoves.push("ArrowUp");
//     queue.push({ x: popped.x, y: popped.y - 1, moves: tempMoves });
//   }


//   // Check right movement (x + 1)
//   if (popped.x + 1 < numColumns && mp[popped.y][popped.x + 1] != 9 && mp[popped.y][popped.x + 1] != 1) {
//     let tempMoves = popped.moves.slice();
//     tempMoves.push("ArrowRight");
//     queue.push({ x: popped.x + 1, y: popped.y, moves: tempMoves });
//   }

//   // Check down movement (y + 1)
//   if (popped.y + 1 < numRows && mp[popped.y + 1][popped.x] != 9 && mp[popped.y + 1][popped.x] != 1) {
//     let tempMoves = popped.moves.slice();
//     tempMoves.push("ArrowDown");
//     queue.push({ x: popped.x, y: popped.y + 1, moves: tempMoves });
//   }
//   // Check left movement (x - 1)
//   if (popped.x - 1 >= 0 && mp[popped.y][popped.x - 1] != 9 && mp[popped.y][popped.x - 1] != 1) {
//       let tempMoves = popped.moves.slice();
//       tempMoves.push("ArrowLeft");
//       queue.push({ x: popped.x - 1, y: popped.y, moves: tempMoves });
//   }

//   // Calculate and store the heuristic for each neighbor
//   queue.forEach(cell => {
//     cell.distance = Math.abs(cell.x - targetx) + Math.abs(cell.y - targety);
// });

// // Sort neighbors by their Manhattan distance to the target
// // If you want the closest neighbor to be explored first by DFS, you may sort ascending
// queue.sort((a, b) => a.distance - b.distance);
//   return queue;
// }


  draw(){
    ctx.save();
    ctx.drawImage(patrickFrames, (this.currentFrameX - 1) * 100, 20 , 100, 110, this.x - 70, this.y - 70, 200, 200 );
    ctx.restore();
  }

  changeAnimation() {
    this.currentFrameX = this.currentFrameX == this.frameCount ? 1 : this.currentFrameX + 1;
    
}

  //   startAnimation() {
  //     const animate = (timestamp) => {
  //         const deltaTime = timestamp - this.lastFrameTime;
  //         if (deltaTime > this.frameDuration){
  //           this.changeAnimation(); // Update the animation frame
  //           this.lastFrameTime = timestamp;
  //         }
          
  //         requestAnimationFrame(animate); // Loop the animation
  //     };
  //     this.lastFrameTime = performance.now(); //initialize the last frame time
  //     requestAnimationFrame(animate); // Start the animation loop
  // }

  updateAnimation(timestamp) {
    const deltaTime = timestamp - this.lastFrameTime;
    if (deltaTime > this.frameDuration) {
      this.changeAnimation(); // Update the animation frame
      this.lastFrameTime = timestamp;
    }
  }
}



function displayMessage(message){
    ctx.save();
    ctx.font = "bold 45px 'emulogic'";
    ctx.fillStyle= "yellow";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; 

    let messageX = canvas.width/2;
    let messageY = canvas.height/2 - 200;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.strokeText(`${message}`, messageX, messageY);
    ctx.fillText(`${message}`, messageX, messageY);
    ctx.restore()
    return;
}


function animate(timestamp) {  //main function that runs the game
  backgroundSound.play();
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  drawMap();
  
  pacman.updateAnimation(timestamp);
  ghosts.forEach((ghost) => ghost.updateAnimation(timestamp));

  if (!gameStarted) {
    displayMessage("Ready!");
    pacman.draw();
    ghosts.forEach(ghost => ghost.draw());
    gameStarted = true;
    setTimeout(() => {
      animate(); // Resume the game loop after delay
    }, 2000);

    return; // Exit the function to pause the game until timeout
  }
  
  pacman.changeDirectionIfPossible();
  pacman.moveForward();
  pacman.eat();
  drawFood(); //move drawfood after eat() so the last piece of food is removed after eaten before winning message
  
  document.getElementById('points').textContent = `POINTS:  ${points}`;
  if (pacman.hitwall()){
    pacman.pauseMoving();
    pacman.direct = "";
  }
  if (pacman.hitGhost()) {
    // Pause Pac-Man and ghosts
    touchGhostSound.play();
    pacman.pauseMoving();
    ghosts.forEach(ghost => ghost.pauseMoving());
    // Pause the game and reset after 2 seconds
    lives--;
    updateLives();
    displayMessage("HIT!");
    
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
  if (lives === 0) {
    displayMessage("Game Over");
    gameOverSound.play();
     // Stop the game loop
     cancelAnimationFrame(animationId); 
    // Give a delay before resetting to show the message
    setTimeout(() => {
        restartGame();  // Reset the game state
    }, 2000);  // 2 seconds delay for displaying the "Game Over" message
    
    return;  // Exit the function to stop further animation
}
  if (pacman.isfinishedEating()) {
    winSound.play();
    displayMessage("You won!")
    cancelAnimationFrame(animationId);
    setTimeout(() => {
      restartGame();  // Reset the game state
  }, 2000);  // 2 seconds delay for displaying the "Game Over" message
 
  return;  // Exit the function to stop further animation

}
  // pacman.eat(); //put eat after checking if all the food are eaten to make sure that the last piece of food is not left behind, so food is drawn , if you eat the food before isfinishedEating, the game win is triggered before the last piece of food is removed, (you can also move drawfood down after eat)
  pacman.draw();
  ghosts.forEach(ghost => {
  if(bfsButtonValue){ //if Breadth First search button is selected, the ghosts uses breadthfirstsearch to chase after pacman when in range
    if (!ghost.isInRange()) {
      ghost.changeDirectionIfPossible();
      ghost.moveForward();
      if (ghost.hitwall()) {
          ghost.pauseMoving();
          ghost.nextDirection = ghost.randomizeDirection(); //when the ghost hit wall, randomize direction
      }
  } else {
      // If in range, use BFS to chase Pac-Man
      let bfsDirection = ghost.bfs(map, pacman.x, pacman.y);
      console.log(bfsDirection)
      if (bfsDirection) {
          ghost.nextDirection = bfsDirection;
          // console.log(ghost.nextDirection);
          ghost.changeDirectionIfPossible();
          ghost.moveForward();
          if (ghost.hitwall()) {
              ghost.pauseMoving();
          }
      }
  }
// } else if (dfsButtonValue) {
//       if (!ghost.isInRange()) {
//         ghost.changeDirectionIfPossible();
//         ghost.moveForward();
//         if (ghost.hitwall()) {
//             ghost.pauseMoving();
//             ghost.nextDirection = ghost.randomizeDirection(); //when the ghost hit wall, randomize direction
//         }
//     } 
//       if(ghost.isInRange()){
//         let dfsDirection = ghost.dfs(map, pacman.x, pacman.y);
//         console.log(dfsDirection)
//         if (dfsDirection) {
//             ghost.nextDirection = dfsDirection;
//             // console.log(ghost.nextDirection);
//             ghost.changeDirectionIfPossible();
//             ghost.moveForward();
//             if (ghost.hitwall()) {
//                 ghost.pauseMoving();
//             }
//         }
//     }
} else{ //default movement for ghosts is random
   ghost.changeDirectionIfPossible();
   ghost.moveForward();
   if (ghost.hitwall()) {
       ghost.pauseMoving();
       ghost.nextDirection = ghost.randomizeDirection(); 
}
 }
 ghost.draw();
  
});
  
  animationId = requestAnimationFrame(animate); //
}


function reset(){
  pacman.x = 700;
  pacman.y = 700;
  pacman.direction = "";
  pacman.nextDirection = "";
  pacman.direct = "";

  ghosts.forEach((ghost, index) => {
    ghost.x = 280; // Or initial spawn position for ghosts
    ghost.y = 280;
    ghost.direction = ghost.randomizeDirection(); // Reset ghost movement direction
    ghost.nextDirection = ghost.randomizeDirection();
    range = 6 + index;
  });
}

function restartGame(){
  cancelAnimationFrame(animationId);
  pacman.x = 700;
  pacman.y = 700;
  pacman.direction = "";
  pacman.nextDirection = "";
  pacman.direct = "";
  displayalgorithm.textContent = "Select an algorithm that the Patrick will use to catch up with SpongeBob";
  // Reset ghost positions
  ghosts.forEach((ghost, index) => {
    ghost.x = 280; // Or initial spawn position for ghosts
    ghost.y = 280;
    ghost.direction = ghost.randomizeDirection(); // Reset ghost movement direction
    ghost.nextDirection = ghost.randomizeDirection();
    range = 6 + index;
  });
  randomButtonValue = false;
  bfsButtonValue = false;
  // dfsButtonValue = false;

  // Reset points and lives
  points = 1;
  lives = 3;
  updateLives();
  // Reset map to its initial state (replace food-eaten spaces)
  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 3, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 5, 5, 5, 5, 5, 5, 5, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
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
  gameStarted = false;
  startGame();
}




function updateLives() {
  const livesElement = document.getElementById('hearts');
  let hearts = '❤️ '.repeat(lives);  // Repeat the heart emoji based on lives
  livesElement.innerHTML = `${hearts}`;
}


function drawFood() {
  map.forEach(( row, y) => {
    row.forEach(( cell , x) => {
      if (cell == 2) {
         // Set a color for the food
        ctx.save();
        ctx.fillStyle ="blue";
        ctx.fillRect(x * blockSize + 25, y * blockSize + 25, blockSize/5, blockSize/5);
        ctx.restore();
      } 
      if(cell == 3){
        ctx.save();
        ctx.fillStyle = "blue";
        ctx.fillRect(x * blockSize + 30, y * blockSize + 30, blockSize/3, blockSize/3);
        ctx.restore();
      }
    });
  });
}

function drawMap(){
  map.forEach((row, y)=> {
    row.forEach((cell, x)=> {
      if(cell == 1){
        ctx.fillStyle = "black"; 
          
          // Draw the main block of the wall
          ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
      }
    })
  })
};




let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 3, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 1, 2, 1, 5, 5, 5, 5, 5, 5, 5, 1, 2, 1, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
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



function startGame() {  //draw the map and the foods and display the start game button but does not actually start the game until player click the start button
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
  drawMap();
  drawFood();
  displayMessage("Start Game");

  const messageX = canvas.width / 2;
  const messageY = canvas.height / 2 - 200;
  const clickableAreaWidth = 300;  // Enlarged clickable area width
  const clickableAreaHeight = 100;  // Enlarged clickable area height

  // Remove any existing click listener before adding a new one
  canvas.removeEventListener('click', handleStartClick);
  canvas.addEventListener('click', handleStartClick);
}







function handleStartClick(event) { //clicking on start game to actually start the game which is the animate function
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const scaledX = x * scaleX;
  const scaledY = y * scaleY;

  const messageX = canvas.width / 2;
  const messageY = canvas.height / 2 - 200;
  const clickableAreaWidth = 300;
  const clickableAreaHeight = 100;

  // Check if the click is within the enlarged "Start" message area
  if (
      scaledX >= messageX - clickableAreaWidth / 2 &&
      scaledX <= messageX + clickableAreaWidth / 2 &&
      scaledY >= messageY - clickableAreaHeight / 2 &&
      scaledY <= messageY + clickableAreaHeight / 2
  ) {
    
      animate(); //start the game
  }
}





let lives = 3;
let points = 0;
let gameStarted = false;
let ghosts = [];
const pacman = new Pacman(700, 700, blockSize, blockSize);
// let ghostCount = 5;
// for (let i = 0; i < ghostCount; i++) {
//   let range = 6 + i;  // Vary the range for each ghost (starting from 6)
//   let newGhost = new Ghost(
//       280,         // X position/ the column
//       280,         // Y position/ the row in grid if after conversion
//       70,     // Width of the ghost
//       70,     // Height of the ghost
//       range             // Range (detection radius) increases for each ghost
//   );
  
//   ghosts.push(newGhost);  // Add the ghost to the array
// }
let newGhost = new Ghost(
  280,
  280,
  70,
  70,
  range = 6,
)
ghosts.push(newGhost)


startGame();

