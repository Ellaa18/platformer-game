const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameRunning = false;
let gameOver = false;

// Player
const player = {
  x: 100,
  y: canvas.height - 150,
  width: 50,
  height: 50,
  color: "red",
  dy: 0,
  jumping: false,
};

// Platforms
const platforms = [
  { x: 0, y: canvas.height - 20, width: canvas.width, height: 20 },
  { x: 300, y: canvas.height - 150, width: 150, height: 20 },
  { x: 600, y: canvas.height - 250, width: 150, height: 20 },
  { x: 900, y: canvas.height - 200, width: 150, height: 20 },
];

// Obstacles
const obstacles = [
  { x: 500, y: canvas.height - 70, width: 30, height: 30 },
  { x: 800, y: canvas.height - 100, width: 30, height: 30 },
];

// Gravity
const gravity = 1.5;
const jumpForce = 20;

// Controls
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = "green";
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));
}

function drawObstacles() {
  ctx.fillStyle = "black";
  obstacles.forEach(o => ctx.fillRect(o.x, o.y, o.width, o.height));
}

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
  if (!onGround) {
    player.dy += gravity;
  }
}

function checkObstacleCollision() {
  obstacles.forEach(o => {
    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      endGame();
    }
  });
}

function movePlayer() {
  if (keys["ArrowRight"] || keys["d"]) player.x += 5;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= 5;
  if ((keys["ArrowUp"] || keys["w"] || keys[" "]) && !player.jumping) {
    player.dy = -jumpForce;
    player.jumping = true;
  }

  player.y += player.dy;
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  checkPlatformCollision();
  checkObstacleCollision();

  drawPlatforms();
  drawObstacles();
  drawPlayer();

  requestAnimationFrame(gameLoop);
}

// UI Functions
function startGame() {
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-over-screen").classList.add("hidden");
  resetPlayer();
  gameRunning = true;
  gameOver = false;
  gameLoop();
}

function restartGame() {
  document.getElementById("game-over-screen").classList.add("hidden");
  resetPlayer();
  gameRunning = true;
  gameOver = false;
  gameLoop();
}

function exitGame() {
  window.close();
}

function endGame() {
  gameRunning = false;
  gameOver = true;
  document.getElementById("game-over-screen").classList.remove("hidden");
}

function resetPlayer() {
  player.x = 100;
  player.y = canvas.height - 150;
  player.dy = 0;
  player.jumping = false;
}
