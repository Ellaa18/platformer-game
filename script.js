const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Audio
const coinSound = document.getElementById("coinSound");
const jumpSound = document.getElementById("jumpSound");

// Images
const playerImage = new Image();
playerImage.src = "p1_walk01.png";

const coinImage = new Image();
coinImage.src = "coinGold.png";

// Player
const player = {
  x: 100,
  y: 300,
  width: 40,
  height: 60,
  dx: 0,
  dy: 0,
  jumping: false
};

// Platforms (added more platforms)
const platforms = [
  { x: 0, y: 400, width: 1000, height: 20 },
  { x: 300, y: 300, width: 100, height: 20 },
  { x: 500, y: 250, width: 100, height: 20 },
  { x: 700, y: 200, width: 100, height: 20 },
  { x: 850, y: 150, width: 100, height: 20 } // additional platform
];

// Obstacles
const enemies = [
  { x: 300, y: 380, width: 20, height: 20, dx: 2, minX: 250, maxX: 400 } // limited movement
];

// Tree obstacle
const obstacle = { x: 600, y: 360, width: 30, height: 40 };

// Coins
const coins = [
  { x: 200, y: 360, width: 20, height: 20, collected: false },
  { x: 500, y: 220, width: 20, height: 20, collected: false },
  { x: 800, y: 120, width: 20, height: 20, collected: false }
];

// End goal
const goal = { x: 950, y: 120, width: 30, height: 40 };

// Game State
let isGameRunning = false;
let gamePaused = false;
let score = 0;
let highScore = 0;

const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Mobile Controls
document.getElementById("leftBtn").addEventListener("touchstart", () => keys["ArrowLeft"] = true);
document.getElementById("leftBtn").addEventListener("touchend", () => keys["ArrowLeft"] = false);
document.getElementById("rightBtn").addEventListener("touchstart", () => keys["ArrowRight"] = true);
document.getElementById("rightBtn").addEventListener("touchend", () => keys["ArrowRight"] = false);
document.getElementById("jumpBtn").addEventListener("touchstart", () => {
  if (!player.jumping) {
    player.dy = -10;
    player.jumping = true;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }
});

function startGame() {
  document.getElementById("start-screen").classList.add("hidden");
  isGameRunning = true;
  gameLoop();
}

function restartGame() {
  score = 0;
  player.x = 100;
  player.y = 300;
  coins.forEach(c => c.collected = false);
  document.getElementById("game-over-screen").classList.add("hidden");
  isGameRunning = true;
  gameLoop();
}

function exitGame() {
  window.close();
}

function drawPlayer() {
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = "#654321";
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));
}

function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));
}

// 🆕 Draw Tree Obstacle
function drawObstacle() {
  ctx.fillStyle = "green";
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawCoins() {
  coins.forEach(c => {
    if (!c.collected) {
      ctx.drawImage(coinImage, c.x, c.y, c.width, c.height);
    }
  });
}

function drawGoal() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("High Score: " + highScore, 10, 40);
}

function movePlayer() {
  if ((keys["ArrowUp"] || keys[" "]) && !player.jumping) {
    player.dy = -10;
    player.jumping = true;
    jumpSound.currentTime = 0;
    jumpSound.play();
  }

  if (keys["ArrowLeft"]) player.dx = -5;
  else if (keys["ArrowRight"]) player.dx = 5;
  else player.dx = 0;
}

function updatePlayer() {
  player.x += player.dx;
  player.y += player.dy;
  player.dy += 0.5;

  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height >= p.y &&
      player.y + player.height <= p.y + p.height
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.jumping = false;
    }
  });

  // Collision with obstacle
  if (
    player.x < obstacle.x + obstacle.width &&
    player.x + player.width > obstacle.x &&
    player.y < obstacle.y + obstacle.height &&
    player.y + player.height > obstacle.y
  ) {
    gameOver(false);
  }
}

function updateEnemies() {
  enemies.forEach(e => {
    e.x += e.dx;
    if (e.x < e.minX || e.x + e.width > e.maxX) e.dx *= -1;

    if (
      player.x < e.x + e.width &&
      player.x + player.width > e.x &&
      player.y < e.y + e.height &&
      player.y + player.height > e.y
    ) {
      gameOver(false);
    }
  });
}

function checkCoinCollection() {
  coins.forEach(c => {
    if (
      !c.collected &&
      player.x < c.x + c.width &&
      player.x + player.width > c.x &&
      player.y < c.y + c.height &&
      player.y + player.height > c.y
    ) {
      c.collected = true;
      score += 10;
      coinSound.currentTime = 0;
      coinSound.play();
    }
  });
}

function checkWin() {
  if (
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    gameOver(true);
  }
}

function gameOver(win) {
  isGameRunning = false;
  document.getElementById("game-over-message").innerText = win ? "You Win!" : "Game Over!";
  document.getElementById("game-over-screen").classList.remove("hidden");
  if (score > highScore) highScore = score;
}

function gameLoop() {
  if (!isGameRunning || gamePaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  updatePlayer();
  updateEnemies();
  checkCoinCollection();
  checkWin();

  drawPlatforms();
  drawEnemies();
  drawObstacle(); // 🆕 draw the new tree obstacle
  drawCoins();
  drawGoal();
  drawPlayer();
  drawScore();

  requestAnimationFrame(gameLoop);
}
