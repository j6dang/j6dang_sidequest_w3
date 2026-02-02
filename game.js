// game.js
// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
//
// Dodge bullets until the timer reaches 0.
// - Survive timer -> currentScreen = "win"
// - Get hit -> currentScreen = "lose"

// ------------------------------------------------------------
// Fallback helpers (prevents runtime freezes)
// ------------------------------------------------------------
if (typeof clamp !== "function") {
  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }
}

if (typeof drawTopBar !== "function") {
  function drawTopBar() {
    if (typeof player !== "object") return;

    const bx = 28,
      by = 22,
      bw = width - 56,
      bh = 14;

    noStroke();
    fill(255, 255, 255, 120);
    rectMode(CORNER);
    rect(bx, by, bw, bh, 8);

    const pct = clamp((player.trust || 0) / 100, 0, 1);
    fill(80, 170, 180, 200);
    rect(bx, by, bw * pct, bh, 8);

    fill(235);
    textAlign(LEFT, TOP);
    textSize(12);
    text(`TRUST: ${player.trust}`, bx, by + bh + 6);
  }
}

if (typeof player !== "object") {
  var player = { trust: 50 };
}

// ------------------------------------------------------------
// Local game state
// ------------------------------------------------------------
let dodger = { x: 0, y: 0, r: 10, speed: 4.2 };
let bullets = [];
let spawnTimer = 0;

let room = {
  secondsToSurvive: 8,
  startedAtMs: 0,
};

// ------------------------------------------------------------
// Core loop
// ------------------------------------------------------------
function drawGame() {
  if (room.startedAtMs === 0) initRoom();

  background(18, 20, 26);

  drawTopBar();
  drawHeader();

  const arena = getArenaRect();
  drawArena(arena);

  updateDodger(arena);
  updateBullets(arena);

  drawDodger();
  drawBullets();

  if (checkCollision()) {
    onHit();
    return;
  }

  updateSurvivalUI(arena);

  cursor(ARROW);
}

// ------------------------------------------------------------
// Input handlers
// ------------------------------------------------------------
function gameMousePressed() {
  // no clicking needed
}

function gameKeyPressed() {
  if (keyCode === ESCAPE) {
    resetRoundState();
    currentScreen = "start";
  }
}

// ------------------------------------------------------------
// Round reset (prevents broken restarts)
// ------------------------------------------------------------
function resetRoundState() {
  bullets = [];
  spawnTimer = 0;
  room.startedAtMs = 0;
}

// ------------------------------------------------------------
// Setup room
// ------------------------------------------------------------
function initRoom() {
  const arena = getArenaRect();

  dodger.x = arena.x + arena.w * 0.22;
  dodger.y = arena.y + arena.h * 0.55;

  bullets = [];
  spawnTimer = 0;

  room.startedAtMs = millis();
}

// ------------------------------------------------------------
// Arena / HUD drawing
// ------------------------------------------------------------
function getArenaRect() {
  return { x: 60, y: 90, w: width - 120, h: height - 180 };
}

function drawArena(a) {
  noStroke();
  fill(0, 0, 0, 70);
  rectMode(CORNER);
  rect(a.x, a.y, a.w, a.h, 16);

  stroke(255, 255, 255, 18);
  strokeWeight(2);
  noFill();
  rect(a.x + 10, a.y + 10, a.w - 20, a.h - 20, 12);
  noStroke();
}

function drawHeader() {
  fill(235);
  textAlign(CENTER, CENTER);
  textSize(22);
  text("DODGE PROTOCOL", width / 2, 56);

  fill(170);
  textSize(14);
  text(
    "Move with WASD / Arrow Keys. Survive until the timer hits 0.",
    width / 2,
    76,
  ); // <- removed trailing comma
}

// ------------------------------------------------------------
// Dodger movement
// ------------------------------------------------------------
function updateDodger(arena) {
  let dx = 0,
    dy = 0;

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) dx -= 1; // A
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) dx += 1; // D
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) dy -= 1; // W
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) dy += 1; // S

  if (dx !== 0 && dy !== 0) {
    dx *= 0.7071;
    dy *= 0.7071;
  }

  dodger.x += dx * dodger.speed;
  dodger.y += dy * dodger.speed;

  dodger.x = clamp(dodger.x, arena.x + dodger.r, arena.x + arena.w - dodger.r);
  dodger.y = clamp(dodger.y, arena.y + dodger.r, arena.y + arena.h - dodger.r);
}

function drawDodger() {
  noStroke();
  fill(90, 210, 220, 70);
  ellipse(dodger.x, dodger.y, dodger.r * 5.0, dodger.r * 5.0);

  fill(90, 210, 220);
  ellipse(dodger.x, dodger.y, dodger.r * 2, dodger.r * 2);
}

// ------------------------------------------------------------
// Bullets
// ------------------------------------------------------------
function updateBullets(arena) {
  spawnTimer -= typeof deltaTime === "number" ? deltaTime : 16;

  if (spawnTimer <= 0) {
    spawnBullet(arena);
    spawnTimer = 420;
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx;
    b.y += b.vy;

    if (
      b.x < arena.x - 120 ||
      b.x > arena.x + arena.w + 120 ||
      b.y < arena.y - 120 ||
      b.y > arena.y + arena.h + 120
    ) {
      bullets.splice(i, 1);
    }
  }
}

function spawnBullet(arena) {
  const edge = Math.floor(random(4));
  let x, y;

  if (edge === 0) {
    x = random(arena.x, arena.x + arena.w);
    y = arena.y - 40;
  } else if (edge === 1) {
    x = arena.x + arena.w + 40;
    y = random(arena.y, arena.y + arena.h);
  } else if (edge === 2) {
    x = random(arena.x, arena.x + arena.w);
    y = arena.y + arena.h + 40;
  } else {
    x = arena.x - 40;
    y = random(arena.y, arena.y + arena.h);
  }

  const targetX = dodger.x + random(-40, 40);
  const targetY = dodger.y + random(-40, 40);
  const angle = atan2(targetY - y, targetX - x);

  const speed = 5.0;
  bullets.push({
    x,
    y,
    r: random(7, 11),
    vx: cos(angle) * speed,
    vy: sin(angle) * speed,
  });
}

function drawBullets() {
  for (const b of bullets) {
    noStroke();
    fill(255, 140, 90, 140);
    push();
    translate(b.x, b.y);
    rotate(atan2(b.vy, b.vx));
    rectMode(CENTER);
    rect(10, 0, b.r * 3.2, b.r * 0.5, 8);
    pop();

    fill(255, 210, 140);
    ellipse(b.x, b.y, b.r * 2, b.r * 2);

    fill(255, 255, 255, 120);
    ellipse(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.7, b.r * 0.7);
  }
}

// ------------------------------------------------------------
// Collision + outcomes
// ------------------------------------------------------------
function checkCollision() {
  for (const b of bullets) {
    if (dist(dodger.x, dodger.y, b.x, b.y) < dodger.r + b.r) return true;
  }
  return false;
}

function onHit() {
  player.trust = clamp((player.trust || 0) - 12, 0, 100);
  resetRoundState();
  currentScreen = "lose";
}

// ------------------------------------------------------------
// Survival timer UI + win condition
// ------------------------------------------------------------
function updateSurvivalUI(arena) {
  const elapsed = (millis() - room.startedAtMs) / 1000;
  const remaining = Math.max(0, room.secondsToSurvive - elapsed);

  const barW = arena.w - 40;
  const barH = 12;
  const bx = arena.x + 20;
  const by = arena.y - 28;

  noStroke();
  fill(255, 255, 255, 55);
  rectMode(CORNER);
  rect(bx, by, barW, barH, 8);

  const pct = clamp(1 - remaining / room.secondsToSurvive, 0, 1);
  fill(90, 210, 220, 180);
  rect(bx, by, barW * pct, barH, 8);

  fill(230);
  textAlign(LEFT, CENTER);
  textSize(12);
  text(`SURVIVE: ${remaining.toFixed(1)}s`, bx, by - 14);

  if (remaining <= 0) {
    player.trust = clamp((player.trust || 0) + 10, 0, 100);
    resetRoundState();
    currentScreen = "win";
  }
}
