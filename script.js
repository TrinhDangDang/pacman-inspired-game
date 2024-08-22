const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";



class Pacman {
  constructor(x, y, width, height, direction) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.direction = direction;
   
  }
  draw(){
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
  
  hitwall(){
    return (
      this.x <= 0 || 
      this.x + this.width >= canvas.width || 
      this.y <= 0 || 
      this.y + this.height >= canvas.height
    );
  }
 
  pauseMoving(){
    switch(this.direction){
      case "ArrowUp":
        this.y += 4
        break;
      case "ArrowDown":
        this.y -= 4
        break;
      case "ArrowLeft":
        this.x += 4
        break;
      case "ArrowRight":
        this.x -= 4;
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
const pacman = new Pacman(5,5, 10, 10, '')
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  pacman.moveForward();
    document.getElementById('output').textContent = `${pacman.x}   ${pacman.y}`
  if (pacman.hitwall()){
    pacman.pauseMoving();
    document.getElementById('output').textContent = `${pacman.x}   ${pacman.y}`
  }
  pacman.draw();
}



let gameInternal = setInterval(animate, 1000/60);

