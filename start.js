// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawStart() → what the start/menu screen looks like
// 2) input handlers → what happens on click / key press on this screen
// 3) a helper function to draw menu buttons

// ------------------------------------------------------------
// Start screen visuals
// ------------------------------------------------------------
// drawStart() is called from main.js only when:
// currentScreen === "start"
function drawStart() {
  // Dark, tense backdrop
  background(18, 20, 26);

  // Subtle scanlines (texture)
  noStroke();
  for (let y = 0; y < height; y += 6) {
    fill(255, 255, 255, 6);
    rect(0, y, width, 2);
  }

  // ---- Title text ----
  fill(245);
  textSize(54);
  textAlign(CENTER, CENTER);
  text("DODGE PROTOCOL", width / 2, 120);

  // ---- Subtitle ----
  fill(180);
  textSize(18);
  text("Survive the bullets. Shape the story.", width / 2, 165);

  // ---- Decorative preview panel (mini arena + bullets) ----
  drawPreviewPanel(width / 2, 310, 520, 240);

  // ---- Buttons (data only) ----
  const startBtn = {
    x: width / 2,
    y: 500,
    w: 260,
    h: 70,
    label: "START RUN",
  };

  const instrBtn = {
    x: width / 2,
    y: 585,
    w: 260,
    h: 70,
    label: "INSTRUCTIONS",
  };

  // Draw both buttons
  drawButton(startBtn);
  drawButton(instrBtn);

  // ---- Cursor feedback ----
  const over = isHover(startBtn) || isHover(instrBtn);
  cursor(over ? HAND : ARROW);

  // ---- Footer hints ----
  fill(140);
  textSize(14);
  text("ENTER = start   |   I = instructions", width / 2, height - 24);
}

// ------------------------------------------------------------
// Mouse input for the start screen
// ------------------------------------------------------------
// Called from main.js only when currentScreen === "start"
function startMousePressed() {
  const startBtn = { x: width / 2, y: 500, w: 260, h: 70 };
  const instrBtn = { x: width / 2, y: 585, w: 260, h: 70 };

  if (isHover(startBtn)) {
    // Optional reset hook if your main.js defines it
    if (typeof resetRun === "function") resetRun();
    currentScreen = "game";
  } else if (isHover(instrBtn)) {
    currentScreen = "instr";
  }
}

// ------------------------------------------------------------
// Keyboard input for the start screen
// ------------------------------------------------------------
// Provides keyboard shortcuts:
// - ENTER starts the game
// - I opens instructions
function startKeyPressed() {
  if (keyCode === ENTER) {
    if (typeof resetRun === "function") resetRun();
    currentScreen = "game";
  }

  if (key === "i" || key === "I") {
    currentScreen = "instr";
  }
}

// ------------------------------------------------------------
// Helper: drawButton()
// ------------------------------------------------------------
function drawButton({ x, y, w, h, label }) {
  rectMode(CENTER);

  const hover = isHover({ x, y, w, h });

  noStroke();

  if (hover) {
    fill(235, 90, 75);
    drawingContext.shadowBlur = 18;
    drawingContext.shadowColor = color(235, 90, 75, 120);
  } else {
    fill(60, 70, 85);
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = color(0, 0, 0, 90);
  }

  rect(x, y, w, h, 14);

  drawingContext.shadowBlur = 0;

  fill(245);
  textSize(22);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}

// ------------------------------------------------------------
// Helper: preview panel (start screen only)
// ------------------------------------------------------------
function drawPreviewPanel(cx, cy, w, h) {
  const x = cx - w / 2;
  const y = cy - h / 2;

  rectMode(CORNER);
  noStroke();

  // Panel
  fill(255, 255, 255, 10);
  rect(x, y, w, h, 18);

  // Inner frame
  stroke(255, 255, 255, 18);
  strokeWeight(2);
  noFill();
  rect(x + 10, y + 10, w - 20, h - 20, 14);
  noStroke();

  // “Arena” region
  const ax = x + 26;
  const ay = y + 38;
  const aw = w - 52;
  const ah = h - 78;

  fill(0, 0, 0, 55);
  rect(ax, ay, aw, ah, 14);

  // Animated hint (uses frameCount; no draw() needed here)
  const t = frameCount * 0.03;

  // Player dot
  const px = ax + aw * 0.3 + sin(t * 1.1) * 10;
  const py = ay + ah * 0.62 + cos(t * 0.9) * 10;

  fill(90, 210, 220, 60);
  ellipse(px, py, 44, 44);

  fill(90, 210, 220);
  ellipse(px, py, 18, 18);

  // Bullets
  drawBullet(ax + aw * 0.95 - ((t * 150) % (aw + 80)), ay + ah * 0.28, 18);
  drawBullet(ax + aw * 0.95 - ((t * 200 + 70) % (aw + 120)), ay + ah * 0.5, 14);
  drawBullet(
    ax + aw * 0.95 - ((t * 240 + 140) % (aw + 160)),
    ay + ah * 0.72,
    20,
  );

  // Story prompt + stat note
  fill(220);
  textAlign(LEFT, TOP);
  textSize(16);
  text(
    "You woke up with a target on your back.\nEvery room is a decision.\nEvery decision changes what the bullets mean.",
    x + 30,
    y + 18,
  );

  fill(160);
  textSize(14);
  text("Tracked stat: TRUST (unlocks endings)", x + 30, y + h - 30);
}

function drawBullet(x, y, s) {
  noStroke();
  fill(255, 210, 140);
  ellipse(x, y, s, s);

  fill(255, 140, 90, 140);
  rectMode(CENTER);
  rect(x + s * 0.9, y, s * 2.2, s * 0.35, 8);

  fill(255, 255, 255, 120);
  ellipse(x - s * 0.15, y - s * 0.15, s * 0.35, s * 0.35);
}
