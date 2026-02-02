// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawInstr() → what the instructions screen looks like
// 2) input handlers → how the player returns to the start screen
// 3) helper functions specific to this screen

// ------------------------------
// Main draw function for instructions screen
// ------------------------------
// drawInstr() is called from main.js
// only when currentScreen === "instr"
function drawInstr() {
  // Light neutral background
  background(240);

  // ---- Screen title ----
  fill(0);
  textAlign(CENTER, TOP);
  textSize(36);
  text("How to Play", width / 2, 80);

  // ---- Instruction text ----
  textSize(18);
  textAlign(CENTER, TOP);

  const lines =
    "You are trapped in a series of rooms under fire.\n\n" +
    "Your goal is to survive by dodging bullets and making decisions.\n\n" +
    "• Move your character using the arrow keys or WASD.\n" +
    "• Bullets will fly across the screen — avoid getting hit.\n" +
    "• Each room presents a choice that affects the story.\n\n" +
    "Your choices change your TRUST level.\n" +
    "High or low trust unlocks different endings.\n\n" +
    "Survive long enough to discover the truth.";

  text(lines, width / 2, 160);

  // ---- Back button ----
  const backBtn = {
    x: width / 2,
    y: 560,
    w: 220,
    h: 70,
    label: "BACK",
  };

  drawInstrButton(backBtn);

  cursor(isHover(backBtn) ? HAND : ARROW);
}

// ------------------------------
// Mouse input for instructions screen
// ------------------------------
function instrMousePressed() {
  const backBtn = { x: width / 2, y: 560, w: 220, h: 70 };

  if (isHover(backBtn)) {
    currentScreen = "start";
  }
}

// ------------------------------
// Keyboard input for instructions screen
// ------------------------------
function instrKeyPressed() {
  if (keyCode === ESCAPE) {
    currentScreen = "start";
  }

  if (key === "b" || key === "B") {
    currentScreen = "start";
  }
}

// ------------------------------
// Button drawing helper (instructions screen)
// ------------------------------
function drawInstrButton({ x, y, w, h, label }) {
  rectMode(CENTER);

  const hover = isHover({ x, y, w, h });

  noStroke();
  fill(hover ? color(200, 200, 255, 200) : color(220, 220, 255, 170));
  rect(x, y, w, h, 12);

  fill(0);
  textSize(26);
  textAlign(CENTER, CENTER);
  text(label, x, y);
}
