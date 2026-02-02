// NOTE: Do NOT add setup() or draw() in this file
// setup() and draw() live in main.js
// This file only defines:
// 1) drawWin() → what the win screen looks like
// 2) input handlers → how the player returns to the start screen
//
// This screen represents winning by SURVIVING the bullets.

// ------------------------------------------------------------
// Main draw function for win screen
// ------------------------------------------------------------
// drawWin() is called from main.js
// only when currentScreen === "win"
function drawWin() {
  // Green-tinted background to communicate survival/success
  background(200, 255, 200);

  fill(0);
  textAlign(CENTER, CENTER);

  // Main success message
  textSize(40);
  text("You Survived.", width / 2, 260);

  // Subtext clarifying win condition
  textSize(22);
  text("You dodged the bullets and made it out alive.", width / 2, 320);

  // Instruction text
  textSize(18);
  text("Click or press R to return to Start.", width / 2, 380);
}

// ------------------------------------------------------------
// Mouse input for win screen
// ------------------------------------------------------------
// Any mouse click returns the player to the start screen
function winMousePressed() {
  currentScreen = "start";
}

// ------------------------------------------------------------
// Keyboard input for win screen
// ------------------------------------------------------------
// R is commonly used for “restart” in games
function winKeyPressed() {
  if (key === "r" || key === "R") {
    currentScreen = "start";
  }
}
