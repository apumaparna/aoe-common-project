/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

/* global createCanvas background windowWidth windowHeight random ellipse
fill line mouseX mouseY stroke color noStroke mouseIsPressed*/

let enemyBombs = []; 
let playerBombs = []; 
let player; 

function setup() {
  createCanvas(windowWidth, windowHeight); 
  for (let i=0; i < 10; i++) {
    enemyBombs.push(new EnemyBomb()); 
  }
  
  playerBombs.push(new Player()); 
}

function draw() {
  // console.log(launched)
  background(0);
  
  for (let i=0; i < 10; i++) {
    let enemy = enemyBombs[i] ; 
    enemy.draw(); 
    enemy.move(); 
    enemy.offscreen(); 
  }
  
  for (let i = 0; i< playerBombs.length; i++) {   
    player = playerBombs[i]; 
    player.draw(); 
    player.move();
    player.removeLine(); 
  }
}

function keyPressed() {
  
}

function mousePressed() {
  console.log("mousepressed")
  playerBombs[playerBombs.length-1].launched = true; 
  playerBombs[playerBombs.length-1].endX = mouseX;
  playerBombs[playerBombs.length-1].endY = mouseY;
  
  if (mouseIsPressed) {
    playerBombs.push(new Player()); 
  }
}


class EnemyBomb {
  constructor() {
    this.x = random(windowWidth/5, 4*windowWidth/5); 
    this.y = 0; 
    this.r = 25; 
    
    this.velocity = random(2, 8); 
  }
  
  move() {
    this.y = this.y + this.velocity; 

  }
  
  draw(){
    fill(255); 
    ellipse(this.x, this.y, this.r, this.r); 
  }
  
  offscreen(){
    if (this.y>windowHeight) {
      this.y = 0; 
      this.x = random(windowWidth/5, 4*windowWidth/5); 
    }
  }
}

class Player {
  constructor() {
    this.x = windowWidth/2;
    this.y = windowHeight - 30;
    this.r = 25;
  
    this.xvel; 
    this.yvel; 
    
    this.color = color(255, 0, 0); 
    
    this.launched = false; 
    this.endX;
    this.endY;
  }
  
  move() {
    console.log("player.move")
    if (this.launched == true) {
      
      
      if (this.endX > windowWidth/2) {
        this.xvel = 2;
      }
      else {
        this.xvel = -2; 
      }
      let t = (this.endX - windowWidth/2)/this.xvel; 
      this.yvel = (this.endY - (windowHeight - 30))/t; 

      this.x = this.x + this.xvel; 
      this.y = this.y + this.yvel; 
    }
  }
  
  draw() {
    stroke(this.color); 
    line(windowWidth/2, windowHeight -30, mouseX, mouseY);
    
    fill(255, 0, 0); 
    ellipse(this.x, this.y, this.r, this.r);
  }
  
  removeLine() {
    if (this.launched == true) {
      noStroke(); 
      this.color = color(0); 
    }
  }
  
  
}