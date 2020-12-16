/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

/* global createCanvas background windowWidth windowHeight random ellipse
fill line mouseX mouseY stroke color noStroke mouseIsPressed collideCircleCircle keyCode noFill
textSize text textAlign CENTER parse serial p5 portName serverConnected gotList gotData gotError gotOpen gotClose gotRawData*/

let enemyBombs = [];
let playerBombs = [];
let player;

let enemyRemove = [];
let playerRemove = [];

let backgroundColor = 0;

let diffuseBool = false;
let stealBool = false;

let enemyScore;
let playerScore;

let isGameOn = true;

let lastEnemy = [];

let endLineX; 
let endLineY; 

let stealClock;
let bombClock;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 40; i++) {
    enemyBombs.push(new EnemyBomb());
  }

  playerBombs.push(new Player(diffuseBool));

  enemyScore = new Scores(39);
  playerScore = new Scores(40);
  
  stealClock = new clock(10);
  bombClock = new clock(5);
  
  // console.log("hello")
  // parse(); 
  // Instantiate our SerialPort object
  // serial = new p5.SerialPort('192.168.86.36', 8081);
  // serial = new p5.SerialPort('localhost', 8000);
  serial = new p5.SerialPort(); 

  // Get a list the ports available
  // You should have a callback defined to see the results
  serial.list();

  // Assuming our Arduino is connected, let's open the connection to it
  // Change this to the name of your arduino's serial port
  serial.open(portName);

  // Here are the callbacks that you can register
  // When we connect to the underlying server
  serial.on("connected", serverConnected);

  // When we get a list of serial ports that are available
  // serial.on("list", gotList);
  // OR
  serial.onList(gotList);

  // When we some data from the serial port
  // serial.on("data", gotData);
  // OR
  serial.onData(gotData);
  
  // Callback to get the raw data, as it comes in for handling yourself
  // serial.on("rawdata", gotRawData);
  // OR
  // serial.onRawData(gotRawData);

  // When or if we get an error
  serial.on("error", gotError);
  // OR
  //serial.onError(gotError);

  // When our serial port is opened and ready for read/write
  serial.on("open", gotOpen);
  // OR
  //serial.onOpen(gotOpen);

  serial.on('close', gotClose);

}

function draw() {
  
  background(backgroundColor);
  
  // If using mouse, uncomment the next line 
  // updateLine(null, null); 

  if (isGameOn == true) {
    stealClock.draw(20, windowHeight - 90, "Steal");
    bombClock.draw(20, windowHeight - 120, "Bomb");
    enemyScore.draw(20, 40);
    playerScore.draw(20, windowHeight - 60);
    
    stealClock.countDown();
    bombClock.countDown();
    if(enemyScore.stock > 0) {
      let enemy = enemyBombs[enemyBombs.length - 1];
      enemy.draw();
      enemy.move();
      if (enemy.getY() > windowHeight / 2) {
        lastEnemy.push(enemy);
        enemyBombs.pop();
        enemyScore.decrease();
      }
    }
    

    for (let i = 0; i < lastEnemy.length; i++) {
      let bomb = lastEnemy[i];
      bomb.draw();
      bomb.move();
      bomb.offscreen();
    }

    for (let i = 0; i < playerBombs.length; i++) {
      player = playerBombs[i];
      player.draw();
      player.move();
      player.collision(i);
      player.offScreen(i);
    }

    for (let i = 0; i < enemyRemove.length; i++) {
      let removeIndex = enemyRemove[i];
      lastEnemy.splice(removeIndex, 1);
    }

    for (let i = 0; i < playerRemove.length; i++) {
      let removeIndex = playerRemove[i];
      playerBombs.splice(removeIndex, 1);
    }

    enemyRemove = [];
    playerRemove = [];
  } else {
    textSize(24);
    fill(255);
    stroke(255);
    textAlign(CENTER, CENTER);
    text(
      `Enemy health: ${enemyScore.health}`,
      windowWidth / 2,
      windowHeight / 2 - 40
    );
    text(
      `Player health: ${playerScore.health}`,
      windowWidth / 2,
      windowHeight / 2
    );
    if (playerScore.health <= 0) {
      text("ENEMY WON", windowWidth / 2, windowHeight / 2 + 40);
    } else {
      text("YOU WON", windowWidth / 2, windowHeight / 2 + 40);
    }
  }
}

function updateLine(x, y) {
  if (x == null) {
    endLineX = mouseX; 
  } else {
    endLineX = x;  
  } 
  
  if (y == null) {
    endLineY = mouseY; 
  } else {
    endLineY = y;  
  } 
}


function setDiffuse() {
  console.log("setDiffuse")
  diffuseBool = true;
  stealBool = false;
  playerBombs[playerBombs.length - 1] = new Player(diffuseBool);
}

function setBomb() {
  console.log("setBomb")
  diffuseBool = false;
  stealBool = false;
  playerBombs[playerBombs.length - 1] = new Player(diffuseBool);
}

function setSteal() {
  console.log("setSteal");
  stealBool = true;
  playerBombs[playerBombs.length - 1] = new Stealer();
}


function keyPressed() {
  // keyCode is d for diffuse
  if (keyCode == 68) {
    setDiffuse();
  }

  // keyCode is b for bomb
  if (keyCode == 66) {
    setBomb();
  }
  
  // keyCode is s for steal
  if (keyCode == 83) {
    setSteal();
  }
}

function launch() {
  console.log("launch"); 
  playerBombs[playerBombs.length - 1].launched = true;
  playerBombs[playerBombs.length - 1].endX = endLineX;
  playerBombs[playerBombs.length - 1].endY = endLineY;
  if(stealBool) playerBombs.push(new Stealer());
  else {
    playerBombs.push(new Player(diffuseBool));
    playerScore.decrease();
  }
}

function mousePressed() {
  if(stealBool) {
    if(stealClock.checkTime()) {
      launch();
      stealClock.begin();
    }
  }
  else if(diffuseBool == false) {
    if(bombClock.checkTime() && playerScore.stock > 0) {
      launch();
      bombClock.begin();
    }
  }
  else if(playerScore.stock > 0) {
    launch();
  }
}

class EnemyBomb {
  constructor() {
    this.x = random(windowWidth / 5, (4 * windowWidth) / 5);
    this.y = 0;
    this.r = 25;

    this.velocity = random(5, 8);
    this.isOffscreen = false;
  }

  move() {
    this.y = this.y + this.velocity;
  }

  draw() {
    if (this.isOffscreen == false) {
      stroke(color(255));
      fill(255);
      ellipse(this.x, this.y, this.r, this.r);
    }
  }

  offscreen() {
    if (this.y > windowHeight) {
      this.isOffscreen = true;
      playerScore.hit();
      this.y = 0;
      this.velocity = 0;
      // this.x = random(windowWidth / 5, (4 * windowWidth) / 5);
    }
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getR() {
    return this.r;
  }
}

class Player {
  constructor(diffuseBool) {
    this.x = windowWidth / 2;
    this.y = windowHeight - 30;
    this.r = 25;

    this.vel = 20;
    this.dirR = 0;

    this.launched = false;
    this.endX;
    this.endY;

    this.diffuseBool = diffuseBool;
    this.color;

    this.collided = false;

    this.index;
  }

  move() {
    if (this.launched == true) {
      let dX = this.endX - windowWidth / 2;
      let dY = this.endY - (windowHeight - 30);
      let cos = dX / Math.sqrt(dX * dX + dY * dY);
      let sin = dY / Math.sqrt(dX * dX + dY * dY);

      this.dirR += this.vel;

      this.x = windowWidth / 2 + this.dirR * cos;
      this.y = windowHeight - 30 + this.dirR * sin;
    }
  }

  draw() {
    if (this.collided || playerScore.stock <= 0) {
      noFill();
      noStroke();
    } else {
      // if (playerScore.stock > 0) {
      this.changeColor();
      fill(this.color);
      stroke(this.color);
      ellipse(this.x, this.y, this.r, this.r);
      line(windowWidth / 2, windowHeight - 30, endLineX, endLineY);
      // }
    }
  }

  changeColor() {
    if (!this.launched) {
      if (this.diffuseBool == true) {
        this.color = color(0, 255, 0);
      } else {
        this.color = color(255, 0, 0);
      }
    }
  }

  collision(index) {
    for (let i = 0; i < lastEnemy.length; i++) {
      if (
        collideCircleCircle(
          this.x,
          this.y,
          this.r,
          lastEnemy[i].getX(),
          lastEnemy[i].getY(),
          lastEnemy[i].getR()
        ) &&
        this.launched
      ) {
        console.log("collided");
        this.collided = true;

        backgroundColor = this.color;
        setTimeout(() => {
          backgroundColor = color(0);
        }, 250);

        if (this.y < windowHeight / 2 && this.diffuseBool == false) {
          enemyScore.hit();
        } else if (this.y >= windowHeight / 2 && this.diffuseBool == false) {
          playerScore.hit();
        }

        enemyRemove.push(i);
        playerRemove.push(index);
      }
    }

    if (
      collideCircleCircle(
        this.x,
        this.y,
        this.r,
        enemyBombs[enemyBombs.length - 1].getX(),
        enemyBombs[enemyBombs.length - 1].getY(),
        enemyBombs[enemyBombs.length - 1].getR()
      ) &&
      this.launched
    ) {
      console.log("collided");
      this.collided = true;

      backgroundColor = this.color;
      setTimeout(() => {
        backgroundColor = color(0);
      }, 250);

      if (this.y < windowHeight / 2 && this.diffuseBool == false) {
        enemyScore.hit();
      } else if (this.y >= windowHeight / 2 && this.diffuseBool == false) {
        playerScore.hit();
      }

      enemyBombs.pop();
      playerRemove.push(index);
    }
  }
  
  offScreen(index) {
    if(this.y < 0 || this.x < 0 || this.x > windowWidth) {
      playerRemove.push(index);
      if(this.diffuseBool == false && this.y < windowHeight) {
        backgroundColor = this.color;
        setTimeout(() => {
          backgroundColor = color(0);
        }, 250);
        enemyScore.hit();
      }
    }
  }
}

class Stealer extends Player {
  constructor() {
    super(false);
    this.stealPower = random(3, 5);
  }
  
  draw() {
    if (this.collided) {
      noFill();
      noStroke();
    } else {
      this.changeColor();
      fill(this.color);
      stroke(this.color);
      ellipse(this.x, this.y, this.r, this.r);
      line(windowWidth / 2, windowHeight - 30, endLineX, endLineY);
    }
  }
  
  changeColor() {
    this.color = color(0, 0, 255);
  }
  
  collision(index) {
    for (let i = 0; i < lastEnemy.length; i++) {
      if (
        collideCircleCircle(
          this.x,
          this.y,
          this.r,
          lastEnemy[i].getX(),
          lastEnemy[i].getY(),
          lastEnemy[i].getR()
        ) &&
        this.launched
      ) {
        console.log("collided");
        this.collided = true;

        backgroundColor = this.color;
        setTimeout(() => {
          backgroundColor = color(0);
        }, 250);

        playerRemove.push(index);
      }
    }

    if (
      collideCircleCircle(
        this.x,
        this.y,
        this.r,
        enemyBombs[enemyBombs.length - 1].getX(),
        enemyBombs[enemyBombs.length - 1].getY(),
        enemyBombs[enemyBombs.length - 1].getR()
      ) &&
      this.launched
    ) {
      console.log("collided");
      this.collided = true;

      backgroundColor = this.color;
      setTimeout(() => {
        backgroundColor = color(0);
      }, 250);
      
      playerRemove.push(index);
    }
    
  }
  
  
  offScreen(index) {
    //steal success
    if(this.y < 0 && enemyScore.stock > 0) {
      backgroundColor = this.color;
      setTimeout(() => {
        backgroundColor = color(0);
      }, 250);
      
      while(this.stealPower > 0 && enemyScore.stock > 0) {
        enemyScore.decrease();
        playerScore.increase();
        this.stealPower --;
        console.log("Steal!");
      }
    }
    
    // //remove from array
    // if(this.y < 0 || this.x < 0 || this.x > windowWidth) {
    //   playerRemove.push(index);
    // }
  }
  
  
}

class Scores {
  constructor(stock) {
    this.health = 100;
    this.stock = stock;
  }

  hit() {
    this.health -= 5;
    if (this.health <= 0) {
      isGameOn = false;
    }
  }

  decrease() {
    this.stock--;
  }
  
  increase() {
    this.stock++;
  }

  draw(x, y) {
    textSize(24);
    fill(255);
    stroke(255);
    text(`Health: ${this.health}`, x, y);
    text(`Stock: ${this.stock}`, x, y + 30);
  }
  
}

class clock {
  constructor(limit) {
    this.time = 0;
    this.limit = limit;
    this.wait = false;
    this.start = false;
  }
  
  begin() {
    this.time = this.limit + 1;
    this.start = true;
    this.wait = false;
  }
  
  countDown() {
    if(!this.checkTime() && this.start) {
      if(this.wait == false) {
        this.time --;
      }

      if(this.wait == false) {
        setTimeout(() => {
          this.wait = false;
        }, 1000);
        this.wait = true;
      }
    }
  }
  
  checkTime() {
    if(this.time == 0) {
      return true;
    }
  }
  
  
  draw(x, y, name) {
    textSize(24);
    fill(255);
    stroke(255);
    text(name + ` Clock: ${this.time}`, x, y);
  }
}
