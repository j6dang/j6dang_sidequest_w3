// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawLose() → what the lose screen looks like
// 2) input handlers → how the player returns to the start screen
//
// This screen represents LOSING by getting hit before time runs out.

// ------------------------------
// Main draw function for lose screen
// ------------------------------
// drawLose() is called from main.js
// only when currentScreen === "lose"
function drawLose() {
  // Dark red / danger background
  background(120, 20, 20);

  fill(255);
  textAlign(CENTER, CENTER);

  // Main failure message
  textSize(40);
  text("You Were Hit.", width / 2, 260);

  // Subtext explaining the loss condition
  textSize(22);
  text("You failed to dodge the bullets in time.", width / 2, 320);

  // Instruction text
  textSize(18);
  text("Click or press R to try again.", width / 2, 380);
}

// ------------------------------
// Mouse input for lose screen
// ------------------------------
// Any mouse click returns the player to the start screen
function loseMousePressed() {
  currentScreen = "start";
}

// ------------------------------
// Keyboard input for lose screen
// ------------------------------
// R is commonly used for “restart” in games
function loseKeyPressed() {
  if (key === "r" || key === "R") {
    currentScreen = "start";
  }
}
