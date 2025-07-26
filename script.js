const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let isRunning = false;

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

// Goal
const goal = {
  x: 700,
  y: 290,
  width: 40,
  height: 60,
  color: 'gold',
};

// Obstacles (hazards)
const spikes = [
  { x: 300, y: 340, width: 30, height: 10, color: 'black' },
  { x: 520, y: 340, width: 30, height: 10, color: 'black' },
];

const gravity = 0.5;
const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

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

function update() {
  // Player movement
  if (keys['ArrowLeft'] || keys['a']) {
    player.velocityX = -player.speed;
  } else if (keys['ArrowRight'] || keys['d']) {
    player.velocityX = player.speed;
  } else {
    player.velocityX = 0;
  }

  if ((keys['ArrowUp'] || keys['w'] || keys[' ']) && player.isOnGround) {
    player.velocityY = player.jumpForce;
    player.isOnGround = false;
  }

  player.velocityY += gravity;
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

  // Spike collision
  for (let spike of spikes) {
    if (
      player.x < spike.x + spike.width &&
      player.x + player.width > spike.x &&
      player.y < spike.y + spike.height &&
      player.y + player.height > spike.y
    ) {
      alert('Game Over! You hit an obstacle.');
      resetGame();
    }
  }

  // Win condition
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
  player.velocityX = 0;
  player.velocityY = 0;
  score = 0;
  for (let coin of coins) coin.collected = false;
  isRunning = false;
}

function drawEverything() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let plat of platforms) drawRect(plat);
  for (let coin of coins) drawCoin(coin);
  for (let spike of spikes) drawRect(spike);

  drawRect(enemy);
  drawRect(goal);
  drawRect(player);

  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
  if (!isRunning) return;
  update();
  drawEverything();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  if (!isRunning) {
    isRunning = true;
    gameLoop();
  }
}
