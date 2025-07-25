const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player setup
const player = {
  x: 50,
  y: 300,
  width: 50,
  height: 50,
  color: 'red',
  velocityX: 0,
  velocityY: 0,
  speed: 5,
  jumpForce: -12,
  isOnGround: false,
};

// Platform setup
const platform = {
  x: 0,
  y: 350,
  width: 800,
  height: 50,
  color: 'green',
};

const gravity = 0.5;
const keys = {};

// Handle keyboard events
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Drawing function
function drawRect(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

// Game update logic
function update() {
  // Left/right movement
  if (keys['ArrowLeft'] || keys['a']) {
    player.velocityX = -player.speed;
  } else if (keys['ArrowRight'] || keys['d']) {
    player.velocityX = player.speed;
  } else {
    player.velocityX = 0;
  }

  // Jumping
  if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && player.isOnGround) {
    player.velocityY = player.jumpForce;
    player.isOnGround = false;
  }

  // Apply gravity
  player.velocityY += gravity;

  // Move player
  player.x += player.velocityX;
  player.y += player.velocityY;

  // Simple ground collision
  if (player.y + player.height >= platform.y) {
    player.y = platform.y - player.height;
    player.velocityY = 0;
    player.isOnGround = true;
  } else {
    player.isOnGround = false;
  }
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();

  drawRect(platform);
  drawRect(player);

  requestAnimationFrame(gameLoop);
}

gameLoop();
