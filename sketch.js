const numAsteroids = 500;
const asteroidColor = [50, 205, 50];
const minSpeed = 0.5;
const maxSpeed = 2;
const minSize = 20;
const maxSize = 80;
const minRotationSpeed = -0.0005;
const maxRotationSpeed = 0.001;

let asteroids = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // ...
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);

  let largeAsteroids = 0;

  for (let i = 0; i < asteroids.length; i++) {
    let a = asteroids[i];

    // Update asteroid position
    a.pos.add(a.vel);

    // Update asteroid rotation
    a.rotation += a.rotationSpeed;

    // Wrap around screen
    if (a.pos.x < 0) a.pos.x = width;
    if (a.pos.x > width) a.pos.x = 0;
    if (a.pos.y < 0) a.pos.y = height;
    if (a.pos.y > height) a.pos.y = 0;

    // Draw asteroid
    stroke(asteroidColor);
    strokeWeight(1);
    noFill();
    push();
    translate(a.pos.x, a.pos.y);
    rotate(a.rotation);
    beginShape();
    for (let j = 0; j < a.vertices.length; j++) {
      vertex(a.vertices[j].x, a.vertices[j].y);
    }
    endShape(CLOSE);
    pop();

    // Check for collisions
    for (let j = i + 1; j < asteroids.length; j++) {
      let b = asteroids[j];
      let d = dist(a.pos.x, a.pos.y, b.pos.x, b.pos.y);
      if (d < a.size / 2 + b.size / 2) {
        // Collision detected
        if (a.size > minSize) {
          asteroids.push(createAsteroid(a.pos.x, a.pos.y, a.size / 2));
        }
        if (b.size > minSize) {
          asteroids.push(createAsteroid(b.pos.x, b.pos.y, b.size / 2));
        }
        asteroids.splice(j, 1);
        asteroids.splice(i, 1);
        i--;
        break;
      }
    }

    if (a.size >= maxSize / 2) {
      largeAsteroids++;
    }
  }

  if (largeAsteroids === 0) {
    let newAsteroids = floor(random(3, 103));
    for (let i = 0; i < newAsteroids; i++) {
      asteroids.push(createAsteroid());
    }
  }
}

function createAsteroid(x = random(width), y = random(height), size = random(minSize, maxSize)) {
  let numVertices = floor(random(5, 10));
  let vertices = [];
  for (let i = 0; i < numVertices; i++) {
    let angle = map(i, 0, numVertices, 0, TWO_PI);
    let r = size / 2 + random(-size / 4, size / 4);
    let vx = r * cos(angle);
    let vy = r * sin(angle);
    vertices.push(createVector(vx, vy));
  }

  let speed = map(size, minSize, maxSize, maxSpeed, minSpeed);
  let vel = p5.Vector.random2D().mult(speed);
  let rotationSpeed = random(minRotationSpeed, maxRotationSpeed);

  return {
    pos: createVector(x, y),
    size: size,
    vertices: vertices,
    vel: vel,
    rotation: 0,
    rotationSpeed: rotationSpeed,
  };
}