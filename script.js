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

// Platforms
const platforms = [
  { x: 0, y: 350, width: 800, height: 50, color: 'green' },
  { x: 200, y: 250, width: 100, height: 20, color: 'green' },
  { x: 400, y: 180, width: 120, height: 20, color: 'green' },
];

// Coins
let score = 0;
const coins = [
  { x: 230, y: 220, width: 20, height: 20, color: 'gold', collected: false },
  { x: 440, y: 150, width: 20, height: 20, color: 'gold', collected: false },
];

// Enemy
const enemy = {
  x: 600,
  y: 310,
  width: 40,
  height: 40,
  color: 'purple',
  speed: 2,
  direction: -1,
};

// Goal (NEW)
const goal = {
  x: 700,
  y: 290,
  width: 40,
  height: 60,
  color: 'gold',
};

const gravity = 0.5;
const keys = {};

// Key listeners
document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Drawing functions
function drawRect(obj) {
  ctx.fillStyle = obj.color;
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function drawCoin(coin) {
  if (!coin.collected) {
    ctx.fillStyle = coin.color;
    ctx.beginPath();
    ctx.arc(
      coin.x + coin.width / 2,
      coin.y + coin.height / 2,
      coin.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

// Game update
function update() {
  // Player movement
  if (keys['ArrowLeft'] || keys['a']) {
    player.velocityX = -player.speed;
  } else if (keys['ArrowRight'] || keys['d']) {
    player.velocityX = player.speed;
  } else {
    player.velocityX = 0;
  }

  // Jump
  if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && player.isOnGround) {
    player.velocityY = player.jumpForce;
    player.isOnGround = false;
  }

  // Apply gravity
  player.velocityY += gravity;

  // Move player
  player.x += player.velocityX;
  player.y += player.velocityY;

  // Platform collision
  player.isOnGround = false;
  for (let plat of platforms) {
    if (
      player.x < plat.x + plat.width &&
      player.x + player.width > plat.x &&
      player.y + player.height < plat.y + 10 &&
      player.y + player.height + player.velocityY >= plat.y
    ) {
      player.y = plat.y - player.height;
      player.velocityY = 0;
      player.isOnGround = true;
    }
  }

  // Coin collection
  for (let coin of coins) {
    if (
      !coin.collected &&
      player.x < coin.x + coin.width &&
      player.x + player.width > coin.x &&
      player.y < coin.y + coin.height &&
      player.y + player.height > coin.y
    ) {
      coin.collected = true;
      score += 1;
    }
  }

  // Enemy movement
  enemy.x += enemy.speed * enemy.direction;
  if (enemy.x <= 500 || enemy.x + enemy.width >= 750) {
    enemy.direction *= -1;
  }

  // Enemy collision
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    alert('Game Over! You touched the enemy.');
    resetGame();
  }

  // Check for win condition
  const allCollected = coins.every((c) => c.collected);
  if (
    allCollected &&
    player.x < goal.x + goal.width &&
    player.x + player.width > goal.x &&
    player.y < goal.y + goal.height &&
    player.y + player.height > goal.y
  ) {
    alert('🎉 You win the game!');
    resetGame();
  }
}

function resetGame() {
  player.x = 50;
  player.y = 300;
  score = 0;
  for (let coin of coins) {
    coin.collected = false;
  }
}

// Main game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  update();

  // Draw platforms
  for (let plat of platforms) {
    drawRect(plat);
  }

  // Draw coins
  for (let coin of coins) {
    drawCoin(coin);
  }

  // Draw enemy
  drawRect(enemy);

  // Draw goal (NEW)
  drawRect(goal);

  // Draw player
  drawRect(player);

  // Draw score
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);

  requestAnimationFrame(gameLoop);
}

gameLoop();
