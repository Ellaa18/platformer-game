const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

let gameRunning = false;
let gameOver = false;
let score = 0;

// Player setup
const player = {
  x: 100,
  y: CANVAS_HEIGHT - 150,
  width: 50,
  height: 50,
  color: "red",
  dy: 0,
  jumping: false,
};

// Platforms
const platforms = [
  { x: 0, y: CANVAS_HEIGHT - 20, width: CANVAS_WIDTH, height: 20 }, // ground
  { x: 300, y: CANVAS_HEIGHT - 150, width: 150, height: 20 },
  { x: 600, y: CANVAS_HEIGHT - 250, width: 150, height: 20 },
  { x: 850, y: CANVAS_HEIGHT - 180, width: 100, height: 20 },
];

// Obstacles
const obstacles = [
  { x: 500, y: CANVAS_HEIGHT - 70, width: 30, height: 30 },
  { x: 770, y: CANVAS_HEIGHT - 100, width: 30, height: 30 },
];

// Moving enemy
const enemy = {
  x: 700,
  y: CANVAS_HEIGHT - 80,
  width: 40,
  height: 40,
  dx: 3,
  color: "purple",
};

// Finish line
const goal = {
  x: CANVAS_WIDTH - 40,
  y: CANVAS_HEIGHT - 300,
  width: 10,
  height: 280,
  color: "yellow",
};

const gravity = 1.5;
const jumpForce = 20;

// Input handling
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Drawing functions
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = "#4CAF50";
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));
}

function drawObstacles() {
  ctx.fillStyle = "#000";
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.width, o.height));
}

function drawEnemy() {
  ctx.fillStyle = enemy.color;
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}

function drawGoal() {
  ctx.fillStyle = goal.color;
  ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
  ctx.fillStyle = "black";
  ctx.font = "bold 16px Arial";
  ctx.fillText("FINISH", goal.x - 10, goal.y - 10);
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 20, 40);
}

// Game logic
function checkPlatformCollision() {
  let onGround = false;
  platforms.forEach(p => {
    if (
      player.y + player.height <= p.y &&
      player.y + player.height + player.dy >= p.y &&
      player.x + player.width > p.x &&
      player.x < p.x + p.width
    ) {
      player.jumping = false;
      player.dy = 0;
      player.y = p.y - player.height;
      onGround = true;
    }
  });

  if (!onGround) player.dy += gravity;
}

function checkObstacleCollision() {
  for (const o of obstacles) {
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      endGame();
      return;
    }
  }

  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    endGame();
  }
}

function movePlayer() {
  if (keys["ArrowRight"] || keys["d"]) player.x += 5;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= 5;

  if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && !player.jumping) {
    player.dy = -jumpForce;
    player.jumping = true;
  }

  player.y += player.dy;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > CANVAS_WIDTH) player.x = CANVAS_WIDTH - player.width;
}

function moveEnemy() {
  enemy.x += enemy.dx;
  if (enemy.x < 600 || enemy.x + enemy.width > 900) {
    enemy.dx *= -1;
  }
}

function checkGoal() {
  if (
    player.x + player.width > goal.x &&
    player.x < goal.x + goal.width &&
    player.y + player.height > goal.y &&
    player.y < goal.y + goal.height
  ) {
    endGame(true);
  }
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  movePlayer();
  moveEnemy();
  checkPlatformCollision();
  checkObstacleCollision();
  checkGoal();

  drawPlatforms();
  drawObstacles();
  drawEnemy();
  drawGoal();
  drawPlayer();
  drawScore();

  score++;

  requestAnimationFrame(gameLoop);
}

// UI Functions
function startGame() {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-over-screen").classList.add("hidden");
  resetPlayer();
  gameRunning = true;
  gameOver = false;
  score = 0;
  gameLoop();
}

function restartGame() {
  document.getElementById("game-over-screen").classList.add("hidden");
  resetPlayer();
  gameRunning = true;
  gameOver = false;
  score = 0;
  gameLoop();
}

function exitGame() {
  alert("Thanks for playing!");
  window.location.reload();
}

function endGame(won = false) {
  gameRunning = false;
  gameOver = true;
  const message = won ? "🎉 You Win!" : "Game Over!";
  document.getElementById("game-over-message").textContent = message;
  document.getElementById("game-over-screen").classList.remove("hidden");
}

function resetPlayer() {
  player.x = 100;
  player.y = CANVAS_HEIGHT - 150;
  player.dy = 0;
  player.jumping = false;
}
