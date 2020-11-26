/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

/* global createCanvas background windowWidth windowHeight random ellipse
fill line mouseX mouseY stroke color noStroke mouseIsPressed collideCircleCircle*/

let enemyBombs = [];
let playerBombs = [];
let player;

let backgroundColor = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 10; i++) {
    enemyBombs.push(new EnemyBomb());
  }

  playerBombs.push(new Player());
}

function draw() {
  background(backgroundColor);

  for (let i = 0; i < 10; i++) {
    let enemy = enemyBombs[i];
    enemy.draw();
    enemy.move();
    enemy.offscreen();
  }

  for (let i = 0; i < playerBombs.length; i++) {
    player = playerBombs[i];
    player.draw();
    player.move();
    player.collision();
  }

  stroke(color(255, 0, 0));
  line(windowWidth / 2, windowHeight - 30, mouseX, mouseY);
}

function keyPressed() {
  
}

function mousePressed() {
  playerBombs[playerBombs.length - 1].launched = true;
  playerBombs[playerBombs.length - 1].endX = mouseX;
  playerBombs[playerBombs.length - 1].endY = mouseY;

  playerBombs.push(new Player());
}

class EnemyBomb {
  constructor() {
    this.x = random(windowWidth / 5, (4 * windowWidth) / 5);
    this.y = 0;
    this.r = 25;

    this.velocity = random(0.5, 3);
  }

  move() {
    this.y = this.y + this.velocity;
  }

  draw() {
    stroke(color(255));
    fill(255);
    ellipse(this.x, this.y, this.r, this.r);
  }

  offscreen() {
    if (this.y > windowHeight) {
      this.y = 0;
      this.x = random(windowWidth / 5, (4 * windowWidth) / 5);
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
  constructor() {
    this.x = windowWidth / 2;
    this.y = windowHeight - 30;
    this.r = 25;

    this.vel = 10;
    this.dirR = 0;

    this.color = color(255, 0, 0);

    this.launched = false;
    this.endX;
    this.endY;
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
    stroke(color(255, 0, 0));
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.r, this.r);
  }

  collision() {
    for (let i = 0; i < enemyBombs.length; i++) {
      if (
        collideCircleCircle(
          this.x,
          this.y,
          this.r,
          enemyBombs[i].getX(),
          enemyBombs[i].getY(),
          enemyBombs[i].getR()
        )
      ) {
        backgroundColor = 100;
        console.log("collided");
      }
    }
  }
}
